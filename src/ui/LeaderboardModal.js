// LeaderboardModal.js - Papan Ranking Pemain Mengikut Points

export class LeaderboardModal {
  constructor(saveManager, audioManager) {
    this.saveManager = saveManager;
    this.audioManager = audioManager;
    this.container = document.getElementById('leaderboard-modal-container');
    this.isOpen = false;
  }

  show() {
    this.isOpen = true;
    const leaderboard = this.saveManager.getLeaderboard();
    const currentName = this.saveManager.currentUsername;

    const medals = ['🥇', '🥈', '🥉'];

    this.container.innerHTML = `
      <div class="modal-backdrop">
        <div class="leaderboard-card bounce-in">
          <button id="lead-close-btn" class="modal-close-btn" aria-label="Tutup">✕</button>

          <div class="lead-header">
            <span class="lead-icon">🏆</span>
            <div>
              <h2 class="lead-title">Papan Ranking Math City</h2>
              <p class="lead-subtitle">Kedudukan pemain berdasarkan Point yang dikumpul daripada menembak zombie!</p>
            </div>
          </div>

          <div class="leaderboard-table-container">
            <table class="leaderboard-table">
              <thead>
                <tr>
                  <th>Kedudukan</th>
                  <th>Pemain</th>
                  <th>Mata Point (Ranking)</th>
                  <th>Zombie Kalah</th>
                  <th>Baki Syiling</th>
                </tr>
              </thead>
              <tbody>
                ${leaderboard.map((player, idx) => {
                  const isCurrent = player.username === currentName;
                  const rankBadge = idx < 3 ? medals[idx] : `#${idx + 1}`;
                  return `
                    <tr class="${isCurrent ? 'current-player-row' : ''}">
                      <td class="rank-cell"><strong>${rankBadge}</strong></td>
                      <td class="name-cell">
                        <span class="player-avatar-icon">👤</span>
                        <strong>${player.username}</strong>
                        ${isCurrent ? '<span class="you-badge">(Anda)</span>' : ''}
                      </td>
                      <td class="points-cell">🏆 <strong>${player.points}</strong> pts</td>
                      <td class="zombies-cell">🧟 ${player.zombiesDefeated}</td>
                      <td class="coins-cell">🪙 ${player.coins}</td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          </div>

          <div class="lead-footer">
            <button id="lead-done-btn" class="lead-btn-done">Tutup Papan Ranking</button>
          </div>
        </div>
      </div>
    `;

    this.container.classList.remove('hidden');

    document.getElementById('lead-close-btn').addEventListener('click', () => this.close());
    document.getElementById('lead-done-btn').addEventListener('click', () => this.close());
  }

  close() {
    this.container.classList.add('hidden');
    this.isOpen = false;
  }
}
