# Guide Complet - Configuration VirtualBox

## 🎯 Choix du Système d'Exploitation

**Vous n'avez PAS besoin de Kali Linux !** N'importe quel OS fonctionne :

### Options Recommandées (du plus simple au plus avancé)

1. **Windows 10/11** ⭐ (Le plus simple)
   - Interface familière
   - Python facile à installer
   - Pas de problèmes de permissions

2. **Ubuntu Desktop** ⭐⭐ (Recommandé pour Linux)
   - Gratuit et léger
   - Python pré-installé
   - Interface graphique

3. **Linux Mint** ⭐⭐
   - Similaire à Ubuntu
   - Très user-friendly

4. **Debian** ⭐⭐⭐
   - Plus léger
   - Interface plus basique

**Recommandation** : Utilisez **Windows 10/11** pour la simplicité, ou **Ubuntu Desktop** si vous préférez Linux.

---

## 📋 Étape 1 : Créer la Première VM (Attaquant)

### 1.1 Créer une Nouvelle VM

1. Ouvrir **VirtualBox**
2. Cliquer sur **"Nouvelle"** (ou **"New"**)
3. Remplir les informations :
   - **Nom** : `VM-Attaquant` (ou `Attacker-VM`)
   - **Type** : 
     - Si Windows : `Microsoft Windows`
     - Si Linux : `Linux`
   - **Version** :
     - Windows : `Windows 10 (64-bit)` ou `Windows 11 (64-bit)`
     - Linux : `Ubuntu (64-bit)` ou `Debian (64-bit)`
4. Cliquer sur **"Suivant"**

### 1.2 Allouer la Mémoire RAM

- **Minimum** : 2048 MB (2 Go)
- **Recommandé** : 4096 MB (4 Go)
- Cliquer sur **"Suivant"**

### 1.3 Créer le Disque Dur Virtuel

1. Sélectionner **"Créer un disque dur virtuel maintenant"**
2. Cliquer sur **"Créer"**
3. Type de fichier : **VDI (VirtualBox Disk Image)**
4. Stockage : **Dynamiquement alloué** (recommandé)
5. Taille : **Au moins 20 Go** (30 Go recommandé)
6. Cliquer sur **"Créer"**

### 1.4 Installer le Système d'Exploitation

1. Sélectionner la VM créée
2. Cliquer sur **"Démarrer"**
3. Sélectionner le fichier ISO du système d'exploitation :
   - **Windows** : ISO Windows 10/11 (télécharger depuis Microsoft)
   - **Ubuntu** : ISO Ubuntu Desktop (télécharger depuis ubuntu.com)
4. Suivre l'installation normale du système

**⚠️ Important** : Notez le nom d'utilisateur et mot de passe créés !

---

## 📋 Étape 2 : Créer la Deuxième VM (Victime)

**Répéter exactement les mêmes étapes** que pour la VM Attaquant :

1. Créer une nouvelle VM nommée `VM-Victime` (ou `Victim-VM`)
2. Même configuration (RAM, disque)
3. Installer le même OS ou un autre (peu importe)

---

## 🌐 Étape 3 : Configurer le Réseau Interne

### 3.1 Configurer la VM Attaquant

1. **Arrêter la VM** si elle est en cours d'exécution
2. Sélectionner **VM-Attaquant**
3. Cliquer sur **"Paramètres"** (icône engrenage) ou **Fichier → Paramètres**
4. Aller dans l'onglet **"Réseau"**
5. **Adapter 1** :
   - ✅ Cocher **"Activer l'adaptateur réseau"**
   - **Mode d'accès réseau** : Sélectionner **"Réseau Interne"**
   - **Nom** : Taper `lab-network` (ou laisser vide, VirtualBox créera un réseau)
6. Cliquer sur **"OK"**

### 3.2 Configurer la VM Victime

**Répéter exactement les mêmes étapes** :

1. Sélectionner **VM-Victime**
2. **Paramètres** → **Réseau**
3. **Adapter 1** :
   - ✅ Cocher **"Activer l'adaptateur réseau"**
   - **Mode d'accès réseau** : **"Réseau Interne"**
   - **Nom** : `lab-network` (⚠️ **LE MÊME NOM** que pour l'attaquant)
4. Cliquer sur **"OK"**

**✅ Les deux VMs doivent avoir le même nom de réseau interne !**

---

## 🔍 Étape 4 : Trouver l'Adresse IP de l'Attaquant

### 4.1 Démarrer la VM Attaquant

1. Démarrer **VM-Attaquant**
2. Se connecter avec votre utilisateur

### 4.2 Trouver l'IP (Windows)

1. Ouvrir **Invite de commandes** (cmd) ou **PowerShell**
2. Taper :
   ```cmd
   ipconfig
   ```
3. Chercher la section **"Carte réseau Ethernet"** ou **"Ethernet adapter"**
4. Noter l'adresse **IPv4** (ex: `192.168.56.101`)

### 4.3 Trouver l'IP (Linux/Ubuntu)

1. Ouvrir un **Terminal**
2. Taper :
   ```bash
   ip addr show
   ```
   ou
   ```bash
   ifconfig
   ```
3. Chercher la section avec `inet` (ex: `inet 192.168.56.101/24`)
4. Noter l'adresse IP

**💡 Astuce** : L'IP commence généralement par `192.168.56.` ou `10.0.2.`

---

## ✅ Étape 5 : Vérifier la Connectivité

### 5.1 Démarrer les Deux VMs

1. Démarrer **VM-Attaquant**
2. Démarrer **VM-Victime**

### 5.2 Tester depuis la VM Victime

**Sur Windows (VM Victime)** :
```cmd
ping 192.168.56.101
```
(Remplacez par l'IP de votre VM Attaquant)

**Sur Linux (VM Victime)** :
```bash
ping 192.168.56.101
```

**✅ Si vous voyez des réponses, c'est bon !** (Ctrl+C pour arrêter)

**❌ Si ça ne fonctionne pas** : Voir la section Dépannage ci-dessous.

---

## 🐍 Étape 6 : Installer Python

### 6.1 Sur Windows

1. Télécharger Python depuis **python.org**
   - Version **3.8 ou supérieure**
   - Cocher **"Add Python to PATH"** lors de l'installation
2. Vérifier l'installation :
   ```cmd
   python --version
   ```
   ou
   ```cmd
   python3 --version
   ```

### 6.2 Sur Linux/Ubuntu

1. Ouvrir un Terminal
2. Taper :
   ```bash
   sudo apt update
   sudo apt install python3 python3-pip
   ```
3. Vérifier :
   ```bash
   python3 --version
   pip3 --version
   ```

---

## 📁 Étape 7 : Transférer les Fichiers

### Option A : Dossier Partagé VirtualBox (Recommandé)

#### 7.1 Configurer le Dossier Partagé

1. **Arrêter la VM** (si elle tourne)
2. Sélectionner la VM
3. **Paramètres** → **Dossiers partagés**
4. Cliquer sur l'icône **"+"** (Ajouter)
5. **Chemin du dossier** : Sélectionner le dossier `Lab1` sur votre machine hôte
6. **Nom du dossier** : `Lab1` (ou autre)
7. ✅ Cocher **"Montage automatique"**
8. ✅ Cocher **"Permanent"**
9. Cliquer sur **"OK"**

#### 7.2 Monter le Dossier dans la VM

**Sur Windows** :
- Le dossier apparaît dans **"Réseau"** → **"VBOXSVR"** → **"Lab1"**
- Ou accéder via : `\\VBOXSVR\Lab1`

**Sur Linux** :
1. Créer un point de montage :
   ```bash
   sudo mkdir /mnt/shared
   ```
2. Monter le dossier :
   ```bash
   sudo mount -t vboxsf Lab1 /mnt/shared
   ```
3. Accéder aux fichiers :
   ```bash
   cd /mnt/shared
   ```

### Option B : Clé USB

1. Brancher une clé USB
2. VirtualBox → **Périphériques** → **USB** → Sélectionner la clé
3. Copier les fichiers depuis la clé

### Option C : Copier-Coller (Simple mais limité)

1. Copier les fichiers dans le presse-papiers de l'hôte
2. Coller dans la VM (peut ne pas fonctionner pour tous les fichiers)

---

## 🔧 Configuration Finale

### Sur VM Attaquant

1. Accéder au dossier `attaquant`
2. Installer les dépendances :
   ```bash
   # Windows
   pip install -r requirements.txt
   
   # Linux
   pip3 install -r requirements.txt
   ```
3. **Pas besoin de modifier config.py** (sauf si vous voulez changer les ports)

### Sur VM Victime

1. Accéder au dossier `victime`
2. Installer les dépendances :
   ```bash
   # Windows
   pip install -r requirements.txt
   
   # Linux
   pip3 install -r requirements.txt
   ```
   **⚠️ Sur Linux, vous pourriez avoir besoin de :**
   ```bash
   sudo apt install python3-dev libx11-dev
   ```
3. **Modifier config.py** :
   - Ouvrir `config.py`
   - Changer `ATTACKER_IP = "192.168.56.101"` avec l'IP de votre VM Attaquant

### Sur Contrôleur (peut être sur l'hôte ou une VM)

1. Accéder au dossier `controleur`
2. Installer les dépendances
3. **Modifier config.py** avec l'IP de la VM Attaquant

---

## 🚀 Démarrer le Système

### Ordre de Démarrage

1. **VM Attaquant** :
   ```bash
   cd attaquant
   python3 server.py
   ```
   (ou `python server.py` sur Windows)

2. **VM Victime** :
   ```bash
   cd victime
   python3 keylogger.py
   ```

3. **Contrôleur** (où vous voulez) :
   ```bash
   cd controleur
   python3 controller.py
   ```

---

## 🔧 Dépannage

### Problème : Les VMs ne peuvent pas se ping

**Solutions** :
1. Vérifier que les deux VMs ont le **même nom de réseau interne** (`lab-network`)
2. Vérifier que les deux VMs sont **démarrées**
3. Redémarrer les VMs
4. Vérifier le firewall :
   ```bash
   # Linux
   sudo ufw disable  # Temporairement pour tester
   ```

### Problème : Je ne trouve pas l'IP

**Solutions** :
1. Vérifier que le réseau interne est bien configuré
2. Essayer `ipconfig /all` (Windows) ou `ip -a` (Linux)
3. L'IP devrait être dans la plage `192.168.56.x` ou `10.0.2.x`

### Problème : Le dossier partagé ne fonctionne pas

**Solutions** :
1. Installer les **Guest Additions** :
   - VirtualBox → **Périphériques** → **Insérer l'image CD des Guest Additions**
   - Dans la VM, exécuter le programme d'installation
2. Redémarrer la VM
3. Utiliser une clé USB à la place

### Problème : Python n'est pas reconnu

**Solutions** :
1. Vérifier que Python est dans le PATH
2. Utiliser `python3` au lieu de `python` sur Linux
3. Réinstaller Python en cochant "Add to PATH"

### Problème : Permission denied sur Linux (keylogger)

**Solutions** :
```bash
sudo apt install python3-dev libx11-dev
# Ou exécuter avec sudo (non recommandé mais fonctionne)
sudo python3 keylogger.py
```

---

## 📊 Résumé des Configurations

| Élément | VM Attaquant | VM Victime |
|---------|--------------|------------|
| **Nom** | VM-Attaquant | VM-Victime |
| **RAM** | 2-4 Go | 1-2 Go |
| **Disque** | 20-30 Go | 15-20 Go |
| **Réseau** | Réseau Interne (`lab-network`) | Réseau Interne (`lab-network`) |
| **IP** | 192.168.56.101 (exemple) | 192.168.56.102 (exemple) |
| **OS** | Windows/Linux (au choix) | Windows/Linux (au choix) |

---

## ✅ Checklist de Configuration

- [ ] VM Attaquant créée et OS installé
- [ ] VM Victime créée et OS installé
- [ ] Réseau interne configuré sur les deux VMs (même nom)
- [ ] IP de l'attaquant identifiée
- [ ] Connectivité testée (ping fonctionne)
- [ ] Python installé sur les deux VMs
- [ ] Fichiers transférés dans les VMs
- [ ] Dépendances installées (`pip install -r requirements.txt`)
- [ ] `victime/config.py` modifié avec l'IP de l'attaquant
- [ ] `controleur/config.py` modifié avec l'IP de l'attaquant
- [ ] Serveur attaquant démarré et fonctionne
- [ ] Keylogger démarré et capture
- [ ] Contrôleur connecté et affiche les victimes

---

## 💡 Astuces

1. **Prendre des snapshots** : Avant de tester, créez un snapshot de chaque VM (VM → Prendre un instantané). Vous pourrez revenir en arrière en cas de problème.

2. **Allouer plus de RAM** : Si les VMs sont lentes, augmentez la RAM allouée.

3. **Mode plein écran** : Appuyez sur **Right Ctrl + F** pour le mode plein écran.

4. **Copier depuis l'hôte** : **Right Ctrl + C** pour copier depuis l'hôte vers la VM.

5. **Sauvegarder l'état** : Au lieu d'éteindre, utilisez "Enregistrer l'état de la machine" pour démarrer plus vite.

---

**Besoin d'aide ?** Consultez aussi `GUIDE_ETAPES.md` pour plus de détails sur l'utilisation du système.

