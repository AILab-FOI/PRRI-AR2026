import logging
from flask import Flask, request, jsonify, send_from_directory, render_template
from ZODB import DB
import ZEO
from persistent import Persistent
from persistent.list import PersistentList
from ZEO import ClientStorage
import transaction
import os
import json
import time
import logging
logging.basicConfig(filename='app.log', level=logging.DEBUG)

app = Flask(__name__)
app.config['STATIC_URL_PATH'] = '/static'
# ZEO server address
zeo_server_address = ('31.147.206.149', 5334)

# Path to the .json files with data
markers_json_path = "json/markers.json"
models_json_path = "json/models.json"
quests_json_path = "json/quests.json"

@app.route('/')
def serve_html():
    return send_from_directory('.', 'index.html')

@app.route('/json/<path:filename>')
def serve_json(filename):
    return send_from_directory('json', filename)

@app.route('/startPage.html')
def serve_start_page(): 
    return send_from_directory('static', 'startPage.html')   

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
    def __init__(self, id, time_limit=2700, game_completed=False):
        self.id = id
        self.time_limit = time_limit  # Time limit in seconds
        self.start_time = time.time()  # Store the start time
        self.players = PersistentList()  # List to store players in the session
        self.game_completed = game_completed
        self.game_state = {}  # Initialize game state dictionary

    def add_player(self, player):
        if len(self.players) < 2:  # Provjera maksimalnog broja igrača
            self.players.append(player)
            player.game_session = self
        else:
            raise ValueError("Maximum number of players reached for this session")

    def remove_player(self, player):
        if player in self.players:
            self.players.remove(player)
            player.game_session = None
        else:
            raise ValueError("Player not found in this session")

    def complete_game(self):
        self.game_completed = True

    def get_players(self):
        return list(self.players)

    def get_remaining_time(self):
        elapsed_time = time.time() - self.start_time
        remaining_time = self.time_limit - elapsed_time
        return max(0, remaining_time)  # Ensure remaining time is not negative

    def is_time_up(self):
        return self.get_remaining_time() <= 0

    def update_game_state(self, game_state):
        self.game_state = game_state

# Initialize the database if it doesn't already exist
#db_path = '/'  # Define db_path

'''if not os.path.exists(db_path):
    storage = ClientStorage.ClientStorage(zeo_server_address)
    db = DB(storage)
    connection = db.open()
    root = connection.root()

    # Load data from the markers JSON file and save it to the database
    with open(markers_json_path) as json_file:
        markers_data = json.load(json_file)
        root['markers'] = markers_data

    # Load data from the models JSON file and save it to the database
    with open(models_json_path) as json_file:
        models_data = json.load(json_file)
        root['models'] = models_data

    # Load data from the quests JSON file and save it to the database
    with open(quests_json_path) as json_file:
        quests_data = json.load(json_file)
        root['quests'] = quests_data

    root['players'] = PersistentList()  # Initialize the list of players
    root['game_sessions'] = PersistentList()  # Initialize the list of game sessions

    transaction.commit()
    connection.close()
'''

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

        transaction.commit()

initialize_database()

# Route handler for creating a lobby
@app.route('/create_lobby', methods=['POST'])
def create_lobby():
    player_name = request.json.get('player_name')

    if not player_name:
        return 'Player Name must be provided', 400

    storage = ClientStorage.ClientStorage(zeo_server_address)
    db = DB(storage)
    connection = db.open()
    root = connection.root()
    game_sessions = root['game_sessions']

    # Determine player role based on lobby occupancy
    if len(game_sessions) == 0 or len(game_sessions[0].players) < 2:
        if len(game_sessions) == 0:
            new_session = GameSession(str(len(game_sessions) + 1), 3600)  # Example time limit: 3600 seconds (1 hour)
            game_sessions.append(new_session)
        else:
            new_session = game_sessions[0]

        if len(new_session.players) == 0:
            role = 'player1'
        elif len(new_session.players) == 1:
            role = 'player2'
        else:
            connection.close()
            return 'Lobby is full', 403

        player_id = role
        new_player = Player(player_id, player_name, role)
        new_session.add_player(new_player)

        transaction.commit()
        connection.close()

        return jsonify({'player_id': player_id, 'player_name': player_name, 'role': role}), 200
    else:
        connection.close()
        return 'Lobby is full', 403

@app.route('/start_timer', methods=['POST'])
def start_timer():
    storage = ClientStorage.ClientStorage(zeo_server_address)
    db = DB(storage)
    connection = db.open()
    root = connection.root()
    game_sessions = root['game_sessions']

    if len(game_sessions) > 0:
        session = game_sessions[0]
        session.start_time = time.time()
        transaction.commit()
        connection.close()
        return jsonify({'message': 'Game started'}), 200
    else:
        connection.close()
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
