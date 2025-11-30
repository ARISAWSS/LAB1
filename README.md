LAB 1 – Extension avancée : Projet de simulation Keylogger
==========================================================

Contexte
--------

Ce référentiel contient une implémentation complète du scénario décrit dans
l’énoncé « LAB 1 – Extension Avancée : Projet de Simulation Keylogger ». L’objectif
est de passer d’un simple script de capture à une maquette pédagogique réaliste,
exécutée exclusivement dans des machines virtuelles VirtualBox reliées par un
réseau interne.

Composants
----------

1. **VM Victime**  
   - Keylogger Python basé sur `pynput` avec environnement virtuel isolé. Il génère un UUID au démarrage, capture les frappes en temps réel, normalise chaque touche, encode les événements en JSON et les exfiltre via HTTP POST ou socket TCP. Un mécanisme de retry, un tampon mémoire et un tampon disque assurent la résilience.
   - Site web de phishing "Espoir Solidaire" : application Node.js/React simulant une organisation caritative avec formulaire d'enquête et alerte de sécurité trompeuse permettant l'installation automatique du keylogger.

2. **VM Attaquant**  
   Serveur Flask doublé d'un listener TCP. Il reçoit les logs, les stocke par
   victime et par date, expose une API REST, fournit un tableau de bord web,
   et conserve les commandes à envoyer aux victimes. Réception également des données du formulaire de phishing.

3. **Contrôleur**  
   - Interface CLI : liste des victimes, consultation des logs, analyse rapide,
     envoi des commandes `start_capture`, `stop_capture`, `switch_mode`,
     `flush_logs`, affichage des données des formulaires capturés.
   - Tableau de bord web : mêmes fonctionnalités avec rafraîchissement périodique,
     boutons dédiés aux commandes distantes, et affichage des données du formulaire de phishing.

Exigences couvertes
-------------------

| Exigence de l’énoncé | Implémentation |
|----------------------|----------------|
| Capture temps réel | Listener `pynput` dans `victime/keylogger.py`. |
| Normalisation + JSON | Méthodes `normalize_key` et `encode_logs`. |
| UUID par victime | Généré à l’initialisation du keylogger. |
| Exfiltration HTTP | Endpoint `/logs` côté attaquant. |
| Exfiltration TCP | Listener socket port 9999. |
| Résilience | Retry, buffer mémoire, fichier `keylog_buffer.json`. |
| Récepteur côté attaquant | Serveur Flask + stockage structuré. |
| Analyse optionnelle | Endpoint `/victims/<id>/analyze` + affichage CLI/web. |
| Contrôleur léger | CLI + dashboard web avec commandes distantes. |

Architecture synthétique
------------------------

```
            +---------------------+         +----------------------+
            |      VM Victime     |         |      VM Attaquant    |
            |  keylogger.py       |  HTTP   |  server.py + Flask   |
            |  UUID + capture     |  / TCP  |  stockage + API      |
            +---------+-----------+         +----------+-----------+
                      |                               ^
                      |                               |
                      v                               |
            +---------------------+         +----------+-----------+
            |   Contrôleur CLI    |<--------|  Dashboard web       |
            |   controller.py     |  REST   |  templates/static    |
            +---------------------+         +----------------------+
```

Machines virtuelles
-------------------

* Une VM « Victime » et une VM « Attaquant » (au minimum).
* Réseau VirtualBox en mode « Réseau Interne ».
* Aucune exécution sur machine physique ou réseau de production.

Installation (résumé)
---------------------

1. **VM Attaquant**
   ```
   cd attaquant
   pip install -r requirements.txt
   python server.py
   ```
   Accès Web : `http://<IP_attaquant>:8080`.

2. **VM Victime - Scénario de phishing**
   ```
   cd KeyloggerScenario
   npm install
   npm run dev
   ```
   Accès au site : `http://localhost:5000`
   
   Le keylogger est installé automatiquement via le script `install.sh` servi par le site web. L'installation crée un environnement virtuel Python isolé et installe le keylogger dans `~/.espoir-solidaire/`.

3. **Contrôleur**
   ```
   cd controleur
   pip install -r requirements.txt
   python controller.py
   ```

Documentation
-------------

* `GUIDE_ETAPES.md` : procédure détaillée (création des VMs, configuration réseau,
  tests et dépannage).
* `DEMARRAGE_RAPIDE.md` : check-list succincte.
* `ARCHITECTURE.md` : schémas et flux techniques.
* `RAPPORT_TECHNIQUE.md` : rapport complet (architecture, code, limites, pistes).
* `STRUCTURE_PROJET.md` : cartographie des fichiers.

Avertissements
--------------

* Usage strictement pédagogique en environnement isolé.
* Respecter la législation en vigueur : aucun déploiement sur des systèmes non
  autorisés.
* Les dépendances signalées par Dependabot doivent être maintenues à jour.

Pour toute extension (chiffrement, persistance, nouvelles analyses), se référer
au rapport technique et aux sections d’amélioration proposées.
