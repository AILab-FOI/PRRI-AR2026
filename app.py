import logging
from flask import Flask, request, jsonify, send_from_directory, render_template
from ZODB import DB
import ZEO
from persistent import Persistent
from persistent.list import PersistentList
from persistent.mapping import PersistentMapping
from ZEO import ClientStorage
import transaction
import os
import json
import time

logging.basicConfig(filename='app.log', level=logging.DEBUG)

app = Flask(__name__)
app.config['STATIC_URL_PATH'] = '/static'
# ZEO server address
zeo_server_address = ("localhost", 5334)

# Path to the .json files with data
markers_json_path = "json/markers.json"
models_json_path = "json/models.json"
quests_json_path = "json/quests.json"

@app.route('/audio/<path:filename>')
def serve_audio(filename):
    return send_from_directory('audio', filename)

@app.route('/')
def serve_html():
    return send_from_directory('.', 'index.html')

@app.route('/json/<path:filename>')
def serve_json(filename):
    return send_from_directory('json', filename)

@app.route('/startPage.html')
def serve_start_page():
    return send_from_directory('static', 'startPage.html')

@app.route('/progress.html')
def serve_progress_page():
    return send_from_directory('static', 'progress.html')

# Ruta za posluživanje CSS datoteka
@app.route('/static/start.css')
def serve_css():
    return send_from_directory('static', 'start.css')

# Ruta za posluživanje JavaScript datoteka
@app.route('/js/<path:filename>')
def serve_js(filename):
    return send_from_directory('js', filename)

@app.route('/ex/js/<path:filename>')
def serve_ex_js(filename):
    return send_from_directory('ex/js', filename)

@app.route('/ex/images/<path:filename>')
def serve_ex_images(filename):
    return send_from_directory('ex/images', filename)

# Ruta za posluživanje slika
@app.route('/images/<path:filename>')
def serve_png(filename):
    return send_from_directory('images', filename)

@app.route('/Markers/<path:filename>')
def serve_markers(filename):
    return send_from_directory('Markers', filename)

@app.route('/Models/<path:filename>')
def serve_folders(filename):
    return send_from_directory('Models', filename)

@app.route('/Patterns/<path:filename>')
def serve_patterns(filename):
    return send_from_directory('Patterns', filename)

class Player(Persistent):
    def __init__(self, id, name, role, game_session=None):
        self.id = id
        self.name = name
        self.role = role
        self.game_session = game_session  # Referenca na instancu GameSession

class GameSession(Persistent):
    def __init__(self, lobby_name, host_name, time_limit=3600):
        self.id = lobby_name
        self.lobby_name = lobby_name
        self.host_name = host_name
        self.time_limit = time_limit
        self.start_time = None
        self.is_started = False
        self.players = PersistentList()  # lista stringova (imena igrača)
        self.game_completed = False
        self.game_state = PersistentMapping()  # puzzle_id -> player_name
        self.completion_time = None

    def get_remaining_time(self):
        if not self.is_started or self.start_time is None:
            return self.time_limit
        if self.game_completed and self.completion_time is not None:
            return max(0, self.time_limit - self.completion_time)
        elapsed_time = time.time() - self.start_time
        return max(0, self.time_limit - elapsed_time)

    def is_time_up(self):
        return self.is_started and self.get_remaining_time() <= 0

    def update_game_state(self, game_state):
        self.game_state = game_state

# Initialize the database if it doesn't already exist
#db_path = '/'  # Define db_path

@app.route('/check_answer', methods=['POST'])
def check_answer():
    data = request.get_json()
    answer = data.get('answer')
    if answer == "NEURON":
        return jsonify({'status': 'success', 'message': 'Congratulations! You have completed the game!'})
    else:
        return jsonify({'status': 'error', 'message': 'Wrong answer! Try again!'})

TOTAL_PUZZLES = 10

@app.route('/solve_puzzle', methods=['POST'])
def solve_puzzle():
    data = request.get_json()
    puzzle_id = data.get('puzzle_id')
    player_name = data.get('player_name', 'Unknown')
    lobby_name = data.get('lobby_name')

    if not puzzle_id:
        return jsonify({'message': 'puzzle_id required'}), 400

    with db.transaction() as connection:
        root = connection.root()
        session = None
        if lobby_name and 'lobbies' in root and lobby_name in root['lobbies']:
            session = root['lobbies'][lobby_name]
        else:
            game_sessions = root.get('game_sessions')
            if game_sessions:
                session = game_sessions[0]
        if not session:
            return jsonify({'message': 'No active session'}), 404

        if not isinstance(session.game_state, PersistentMapping):
            session.game_state = PersistentMapping()
        if puzzle_id not in session.game_state:
            session.game_state[puzzle_id] = player_name
        count = len(session.game_state)
        transaction.commit()

    return jsonify({'solved': dict(session.game_state), 'count': count, 'total': TOTAL_PUZZLES}), 200

@app.route('/progress', methods=['GET'])
def progress():
    with db.transaction() as connection:
        root = connection.root()
        game_sessions = root.get('game_sessions')
        if not game_sessions:
            return jsonify({'count': 0, 'total': TOTAL_PUZZLES, 'solved': [], 'time_remaining': 0, 'game_completed': False}), 200

        session = game_sessions[0]
        solved = list(session.game_state.keys()) if session.game_state else []
        count = len(solved)

    return jsonify({
        'solved': solved,
        'count': count,
        'total': TOTAL_PUZZLES,
        'time_remaining': round(session.get_remaining_time()),
        'game_completed': session.game_completed
    }), 200

@app.route('/complete_game', methods=['POST'])
def complete_game():
    data = request.get_json() or {}
    lobby_name = data.get('lobby_name')

    with db.transaction() as connection:
        root = connection.root()
        session = None
        if lobby_name and 'lobbies' in root and lobby_name in root['lobbies']:
            session = root['lobbies'][lobby_name]
        else:
            game_sessions = root.get('game_sessions')
            if game_sessions:
                session = game_sessions[0]
        if not session:
            return jsonify({'message': 'No active session'}), 404

        session.game_completed = True
        elapsed = round(session.time_limit - session.get_remaining_time())
        session.completion_time = elapsed
        transaction.commit()

    return jsonify({'message': 'Game completed', 'completion_time': elapsed}), 200

# Connect to the ZEO server
storage = ZEO.ClientStorage.ClientStorage(zeo_server_address)
db = DB(storage)
# Load data from JSON files into ZODB if they don't already exist
def initialize_database():
    with db.transaction() as connection:
        root = connection.root()

        if 'markers' not in root:
            with open(markers_json_path) as json_file:
                markers_data = json.load(json_file)
                root['markers'] = PersistentList(markers_data)

        if 'models' not in root:
            with open(models_json_path) as json_file:
                models_data = json.load(json_file)
                root['models'] = PersistentList(models_data['models'])

        if 'quests' not in root:
            with open(quests_json_path) as json_file:
                quests_data = json.load(json_file)
                root['quests'] = PersistentList(quests_data['quests'])

        if 'players' not in root:
            root['players'] = PersistentList()

        if 'game_sessions' not in root:
            root['game_sessions'] = PersistentList()

        if 'lobbies' not in root:
            root['lobbies'] = PersistentMapping()

        transaction.commit()

initialize_database()

@app.route('/delete_lobby/<lobby_name>', methods=['DELETE'])
def delete_lobby(lobby_name):
    with db.transaction() as connection:
        root = connection.root()
        lobbies = root.get('lobbies', {})
        if lobby_name not in lobbies:
            return jsonify({'message': 'Lobby not found'}), 404
        del lobbies[lobby_name]
        transaction.commit()
    return jsonify({'message': 'Lobby deleted'}), 200


@app.route('/create_lobby', methods=['POST'])
def create_lobby():
    player_name = request.json.get('player_name')
    if not player_name:
        return jsonify({'message': 'Player name required'}), 400

    lobby_name = player_name.lower()

    with db.transaction() as connection:
        root = connection.root()
        lobbies = root['lobbies']
        session = GameSession(lobby_name, player_name, time_limit=3600)
        session.players.append(player_name)
        lobbies[lobby_name] = session
        transaction.commit()

    return jsonify({'lobby_name': lobby_name, 'role': 'host', 'player_name': player_name}), 200


@app.route('/join_lobby/<lobby_name>', methods=['POST'])
def join_lobby(lobby_name):
    player_name = request.json.get('player_name')
    if not player_name:
        return jsonify({'message': 'Player name required'}), 400

    with db.transaction() as connection:
        root = connection.root()
        lobbies = root['lobbies']
        if lobby_name not in lobbies:
            return jsonify({'message': 'Lobby not found'}), 404
        session = lobbies[lobby_name]
        if session.is_started:
            return jsonify({'message': 'Game already started'}), 403
        if player_name not in list(session.players):
            session.players.append(player_name)
        transaction.commit()

    return jsonify({'lobby_name': lobby_name, 'role': 'player', 'player_name': player_name, 'host': session.host_name}), 200


@app.route('/lobby/<lobby_name>', methods=['GET'])
def serve_lobby_page(lobby_name):
    return send_from_directory('static', 'lobby.html')


@app.route('/lobby/<lobby_name>/status', methods=['GET'])
def lobby_status(lobby_name):
    with db.transaction() as connection:
        root = connection.root()
        lobbies = root['lobbies']
        if lobby_name not in lobbies:
            return jsonify({'message': 'Lobby not found'}), 404
        session = lobbies[lobby_name]
        return jsonify({
            'lobby_name': lobby_name,
            'host': session.host_name,
            'players': list(session.players),
            'is_started': session.is_started,
            'player_count': len(session.players)
        }), 200


@app.route('/start_game/<lobby_name>', methods=['POST'])
def start_game(lobby_name):
    with db.transaction() as connection:
        root = connection.root()
        lobbies = root['lobbies']
        if lobby_name not in lobbies:
            return jsonify({'message': 'Lobby not found'}), 404
        session = lobbies[lobby_name]
        session.is_started = True
        session.start_time = time.time()
        transaction.commit()
    return jsonify({'message': 'Game started', 'lobby_name': lobby_name}), 200


@app.route('/startPage.html/<lobby_name>', methods=['GET'])
def serve_game_page(lobby_name):
    return send_from_directory('static', 'startPage.html')


@app.route('/lobby/<lobby_name>/progress', methods=['GET'])
def lobby_progress(lobby_name):
    with db.transaction() as connection:
        root = connection.root()
        lobbies = root['lobbies']
        if lobby_name not in lobbies:
            return jsonify({'message': 'Lobby not found'}), 404
        session = lobbies[lobby_name]
        solved_by = dict(session.game_state)
        return jsonify({
            'solved_by': solved_by,
            'count': len(solved_by),
            'total': TOTAL_PUZZLES,
            'time_remaining': round(session.get_remaining_time()),
            'game_completed': session.game_completed,
            'players': list(session.players),
            'host': session.host_name,
            'is_started': session.is_started
        }), 200


@app.route('/lobbies', methods=['GET'])
def list_lobbies():
    with db.transaction() as connection:
        root = connection.root()
        lobbies = root.get('lobbies', {})
        result = [{'lobby_name': name, 'host': s.host_name, 'player_count': len(s.players), 'is_started': s.is_started}
                  for name, s in lobbies.items()]
        return jsonify(result), 200


@app.route('/start_timer', methods=['POST'])
def start_timer():
    with db.transaction() as connection:
        root = connection.root()
        game_sessions = root.get('game_sessions')
        if game_sessions:
            game_sessions[0].start_time = time.time()
            transaction.commit()
            return jsonify({'message': 'Game started'}), 200
        return jsonify({'message': 'No game session found'}), 404



# Function to retrieve game state
def get_game_state():
    storage = ClientStorage.ClientStorage(zeo_server_address)
    db = DB(storage)
    connection = db.open()
    root = connection.root()
    markers = root['markers']
    game_sessions = root['game_sessions']

    # Initialize game state
    game_state = {
        'markers': markers,
        'game_sessions': {}
    }

    # Populate game state with data from active game sessions
    for session in game_sessions:
        game_state['game_sessions'][session.id] = session.game_state

    connection.close()
    return game_state

# Function to retrieve game sessions
def get_game_sessions():
    storage = ClientStorage.ClientStorage(zeo_server_address)
    db = DB(storage)
    connection = db.open()
    root = connection.root()
    game_sessions = root['game_sessions']
    connection.close()
    return game_sessions

# Route handler for scanning a marker
'''@app.route('/scan', methods=['POST'])
def scan():
    marker_id = request.json.get('marker_id')
    if marker_id:
        storage = ClientStorage.ClientStorage(zeo_server_address)
        db = DB(storage)
        connection = db.open()
        root = connection.root()
        markers = root['markers']

        if marker_id in markers:
            if not markers[marker_id]:
                markers[marker_id] = True
                transaction.commit()
                connection.close()
                return 'Marker scanned successfully'
            else:
                connection.close()
                return 'Marker already scanned', 400
        else:
            connection.close()
            return 'Marker not found in database', 404
    else:
        return 'Marker ID not provided', 400'''

@app.route('/scan', methods=['POST'])
def scan_marker():
    data = request.json
    marker_id = data.get('marker_id')

    if not marker_id:
        return jsonify({"message": "Marker ID missing in request"}), 400

    with db.transaction() as connection:
        root = connection.root()
        markers = root['markers']['markers']  # Directly use the PersistentList
        logging.info(root['markers'])
        # Find the marker with matching ID
        for marker in markers:
            if marker['id'] == marker_id:
                marker['isScanned'] = True
                break
        else:
            return jsonify({"message": f"Marker:  '{marker_id}' not found!"}), 404

        transaction.commit()
    logging.info(root['markers'])
    return jsonify({"message": f"Marker '{marker_id}' scanned successfully!"}), 200
    

# Route handler to retrieve game state
@app.route('/game_state', methods=['GET'])
def game_state():
    return get_game_state()

@app.route('/add_player', methods=['POST'])
def add_player():
    session_id = request.json.get('session_id')
    player_id = request.json.get('player_id')
    player_name = request.json.get('player_name')
    player_role = request.json.get('player_role')

    if not session_id or not player_id or not player_name or not player_role:
        return 'Session ID, Player ID, Player Name, and Player Role must be provided', 400

    storage = ClientStorage.ClientStorage(zeo_server_address)
    db = DB(storage)
    connection = db.open()
    root = connection.root()
    game_sessions = root['game_sessions']
    players = root['players']

    new_player = Player(player_id, player_name, player_role)

    for session in game_sessions:
        if session.id == session_id:
            try:
                session.add_player(new_player)
                players.append(new_player)
                transaction.commit()
                connection.close()
                return 'Player added successfully'
            except ValueError as e:
                connection.close()
                return str(e), 400

    connection.close()
    return 'Game session not found', 404


@app.route('/remove_player', methods=['POST'])
def remove_player():
    session_id = request.json.get('session_id')
    player_id = request.json.get('player_id')

    if not session_id or not player_id:
        return 'Session ID and Player ID must be provided', 400

    storage = ClientStorage.ClientStorage(zeo_server_address)
    db = DB(storage)
    connection = db.open()
    root = connection.root()
    game_sessions = root['game_sessions']
    players = root['players']

    for session in game_sessions:
        if session.id == session_id:
            for player in session.players:
                if player.id == player_id:
                    session.remove_player(player)
                    players.remove(player)
                    transaction.commit()
                    connection.close()
                    return 'Player removed successfully'

    connection.close()
    return 'Game session not found', 404

@app.route('/create_game_session', methods=['POST'])
def create_game_session():
    session_id = request.json.get('session_id')
    time_limit = request.json.get('time_limit')

    if not session_id or not time_limit:
        return 'Session ID and Time Limit must be provided', 400

    storage = ClientStorage.ClientStorage(zeo_server_address)
    db = DB(storage)
    connection = db.open()
    root = connection.root()
    game_sessions = root['game_sessions']

    new_session = GameSession(session_id, time_limit, game_completed=False)
    game_sessions.append(new_session)
    transaction.commit()
    connection.close()
    return 'Game session created successfully'


# Route handler to get the remaining time of a game session
@app.route('/get_remaining_time', methods=['POST'])
def get_remaining_time():
    session_id = request.json.get('session_id')

    if not session_id:
        return 'Session ID must be provided', 400

    storage = ClientStorage.ClientStorage(zeo_server_address)
    db = DB(storage)
    connection = db.open()
    root = connection.root()
    game_sessions = root['game_sessions']

    for session in game_sessions:
        if session.id == session_id:
            remaining_time = session.get_remaining_time()
            connection.close()
            return jsonify({'remaining_time': remaining_time})

    connection.close()
    return 'Game session not found', 404

# Kod za rješavanje questova u slučaju da nemamo dodatnu tablicu
@app.route('/solve_quest', methods=['POST'])
def solve_quest():
    player_id = request.json.get('player_id')
    quest_id = request.json.get('quest_id')

    if not player_id or not quest_id:
        return 'Player ID and Quest ID must be provided', 400

    storage = ClientStorage.ClientStorage(zeo_server_address)
    db = DB(storage)
    connection = db.open()
    root = connection.root()
    quests = root['quests']

    for quest in quests:
        if quest['id'] == quest_id:
            if quest['player_id'] == player_id:
                quest['isScanned'] = True
                transaction.commit()
                connection.close()
                return 'Quest solved successfully'
            else:
                connection.close()
                return 'This quest is not for you', 403

    connection.close()
    return 'Quest not found', 404


if __name__ == '__main__':
    app.run(debug=True)
