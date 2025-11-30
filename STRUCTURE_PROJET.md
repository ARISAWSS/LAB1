# Structure du projet

```
Lab1/
├── README.md
├── ARCHITECTURE.md
├── GUIDE_ETAPES.md
├── DEMARRAGE_RAPIDE.md
├── RAPPORT_TECHNIQUE.md
├── STRUCTURE_PROJET.md
├── attaquant/
│   ├── config.py
│   ├── requirements.txt
│   ├── server.py
│   ├── storage.py
│   ├── templates/dashboard.html
│   └── static/{style.css, script.js}
├── victime/
│   ├── config.py
│   ├── keylogger.py
│   └── requirements.txt
├── controleur/
│   ├── config.py
│   ├── controller.py
│   └── requirements.txt
└── KeyloggerScenario/
    ├── server/
    │   ├── install.sh          # Script d'installation automatique du keylogger
    │   ├── routes.ts
    │   ├── storage.ts
    │   └── index.ts
    ├── client/
    │   └── src/                # Application React
    ├── package.json
    └── ...
```

## Rôle des dossiers

| Dossier | Contenu | Description |
|---------|---------|-------------|
| `attaquant/` | Serveur Flask + listener TCP | Réception/stockage des logs, API REST, dashboard web, file de commandes, réception des données du formulaire de phishing. |
| `victime/` | Keylogger Python | Capture, normalisation, exfiltration HTTP/TCP, buffer, exécution des commandes. |
| `controleur/` | CLI de supervision | Interface texte pour lister, consulter, analyser et piloter les victimes, afficher les données des formulaires. |
| `KeyloggerScenario/` | Site web de phishing | Application Node.js/React simulant une organisation caritative avec formulaire d'enquête et script d'installation automatique du keylogger. |

## Fichiers Markdown

| Fichier | Contenu |
|---------|---------|
| `README.md` | Synthèse du projet et correspondance avec l’énoncé. |
| `GUIDE_ETAPES.md` | Procédure détaillée (création des VMs, configuration réseau, tests). |
| `DEMARRAGE_RAPIDE.md` | Check-list et validation rapide. |
| `ARCHITECTURE.md` | Schémas, flux, conformité aux exigences. |
| `RAPPORT_TECHNIQUE.md` | Description complète (architecture, tests, limites, pistes). |
| `STRUCTURE_PROJET.md` | Cartographie et rôle des fichiers. |

## Dépendances principales

| Composant | Bibliothèques |
|-----------|---------------|
| Victime (keylogger) | `pynput`, `requests` (installés dans environnement virtuel Python) |
| Attaquant | `flask`, `flask-cors` |
| Contrôleur | `requests`, `colorama` |
| KeyloggerScenario | `node`, `express`, `react`, `typescript`, `vite` |

## Points de configuration

| Fichier | Paramètres clés |
|---------|-----------------|
| `victime/config.py` | IP/port de l’attaquant, mode d’exfiltration, retry, buffer. |
| `attaquant/config.py` | Ports HTTP/TCP, dossier de stockage. |
| `controleur/config.py` | IP/port de l’attaquant consommés par le CLI. |

## Vérifications rapides

- `python server.py` doit afficher les ports ouverts et la création du dossier `logs`.  
- `python keylogger.py` doit afficher l’UUID de la victime et le mode d’exfiltration.  
- `python controller.py` doit permettre `list` puis `logs <victim_id>`.  
- Le dashboard web (`http://<IP_attaquant>:8080`) doit afficher la victime, ses logs et les boutons de commande.

