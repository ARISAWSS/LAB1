# Structure du Projet - Simulation Keylogger

## 📁 Arborescence Complète

```
Lab1/
│
├── 📄 README.md                    # Vue d'ensemble du projet
├── 📄 GUIDE_ETAPES.md             # Guide détaillé étape par étape
├── 📄 DEMARRAGE_RAPIDE.md          # Guide de démarrage rapide
├── 📄 ARCHITECTURE.md              # Architecture technique détaillée
├── 📄 RAPPORT_TECHNIQUE.md         # Rapport technique complet
├── 📄 STRUCTURE_PROJET.md          # Ce fichier
│
├── 📁 victime/                     # Code pour la VM Victime
│   ├── 📄 keylogger.py             # Script principal du keylogger
│   ├── 📄 config.py                # Configuration (IP, ports, mode)
│   └── 📄 requirements.txt         # Dépendances Python
│
├── 📁 attaquant/                   # Code pour la VM Attaquant
│   ├── 📄 server.py                # Serveur HTTP/TCP
│   ├── 📄 storage.py               # Gestion du stockage des logs
│   ├── 📄 config.py                # Configuration (ports, dossier)
│   └── 📄 requirements.txt         # Dépendances Python
│
└── 📁 controleur/                  # Code pour le Contrôleur
    ├── 📄 controller.py            # Interface CLI
    ├── 📄 config.py                # Configuration (IP serveur)
    └── 📄 requirements.txt         # Dépendances Python
```

## 📋 Description des Fichiers

### Documentation

| Fichier | Description |
|---------|-------------|
| `README.md` | Introduction, architecture, installation de base |
| `GUIDE_ETAPES.md` | Guide complet étape par étape avec dépannage |
| `DEMARRAGE_RAPIDE.md` | Guide express pour démarrer rapidement |
| `ARCHITECTURE.md` | Schémas, flux de données, API, structure technique |
| `RAPPORT_TECHNIQUE.md` | Rapport complet pour le rendu (architecture, implémentation, tests, limites, améliorations) |
| `STRUCTURE_PROJET.md` | Ce fichier - Vue d'ensemble de la structure |

### VM Victime

| Fichier | Description | Lignes |
|---------|-------------|--------|
| `keylogger.py` | Script principal : capture, normalisation, exfiltration HTTP/TCP, retry, buffer | ~300 |
| `config.py` | Configuration : IP attaquant, ports, mode, paramètres de retry | ~30 |
| `requirements.txt` | Dépendances : pynput, requests | 2 |

**Fonctionnalités** :
- ✅ Capture des frappes en temps réel
- ✅ Normalisation des touches spéciales
- ✅ Génération UUID unique
- ✅ Encodage JSON
- ✅ Exfiltration HTTP POST
- ✅ Exfiltration TCP Socket
- ✅ Mécanisme de retry (3 tentatives)
- ✅ Buffer local en cas d'échec

### VM Attaquant

| Fichier | Description | Lignes |
|---------|-------------|--------|
| `server.py` | Serveur Flask HTTP + Serveur TCP, endpoints API REST | ~200 |
| `storage.py` | Gestion du stockage : organisation par victime/date, analyse | ~150 |
| `config.py` | Configuration : ports HTTP/TCP, dossier de stockage | ~10 |
| `requirements.txt` | Dépendances : flask, flask-cors | 2 |

**Fonctionnalités** :
- ✅ Serveur HTTP (port 8080)
- ✅ Serveur TCP (port 9999)
- ✅ Réception et stockage des logs
- ✅ Organisation par victime/date
- ✅ API REST pour consultation
- ✅ Analyse basique (mots-clés, séquences)
- ✅ Gestion des victimes actives

### Contrôleur

| Fichier | Description | Lignes |
|---------|-------------|--------|
| `controller.py` | Interface CLI interactive avec colorama | ~250 |
| `config.py` | Configuration : IP serveur attaquant | ~5 |
| `requirements.txt` | Dépendances : requests, colorama | 2 |

**Fonctionnalités** :
- ✅ Interface CLI colorée
- ✅ Liste des victimes actives
- ✅ Affichage des logs
- ✅ Analyse des logs
- ✅ Structure pour commandes distantes
- ✅ Gestion d'erreurs

## 🔧 Configuration Requise

### Modifications Nécessaires

**À modifier avant utilisation :**

1. **victime/config.py** :
   ```python
   ATTACKER_IP = "192.168.56.101"  # ← IP de votre VM Attaquant
   ```

2. **controleur/config.py** :
   ```python
   ATTACKER_IP = "192.168.56.101"  # ← IP de votre VM Attaquant
   ```

3. **attaquant/config.py** :
   ```python
   # Généralement pas besoin de modifier
   # Sauf si vous voulez changer les ports
   ```

## 📦 Dépendances Globales

### Python 3.8+
Requis sur toutes les machines.

### Packages Python

**Victime** :
- `pynput==1.7.6` : Capture clavier
- `requests==2.31.0` : Client HTTP

**Attaquant** :
- `flask==3.0.0` : Serveur web
- `flask-cors==4.0.0` : CORS pour API

**Contrôleur** :
- `requests==2.31.0` : Client HTTP
- `colorama==0.4.6` : Couleurs terminal

## 🚀 Ordre d'Exécution

1. **VM Attaquant** : `python3 server.py`
2. **VM Victime** : `python3 keylogger.py`
3. **Contrôleur** : `python3 controller.py`

## 📊 Statistiques du Projet

- **Total fichiers Python** : 6
- **Total lignes de code** : ~950
- **Documentation** : 6 fichiers markdown
- **Langages** : Python 3.8+
- **Frameworks** : Flask, pynput
- **Protocoles** : HTTP, TCP

## 🎯 Points Clés

### Fonctionnalités Implémentées

✅ Capture en temps réel  
✅ Exfiltration HTTP/TCP  
✅ Résilience (retry + buffer)  
✅ Stockage organisé  
✅ Interface de contrôle  
✅ Analyse basique  
✅ UUID par victime  
✅ Normalisation des touches  

### Fonctionnalités Prêtes mais Non Implémentées

⚠️ Commandes distantes (structure prête, nécessite écoute côté victime)  
⚠️ Interface web (peut être ajoutée facilement)  
⚠️ Chiffrement (peut être ajouté)  
⚠️ Persistance (peut être ajoutée)  

## 📝 Notes Importantes

1. **Sécurité** : Projet pédagogique uniquement
2. **Isolation** : Utiliser uniquement des VMs VirtualBox
3. **Réseau** : Réseau interne VirtualBox obligatoire
4. **Permissions** : Linux peut nécessiter sudo pour pynput
5. **Firewall** : Ouvrir les ports 8080 et 9999 si nécessaire

## 🔍 Fichiers Générés à l'Exécution

### Sur VM Victime
- `keylog_buffer.json` : Buffer local en cas d'échec réseau

### Sur VM Attaquant
- `logs/` : Dossier de stockage
  - `<victim_id>/` : Dossiers par victime
    - `YYYY-MM-DD/` : Dossiers par date
      - `log_HH-MM-SS.json` : Fichiers de logs

## 📚 Documentation par Fichier

| Besoin | Fichier à Consulter |
|--------|---------------------|
| Démarrer rapidement | `DEMARRAGE_RAPIDE.md` |
| Installation complète | `GUIDE_ETAPES.md` |
| Comprendre l'architecture | `ARCHITECTURE.md` |
| Rédiger le rapport | `RAPPORT_TECHNIQUE.md` |
| Vue d'ensemble | `README.md` |
| Structure du code | `STRUCTURE_PROJET.md` (ce fichier) |

## ✅ Checklist de Démarrage

- [ ] VirtualBox installé
- [ ] 2 VMs créées et configurées en réseau interne
- [ ] Python 3.8+ installé sur les VMs
- [ ] Fichiers transférés dans les VMs
- [ ] IP de l'attaquant identifiée
- [ ] `victime/config.py` modifié avec l'IP
- [ ] `controleur/config.py` modifié avec l'IP
- [ ] Dépendances installées (`pip install -r requirements.txt`)
- [ ] Serveur attaquant démarré
- [ ] Keylogger démarré
- [ ] Contrôleur démarré
- [ ] Test de capture effectué

---

**Projet créé pour LAB 1 - Extension Avancée : Projet de Simulation Keylogger**

