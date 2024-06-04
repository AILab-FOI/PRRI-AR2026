document.addEventListener('DOMContentLoaded', function() {
    const createLobbyButton = document.getElementById('create-lobby-button');
    const startGameButton = document.getElementById('start-game-button');
    const lobbyInfo = document.getElementById('lobby-info');
    const lobbyStatus = document.getElementById('lobby-status');
    const playerNameInput = document.getElementById('player-name-input');

    createLobbyButton.addEventListener('click', function(event) {
        event.preventDefault();
        const playerName = playerNameInput.value;

        if (!playerName) {
            alert('Please enter your name');
            return;
        }

        fetch('/create_lobby', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ player_name: playerName }),
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            if (data.role) {
                lobbyStatus.innerText = `Lobby created. You are ${data.role}.`;
                lobbyInfo.style.display = 'block';
            } else {
                alert('Error creating lobby: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    });

    startGameButton.addEventListener('click', function(event) {
        event.preventDefault();
        fetch('/start_timer', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ start: true }),
        })
        .then(response => response.json())
        .then(data => {
            console.log(data.message);
            window.location.href = 'startPage.html';
        })
        .catch(error => {
            console.error('Error:', error);
        });
    });
});
