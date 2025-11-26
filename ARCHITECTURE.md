# Architecture du Système - Simulation Keylogger

## Schéma d'Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         ENVIRONNEMENT VIRTUALBOX                        │
│                                                                         │
│  ┌──────────────────────┐         ┌──────────────────────┐            │
│  │    VM VICTIME        │         │   VM ATTAQUANT       │            │
│  │                      │         │                      │            │
│  │  ┌──────────────┐   │         │  ┌──────────────┐   │            │
│  │  │  Keylogger   │   │         │  │   Serveur    │   │            │
│  │  │              │   │         │  │   HTTP/TCP   │   │            │
│  │  │  - Capture   │───┼─────────┼─▶│              │   │            │
│  │  │  - Encode    │   │ HTTP/   │  │  - Réception │   │            │
│  │  │  - Exfiltrer │   │ TCP     │  │  - Stockage  │   │            │
│  │  │  - Buffer    │   │         │  │  - Analyse   │   │            │
│  │  └──────────────┘   │         │  └──────┬───────┘   │            │
│  │                      │         │         │            │            │
│  │  ID: UUID           │         │  ┌──────▼───────┐   │            │
│  │  Mode: HTTP/TCP     │         │  │   Storage    │   │            │
│  │  Retry: 3x          │         │  │              │   │            │
│  └──────────────────────┘         │  │ logs/        │   │            │
│                                    │  │  └─<uuid>/  │   │            │
│                                    │  │     └─date/ │   │            │
│                                    │  └─────────────┘   │            │
│                                    └──────────┬─────────┘            │
│                                               │                       │
│                                               │ HTTP API              │
│                                    ┌──────────▼─────────┐            │
│                                    │   CONTRÔLEUR       │            │
│                                    │                    │            │
│                                    │  - Interface CLI   │            │
│                                    │  - Liste victimes  │            │
│                                    │  - Affichage logs  │            │
│                                    │  - Analyse         │            │
│                                    │  - Commandes       │            │
│                                    └────────────────────┘            │
│                                                                         │
│  Réseau: Interne VirtualBox (lab-network)                              │
│  IP Attaquant: 192.168.56.101 (exemple)                                │
│  Ports: HTTP 8080, TCP 9999                                            │
└─────────────────────────────────────────────────────────────────────────┘
```

## Flux de Données

### 1. Capture et Exfiltration

```
[Utilisateur tape] 
    ↓
[Keylogger capture via pynput]
    ↓
[Normalisation de la touche]
    ↓
[Encodage JSON]
    ↓
[Queue de logs]
    ↓
[Thread d'envoi périodique]
    ↓
[Exfiltration HTTP POST ou TCP Socket]
    ↓
[Retry en cas d'échec]
    ↓
[Buffer local si échec total]
```

### 2. Réception et Stockage

```
[Requête HTTP POST /logs]
    ↓
[Validation des données]
    ↓
[Extraction victim_id et logs]
    ↓
[Création structure: logs/<victim_id>/<date>/]
    ↓
[Sauvegarde JSON]
    ↓
[Mise à jour liste victimes actives]
```

### 3. Consultation via Contrôleur

```
[Commande utilisateur]
    ↓
[Requête HTTP GET /victims]
    ↓
[Affichage liste victimes]
    ↓
[Requête HTTP GET /victims/<id>/logs]
    ↓
[Lecture fichiers JSON]
    ↓
[Formatage et affichage]
```

## Structure des Données

### Format d'un Log

```json
{
  "victim_id": "550e8400-e29b-41d4-a716-446655440000",
  "timestamp": "2024-01-15T14:30:25.123456",
  "key": "a",
  "raw_key": "'a'"
}
```

### Format d'un Envoi (HTTP POST)

```json
{
  "victim_id": "550e8400-e29b-41d4-a716-446655440000",
  "logs": [
    {
      "victim_id": "550e8400-e29b-41d4-a716-446655440000",
      "timestamp": "2024-01-15T14:30:25.123456",
      "key": "H",
      "raw_key": "'H'"
    },
    {
      "victim_id": "550e8400-e29b-41d4-a716-446655440000",
      "timestamp": "2024-01-15T14:30:25.234567",
      "key": "e",
      "raw_key": "'e'"
    }
  ],
  "timestamp": "2024-01-15T14:30:26.000000"
}
```

### Structure des Fichiers

```
logs/
├── 550e8400-e29b-41d4-a716-446655440000/
│   ├── 2024-01-15/
│   │   ├── log_14-30-25.json
│   │   ├── log_14-31-10.json
│   │   └── log_14-32-05.json
│   └── 2024-01-16/
│       └── log_09-15-30.json
└── 660e8400-e29b-41d4-a716-446655440001/
    └── 2024-01-15/
        └── log_15-20-00.json
```

## Composants Techniques

### VM Victime - Keylogger

**Technologies :**
- Python 3.8+
- pynput (capture clavier)
- requests (HTTP)
- socket (TCP)
- threading (envoi asynchrone)

**Fonctionnalités :**
- Capture en temps réel
- Normalisation des touches
- Encodage JSON
- Exfiltration HTTP/TCP
- Mécanisme de retry
- Buffer local
- UUID unique par instance

### VM Attaquant - Serveur

**Technologies :**
- Python 3.8+
- Flask (serveur HTTP)
- threading (serveur TCP)
- JSON (stockage)

**Fonctionnalités :**
- Réception HTTP (POST /logs)
- Réception TCP (port 9999)
- Stockage organisé par victime/date
- API REST pour consultation
- Analyse basique des logs
- Gestion des victimes actives

### Contrôleur

**Technologies :**
- Python 3.8+
- requests (client HTTP)
- colorama (affichage coloré)

**Fonctionnalités :**
- Interface CLI interactive
- Liste des victimes
- Affichage des logs
- Analyse des logs
- Envoi de commandes (structure prête)

## Endpoints API

### GET /victims
Liste toutes les victimes enregistrées.

**Réponse :**
```json
{
  "victims": [
    {
      "victim_id": "550e8400-e29b-41d4-a716-446655440000",
      "last_seen": "2024-01-15T14:30:25",
      "active": true
    }
  ]
}
```

### POST /logs
Reçoit les logs d'une victime.

**Requête :**
```json
{
  "victim_id": "550e8400-e29b-41d4-a716-446655440000",
  "logs": [...],
  "timestamp": "2024-01-15T14:30:26"
}
```

### GET /victims/<victim_id>/logs
Récupère les logs d'une victime.

**Paramètres :**
- `date` (optionnel) : Date au format YYYY-MM-DD

**Réponse :**
```json
{
  "victim_id": "550e8400-e29b-41d4-a716-446655440000",
  "count": 127,
  "logs": [...]
}
```

### GET /victims/<victim_id>/analyze
Analyse les logs d'une victime.

**Réponse :**
```json
{
  "victim_id": "550e8400-e29b-41d4-a716-446655440000",
  "analysis": {
    "total_keys": 127,
    "keywords": ["Hello", "World", "password"],
    "repetitive_sequences": [
      {"key": "a", "count": 3}
    ]
  }
}
```

## Sécurité et Limitations

### Limitations Actuelles

1. **Pas de chiffrement** : Les logs sont envoyés en clair
2. **Pas d'authentification** : N'importe qui peut envoyer des logs
3. **Pas de persistance** : Le keylogger s'arrête si fermé
4. **Commandes distantes** : Structure prête mais non implémentée côté victime

### Améliorations Possibles

1. **Chiffrement TLS/SSL** : Utiliser HTTPS
2. **Authentification** : Tokens ou clés partagées
3. **Persistance** : Service système ou démarrage automatique
4. **Chiffrement des logs** : AES avant envoi
5. **Steganographie** : Cacher les logs dans des images
6. **Communication bidirectionnelle** : WebSocket pour commandes en temps réel

## Configuration Réseau

### VirtualBox - Réseau Interne

```
VM Attaquant:
  - Adapter 1: Réseau Interne
  - Nom: lab-network
  - IP: 192.168.56.101 (DHCP ou statique)

VM Victime:
  - Adapter 1: Réseau Interne
  - Nom: lab-network
  - IP: 192.168.56.102 (DHCP ou statique)
```

### Ports Utilisés

- **8080** : Serveur HTTP (Flask)
- **9999** : Serveur TCP (Socket)

### Test de Connectivité

```bash
# Depuis VM Victime
ping 192.168.56.101
curl http://192.168.56.101:8080/victims

# Depuis VM Attaquant
netstat -tuln | grep 8080
netstat -tuln | grep 9999
```

