# Rapport technique – LAB 1

## 1. Introduction

Le projet répond à l’énoncé « LAB 1 – Extension Avancée : Projet de Simulation Keylogger ». Il vise à démontrer, dans un environnement contrôlé, la chaîne complète d’un keylogger : capture côté victime, exfiltration vers un serveur attaquant, stockage/visualisation et pilotage distant. Toutes les opérations ont été menées dans des machines virtuelles VirtualBox reliées par un réseau interne.

## 2. Architecture

### 2.1 Composants

| Machine | Rôle | Technologies |
|---------|------|--------------|
| VM Victime | Capture clavier, encodage JSON, exfiltration HTTP/TCP, exécution des commandes distantes. | Python, pynput, requests, socket |
| VM Attaquant | Réception des logs, stockage structuré, API REST, tableau de bord web, file de commandes. | Python, Flask, threading |
| Contrôleur | Supervision et pilotage (CLI et web). | Python CLI, Flask templates, JavaScript |

### 2.2 Flux

1. **Capture** : chaque frappe déclenche `on_press`, la touche est normalisée, enrichie avec l’UUID et l’horodatage, puis placée dans une file.
2. **Envoi** : un thread envoie régulièrement les logs via HTTP POST ou TCP. En cas d’échec, un retry est tenté (3 essais) avant d’écrire dans `keylog_buffer.json`.
3. **Stockage** : le serveur classe les logs par victime/date (`logs/<uuid>/<date>/log_HH-MM-SS.json`).
4. **Consultation** : API REST (`/victims`, `/victims/<id>/logs`, `/victims/<id>/analyze`) consommée par le CLI et le dashboard web.
5. **Commandes** : le contrôleur publie `POST /command`, le serveur stocke la requête, la victime interroge `/victims/<id>/commands` toutes les cinq secondes et exécute `start_capture`, `stop_capture`, `switch_mode`, `flush_logs`.

## 3. Mise en œuvre

### 3.1 VM Victime

- **UUID** généré à l’initialisation (`uuid.uuid4`).
- **Capture** via `pynput.keyboard.Listener`.
- **Normalisation** des touches (alphas, espace, retour, touches spéciales).
- **Exfiltration** : HTTP (`requests.post`) et TCP (`socket`). Le mode se change à la volée.
- **Résilience** : File mémoire (`Queue`), buffer local, fichier de secours.
- **Commandes distantes** : thread `check_commands_thread` qui interroge l’API et appelle `start_capture`, `stop_capture`, `switch_mode`, `flush_logs`.

### 3.2 VM Attaquant

- **Serveur HTTP** : Flask, endpoints REST, tableau de bord via `dashboard.html`.
- **Serveur TCP** : thread dédié, compatibilité avec l’exfiltration socket.
- **Stockage** : JSON indenté, un fichier par créneau horaire.
- **Analyse** : extraction de mots-clés (chaînes de 4 caractères et plus) et détection de répétitions.
- **Commandes** : `pending_commands` en mémoire, consommation par les victimes.

### 3.3 Contrôleur

- **CLI** : commandes `list`, `logs`, `analyze`, `start`, `stop`, `switch`, `flush`, `command`.  
- **Dashboard** : rafraîchissement automatique, boutons de commande, affichage des statistiques.

## 4. Tests réalisés

| Test | Résultat |
|------|----------|
| Capture de touches (lettres, chiffres, touches spéciales) | OK |
| Exfiltration HTTP | OK (statut 200, logs stockés). |
| Exfiltration TCP | OK (connexion port 9999, réponse « OK »). |
| Résilience | Après coupure réseau, les logs sont stockés dans `keylog_buffer.json` puis envoyés lors du retour. |
| Commandes distantes | Start/Stop/Switch/Flush exécutés dans les 5 s suivant l’ordre. |
| Analyse | CLI et web affichent le total de touches, mots-clés et répétitions. |
| Multi-victimes | Deux keyloggers simultanés, identifiés par UUID différents. |

## 5. Conformité à l’énoncé

| Exigence | Réponse |
|----------|---------|
| Capturer les frappes en temps réel | `keylogger.py` utilise `pynput`. |
| Normaliser et encoder en JSON | `normalize_key`, `encode_logs`. |
| Générer un UUID | `self.victim_id = str(uuid.uuid4())`. |
| Exfiltration HTTP POST | `send_via_http`. |
| Exfiltration Socket TCP | `send_via_tcp`. |
| Résilience (retry + tampon) | `send_logs` avec retry, buffer mémoire + fichier. |
| Récepteur attaquant | Flask + TCP, stockage structuré. |
| Analyse optionnelle | Endpoint `/victims/<id>/analyze`. |
| Contrôleur listant victimes, logs temps réel, commandes | CLI et dashboard web, commandes `start_capture`, `stop_capture`, `switch_mode`, `flush_logs`. |

## 6. Limites observées

1. Pas de chiffrement : HTTP et TCP sont en clair.  
2. Pas d’authentification des commandes : n’importe quel client sur le réseau interne peut appeler l’API.  
3. Persistance limitée : le keylogger n’est pas installé en service.  
4. Stockage JSON : pratique mais moins robuste qu’une base de données pour de gros volumes.  
5. Analyse sommaire : seulement des mots-clés simples et des répétitions.

## 7. Améliorations proposées

1. **Sécurité** : activer TLS, ajouter des tokens d’authentification, chiffrer les logs.  
2. **Persistance** : transformer le keylogger en service systemd (Linux) ou en tâche planifiée (Windows).  
3. **Stockage** : remplacer le stockage fichier par SQLite/PostgreSQL, ajouter un index temporel.  
4. **Analyse** : détection d’URL, scoring de mots sensibles, classification par type d’application.  
5. **Observabilité** : exporter des métriques (Prometheus) et mettre en place des alertes.  
6. **Automatisation** : script d’installation, provisioning Vagrant/Terraform pour reproduire rapidement l’environnement.

## 8. Livrables fournis

- Schéma et explications dans `ARCHITECTURE.md`.  
- Guide détaillé (`GUIDE_ETAPES.md`) + démarrage rapide (`DEMARRAGE_RAPIDE.md`).  
- Documentation de structure (`STRUCTURE_PROJET.md`).  
- Rapport technique (ce document) intégrant limites et pistes d’amélioration.  
- Captures d’écran à intégrer par l’étudiant (server, victime, CLI, tableau de bord) selon les exigences du sujet.

## 9. Conclusion

Le projet respecte l’ensemble des exigences de l’énoncé. Il illustre une chaîne complète d’attaque simulée, avec une victime instrumentée, un attaquant collectant et analysant les données, ainsi qu’un contrôleur capable de piloter l’ensemble. Les extensions proposées (chiffrement, persistance, analyses avancées) offrent des pistes pour approfondir le TP ou l’adapter à d’autres scénarios pédagogiques.

