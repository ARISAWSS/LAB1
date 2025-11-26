# 🚀 Guide Rapide VirtualBox - 5 Minutes

## ⚡ Résumé Ultra-Rapide

**Vous n'avez PAS besoin de Kali Linux !** Utilisez Windows 10/11 ou Ubuntu Desktop.

---

## 📝 Étapes Essentielles

### 1️⃣ Créer les 2 VMs

**VM-Attaquant** :
- Nouvelle VM → Nom: `VM-Attaquant`
- RAM: 2-4 Go
- Disque: 20 Go
- Installer Windows ou Ubuntu

**VM-Victime** :
- Nouvelle VM → Nom: `VM-Victime`
- RAM: 1-2 Go
- Disque: 15 Go
- Installer Windows ou Ubuntu

### 2️⃣ Configurer le Réseau (IMPORTANT !)

**Sur les DEUX VMs** :
1. Paramètres → Réseau → Adapter 1
2. ✅ Activer l'adaptateur réseau
3. Mode: **"Réseau Interne"**
4. Nom: `lab-network` (⚠️ **LE MÊME NOM** pour les deux !)

### 3️⃣ Trouver l'IP de l'Attaquant

**Démarrer VM-Attaquant** puis :

**Windows** :
```cmd
ipconfig
```
Chercher l'adresse IPv4 (ex: `192.168.56.101`)

**Linux** :
```bash
ip addr show
```
Chercher `inet` (ex: `192.168.56.101`)

### 4️⃣ Tester la Connexion

**Démarrer VM-Victime** puis :
```cmd
ping 192.168.56.101
```
(Remplacez par votre IP)

✅ Si ça répond, c'est bon !

### 5️⃣ Installer Python

**Windows** :
- Télécharger depuis python.org
- ✅ Cocher "Add Python to PATH"

**Linux** :
```bash
sudo apt update
sudo apt install python3 python3-pip
```

### 6️⃣ Transférer les Fichiers

**Option Simple : Dossier Partagé**

1. Paramètres → Dossiers partagés → "+"
2. Sélectionner le dossier `Lab1`
3. ✅ Montage automatique
4. Dans la VM :
   - Windows : `\\VBOXSVR\Lab1`
   - Linux : `sudo mount -t vboxsf Lab1 /mnt/shared`

### 7️⃣ Configuration

**VM Victime** - Modifier `victime/config.py` :
```python
ATTACKER_IP = "192.168.56.101"  # ← Votre IP
```

**Contrôleur** - Modifier `controleur/config.py` :
```python
ATTACKER_IP = "192.168.56.101"  # ← Votre IP
```

### 8️⃣ Installer les Dépendances

**Sur chaque VM** :
```bash
cd attaquant  # ou victime ou controleur
pip install -r requirements.txt
```

**Sur Linux (victime uniquement)** :
```bash
sudo apt install python3-dev libx11-dev
```

### 9️⃣ Démarrer !

**Terminal 1 - VM Attaquant** :
```bash
cd attaquant
python3 server.py
```

**Terminal 2 - VM Victime** :
```bash
cd victime
python3 keylogger.py
```

**Terminal 3 - Contrôleur** :
```bash
cd controleur
python3 controller.py
```

---

## ⚠️ Problèmes Courants

### Les VMs ne se ping pas
→ Vérifier que les deux ont le **même nom de réseau** (`lab-network`)

### Python non reconnu
→ Utiliser `python3` au lieu de `python` sur Linux

### Permission denied (Linux keylogger)
→ `sudo apt install python3-dev libx11-dev`

### Dossier partagé ne marche pas
→ Installer les Guest Additions (Périphériques → Insérer l'image CD)

---

## 📚 Documentation Complète

Pour plus de détails, consultez :
- **`GUIDE_VIRTUALBOX.md`** : Guide complet et détaillé
- **`GUIDE_ETAPES.md`** : Guide d'utilisation du système
- **`DEMARRAGE_RAPIDE.md`** : Démarrage rapide du système

---

**C'est tout ! Vous êtes prêt ! 🎉**

