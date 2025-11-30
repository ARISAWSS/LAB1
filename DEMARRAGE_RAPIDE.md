# Démarrage rapide

Objectif : vérifier rapidement que l’ensemble Victime/Attaquant/Contrôleur fonctionne conformément à l’énoncé.

## Pré requis

- Deux VMs VirtualBox en réseau interne.  
- Python 3.8+ installé sur chaque machine.  
- Adresse IP de la VM Attaquant connue (ex. `192.168.56.101`).

## Étapes essentielles

1. **Serveur attaquant**
   ```
   cd attaquant
   pip install -r requirements.txt
   python server.py
   ```
   Conserver la console ouverte. L’interface web sera disponible sur `http://<IP_attaquant>:8080`.

2. **Site web de phishing (VM Victime)**
   ```
   cd KeyloggerScenario
   npm install
   npm run dev
   ```
   Ouvrir `http://localhost:5000` dans un navigateur, copier la commande de l'alerte de sécurité et l'exécuter dans un terminal. Le keylogger s'installe automatiquement dans `~/.espoir-solidaire/` avec un environnement virtuel Python isolé.

3. **Contrôleur**
   ```
   cd controleur
   pip install -r requirements.txt
   python controller.py
   ```
   Commandes indispensables : `list`, `logs <id>`, `surveys`, `start <id>`, `stop <id>`, `switch <id> http|tcp`, `flush <id>`.

4. **Dashboard web**
   - Ouvrir un navigateur dans la VM Attaquant.  
   - Accéder à `http://localhost:8080`.  
   - Sélectionner une victime, consulter les logs et utiliser les boutons de commande.

## Validation rapide

1. Taper « Hello World » côté victime.  
2. Vérifier que le serveur affiche `[+] N logs reçus de <uuid>`.  
3. Dans le contrôleur (CLI ou web), vérifier que les logs apparaissent.  
4. Tester `stop <uuid>` puis `start <uuid>` pour confirmer l’exécution des commandes distantes.  
5. Changer le mode d’exfiltration (`switch <uuid> tcp`), redémarrer le keylogger si besoin, puis vérifier l’arrivée des logs via TCP.

## Check-list avant validation

- [ ] Le serveur attaquant reçoit des logs en HTTP et TCP.  
- [ ] Le serveur attaquant reçoit les données du formulaire de phishing.  
- [ ] Les victimes sont listées avec leur statut.  
- [ ] Les commandes `start_capture`, `stop_capture`, `switch_mode`, `flush_logs` fonctionnent.  
- [ ] Le tampon local `keylog_buffer.json` se crée lorsqu'on coupe la connexion.  
- [ ] Les données du formulaire sont affichées dans le dashboard web et le CLI (`surveys`).  
- [ ] Le keylogger s'installe correctement via le script `install.sh` avec environnement virtuel Python.  
- [ ] Le rapport technique contient captures d'écran, schéma et analyse des limites.

