# LAB 1 – Simulation Keylogger Avancée

## ⚠️ AVERTISSEMENT
**Ce projet est strictement à des fins pédagogiques et doit être exécuté uniquement dans des machines virtuelles VirtualBox isolées. L'utilisation de keyloggers sur des systèmes non autorisés est illégale.**

## Architecture du Système

```
┌─────────────────┐         ┌─────────────────┐         ┌─────────────────┐
│   VM Victime    │────────▶│  VM Attaquant   │◀────────│   Contrôleur    │
│                 │         │                 │         │                 │
│  - Keylogger    │  HTTP/  │  - Serveur HTTP │         │  - Interface    │
│  - Capture      │  TCP    │  - Stockage     │         │  - Commandes    │
│  - Exfiltration │         │  - Analyse      │         │  - Monitoring   │
└─────────────────┘         └─────────────────┘         └─────────────────┘
```

## Structure du Projet

```
Lab1/
├── victime/              # Code pour la VM Victime
│   ├── keylogger.py      # Script principal du keylogger
│   ├── config.py         # Configuration
│   └── requirements.txt  # Dépendances
├── attaquant/            # Code pour la VM Attaquant
│   ├── server.py         # Serveur HTTP/Socket
│   ├── storage.py        # Gestion du stockage
│   ├── config.py         # Configuration
│   └── requirements.txt  # Dépendances
├── controleur/           # Code pour le Contrôleur
│   ├── controller.py     # Interface CLI
│   ├── config.py         # Configuration
│   └── requirements.txt  # Dépendances
└── README.md             # Ce fichier
```

## Installation et Configuration

### Prérequis
- Python 3.8+
- Deux machines virtuelles VirtualBox configurées en réseau interne

### Configuration VirtualBox

1. **VM Victime** :
   - Créer une VM avec un OS (Windows/Linux)
   - Configurer le réseau en mode "Réseau Interne"
   - Nom du réseau : `lab-network`

2. **VM Attaquant** :
   - Créer une VM avec un OS (Windows/Linux)
   - Configurer le réseau en mode "Réseau Interne"
   - Nom du réseau : `lab-network`
   - Notez l'IP de cette machine (ex: 192.168.56.101)

### Installation sur VM Victime

```bash
cd victime
pip install -r requirements.txt
# Modifier config.py avec l'IP de l'attaquant
python keylogger.py
```

### Installation sur VM Attaquant

```bash
cd attaquant
pip install -r requirements.txt
# Modifier config.py si nécessaire
python server.py
```

### Installation du Contrôleur

```bash
cd controleur
pip install -r requirements.txt
# Modifier config.py avec l'IP de l'attaquant
python controller.py
```

## Utilisation

1. Démarrer le serveur attaquant sur la VM Attaquant
2. Démarrer le keylogger sur la VM Victime
3. Utiliser le contrôleur pour surveiller et gérer les victimes

## Commandes du Contrôleur

- `list` : Lister les victimes actives
- `logs <victim_id>` : Afficher les logs d'une victime
- `start <victim_id>` : Démarrer la capture
- `stop <victim_id>` : Arrêter la capture
- `switch <victim_id> <mode>` : Changer le mode (http/tcp)
- `flush <victim_id>` : Vider les logs
- `exit` : Quitter

## Notes de Sécurité

- Ce projet est uniquement à des fins éducatives
- Ne jamais exécuter sur des machines de production
- Toujours utiliser des machines virtuelles isolées
- Ne pas partager le code en dehors du contexte pédagogique

