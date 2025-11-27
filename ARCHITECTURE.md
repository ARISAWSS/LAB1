# Architecture du système

## Vue globale

```
                 (Réseau interne VirtualBox)

  +----------------------+        +----------------------+        +----------------------+
  |      VM Victime      |        |      VM Attaquant    |        |      Contrôleur      |
  |  - keylogger.py      |  --->  |  - server.py (HTTP)  |  <---  |  - CLI controller.py |
  |  - capture pynput    |  --->  |  - TCP listener      |  <-->  |  - Dashboard Flask   |
  |  - envoi HTTP/TCP    |        |  - stockage logs     |        |  - API REST consommée |
  +----------------------+        +----------------------+        +----------------------+
             ^                                  |                             ^
             |                                  |                             |
             +----------------------------------+-----------------------------+
                               API REST / commandes
```

* Les VMs communiquent via un réseau interne isolé (`lab-network`).  
* Le keylogger choisit dynamiquement le mode d’exfiltration (HTTP ou TCP).  
* Le contrôleur peut être lancé sur la VM Attaquant ou sur une troisième VM.

## Flux principaux

1. **Capture et normalisation**  
   `pynput` déclenche `on_press` pour chaque touche. `normalize_key` convertit les touches spéciales et stocke l’événement au format JSON (`victim_id`, `timestamp`, `key`, `raw_key`).

2. **Exfiltration**  
   - **HTTP POST** : envoi vers `/logs` avec `requests`.  
   - **TCP** : envoi via `socket` sur le port 9999.  
   Le module applique un retry (3 tentatives, délai 5 s) et sauvegarde dans `keylog_buffer.json` en cas d’échec total.

3. **Stockage**  
   `storage.py` crée la hiérarchie `logs/<victim_id>/<YYYY-MM-DD>/log_HH-MM-SS.json`. Les lectures sont concaténées lors des requêtes `GET /victims/<id>/logs`.

4. **Analyse**  
   `GET /victims/<id>/analyze` calcule : nombre total de touches, mots-clés détectés et séquences répétitives. Ces informations sont affichées dans le CLI et le dashboard web.

5. **Commandes distantes**  
   - Contrôleur (CLI ou web) envoie `POST /command`.  
   - Le serveur ajoute la commande dans `pending_commands`.  
   - La victime interroge `GET /victims/<id>/commands` toutes les cinq secondes et exécute `start_capture`, `stop_capture`, `switch_mode`, `flush_logs`.

## Points techniques clés

| Domaine | Détails |
|---------|---------|
| Captures | `pynput.keyboard.Listener`, gestion des touches spéciales, buffer mémoire. |
| Exfiltration | HTTP via `requests`, TCP via `socket`, retry configurable, tampon disque. |
| Serveur | Flask pour l’API et l’interface web, thread TCP dédié, stockage JSON structuré. |
| Contrôle | CLI couleur (`colorama`) + interface web (Bootstrap + JS) pour les commandes distantes. |
| Sécurité | Usage strictement interne, aucune exposition hors réseau virtualisé, possibilité d’ajouter TLS et authentification. |

## Diagramme de séquence simplifié

```
Victime           Serveur            Contrôleur
  |                  |                    |
  |--- capture ----->|                    |
  |--- envoi logs -->|                    |
  |                  |--- GET /victims -->|
  |                  |<-- liste victimes--|
  |                  |<-- POST /command --|
  |<-- GET commands -|                    |
  |--- exécute ----->|                    |
```

## Conformité aux exigences

| Exigence | Réalisation |
|----------|-------------|
| Capture temps réel | keylogger.py (pynput). |
| Normalisation + JSON | `normalize_key`, `encode_logs`. |
| UUID par victime | Généré au démarrage (`uuid.uuid4`). |
| Exfiltration HTTP/TCP | `send_via_http`, `send_via_tcp`. |
| Résilience | Retry configurables, buffer mémoire + fichier. |
| Récepteur | Flask + TCP listener, stockage structuré. |
| Analyse optionnelle | Endpoint `/victims/<id>/analyze`. |
| Contrôleur léger | CLI et dashboard web, commandes distantes complètes. |

## Améliorations possibles

- Chiffrement TLS/SSL et authentification des commandes.  
- Stockage dans une base relationnelle ou document.  
- Ajout de règles d’analyse plus poussées (détection d’URL, fréquences anormales).  
- Persistance automatique du keylogger (service système).  
- Export automatisé des rapports d’activité.

