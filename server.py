from flask import Flask, jsonify, request
from flask_cors import CORS
import mysql.connector
from mysql.connector import Error
import math
from config import Config

app = Flask(__name__)
CORS(app)

# Function to create a connection to MySQL
def create_connection():
    try:
        connection = mysql.connector.connect(
            host=Config.MYSQL_HOST,
            user=Config.MYSQL_USER,
            password=Config.MYSQL_PASSWORD,
            database=Config.MYSQL_DB
        )
        if connection.is_connected():
            print("Connected to MySQL database")
        return connection
    except Error as e:
        print(f"Error connecting to MySQL: {e}")
        return None

def execute_query(query, params=None):
    conn = create_connection()
    if conn:
        cursor = conn.cursor()
        try:
            cursor.execute(query, params)
            if query.strip().upper().startswith('SELECT'):
                results = cursor.fetchall()
                return results
            else:
                conn.commit()
                return cursor.lastrowid
        except mysql.connector.Error as err:
            print(f"Error: {err}")
            return None
        finally:
            cursor.close()
            conn.close()
    return None


# routes

@app.route('/api/events', methods=['GET'])
def get_events():

    query = '''
        SELECT 
        events.id AS event_id, 
        events.title, 
        events.description, 
        events.startdate, 
        events.enddate, 
        events.venue, 
        events.artist, 
        events.host, 
        events.nooftickets, 
        events.price, 
        events.coords, 
        events.agentID,
        images.image_url
    FROM events
    LEFT JOIN images ON events.id = images.event_id;
    '''
    
    results = execute_query(query)
    events = []
    for row in results:
        
        # format dates
        startdate = row[3].strftime('%d-%m-%Y')
        enddate = row[4].strftime('%d-%m-%Y')
        
        event = {
            'id': row[0],  # Assuming 'id' is the first column
            'title': row[1],
            'description': row[2],
            'startdate': startdate, 
            'enddate': enddate,
            'venue': row[5],
            'artist': row[6],
            'host': row[7],
            'nooftickets': row[8],
            'price': row[9],
            'coords': row[10],
            'agentID': row[11],
            'image': row[12]
            
        }
        events.append(event)
    if events:
        return jsonify(events)
    return jsonify([])



def haversine(lat1, lon1, lat2, lon2):
    R = 6371  # Radius of Earth in kilometers
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = (math.sin(dlat / 2) ** 2 +
         math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) *
         math.sin(dlon / 2) ** 2)
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return R * c

@app.route('/customer', methods=['GET'])
def search_events():
    
    type = request.args.get('type')
    query = request.args.get('query')
    lat = request.args.get('lat', type=float)
    lon = request.args.get('lon', type=float)

    print(f"Type: {type}, Query: {query}, Lat: {lat}, Lon: {lon}")

    # Base query to search events
    base_query = """
    SELECT id, title, description, startdate, enddate, venue, artist, host,
           nooftickets, price, coords
    FROM events
    WHERE (%s IS NULL OR etype = %s) AND
          (%s IS NULL OR (title LIKE %s OR description LIKE %s OR venue LIKE %s OR artist LIKE %s OR host LIKE %s))
    """
    params = (
        type, type,
        query, f'%{query}%', f'%{query}%', f'%{query}%', f'%{query}%', f'%{query}%'
    )
    
    # Fetch events matching type and query
    events = execute_query(base_query, params)

    # Filter by coordinates if lat and lon are provided
    if lat is not None and lon is not None:
        filtered_events = []
        for event in events:
            event_coords = event[-1]
            if event_coords:
                event_lat, event_lon = map(float, event_coords.split(','))
                distance = haversine(lat, lon, event_lat, event_lon)
                if distance <= 10:  # Within 1 km
                    filtered_events.append(event)
        events = filtered_events
    
    
    eventX = []
    for row in events:
        event = {
            'id': row[0],  # Assuming 'id' is the first column
            'title': row[1],
            'description': row[2],
            'startdate': row[3].strftime('%d-%m-%Y'),
            'enddate': row[4].strftime('%d-%m-%Y'),
            'venue': row[5],
            'artist': row[6],
            'host': row[7],
            'nooftickets': row[8],
            'price': row[9],
            'coords': row[10]
        }
        eventX.append(event)
        
    return jsonify(eventX)



@app.route('/addEvent', methods=['POST'])
def add_event():
    data = request.get_json()

    # Extract data from request
    title = data.get('title')
    description = data.get('description')
    startdate = data.get('startdate')
    enddate = data.get('enddate')
    venue = data.get('venue')
    artist = data.get('artist')
    host = data.get('host')
    nooftickets = data.get('nooftickets')
    price = data.get('price')
    coords = data.get('coords')
    agentID = data.get('agentID')

    # Validate data (basic checks)
    if not all([title, description, startdate, enddate, venue, artist, host, nooftickets, price, coords, agentID]):
        return jsonify({'error': 'Missing required fields'}), 400

    # Prepare SQL query to insert event
    query = """
    INSERT INTO events (title, description, startdate, enddate, venue, artist, host, nooftickets, price, coords, agentID, sold, views)
    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
    """
    params = (title, description, startdate, enddate, venue, artist, host, nooftickets, price, coords, agentID, 0, 0)

    # Execute query
    event_id = execute_query(query, params)

    if event_id:
        return jsonify({'message': 'Event added successfully', 'event_id': event_id}), 201
    else:
        return jsonify({'error': 'Failed to add event'}), 500


if __name__ == '__main__':
    app.run(debug=True)
    



