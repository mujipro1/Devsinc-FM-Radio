from flask import Flask, jsonify, request
from flask_cors import CORS
import mysql.connector
from mysql.connector import Error
import math
from config import Config

app = Flask(__name__)
CORS(app)

# Function to create a connection to MySQL

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    
    query = "SELECT * FROM users WHERE email = %s AND password = %s"
    params = (email, password)
    
    results = execute_query(query, params)
    
    if results:
        user = {
            'id': results[0][0],
            'name': results[0][1],
            'email': results[0][2],
            'role': results[0][3]
        }
        return jsonify(user)
    return jsonify({'error': 'Invalid credentials'}), 401


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
        query, query, query, query, query, query
    )
    
    # Fetch events matching type and query
    events = execute_query(base_query, params)
    print(events)
    
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
    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
    """
    params = (title, description, startdate, enddate, venue, artist, host, nooftickets, price, coords, agentID, 0, 0)

    # Execute query
    event_id = execute_query(query, params)

    if event_id:
        return jsonify({'message': 'Event added successfully', 'event_id': event_id}), 201
    else:
        return jsonify({'error': 'Failed to add event'}), 500


@app.route('/admin', methods=['GET'])
def admin():
    # Query to get all events
    events_query = "SELECT * FROM events"
    events = execute_query(events_query)
    

    # Query to get total tickets sold this month
    tickets_sold_query = """
    SELECT SUM(sold) AS total_tickets_sold
    FROM events
    WHERE MONTH(startdate) = MONTH(CURDATE())
      AND YEAR(startdate) = YEAR(CURDATE())
    """
    tickets_sold_result = execute_query(tickets_sold_query)
    total_tickets_sold = tickets_sold_result[0] if tickets_sold_result and tickets_sold_result[0] else 0

    # Query to get total sales this month
    sales_query = """
    SELECT SUM(sold * price) AS total_sales
    FROM events
    WHERE MONTH(startdate) = MONTH(CURDATE())
      AND YEAR(startdate) = YEAR(CURDATE())
    """
    
    no_of_agents_query = "SELECT COUNT(*) AS total_agents FROM users where role='agent'"
    no_of_agents_result = execute_query(no_of_agents_query)
    total_agents = no_of_agents_result[0] if no_of_agents_result and no_of_agents_result[0] else 0

    sales_result = execute_query(sales_query)
    total_sales = sales_result[0] if sales_result and sales_result[0] else 0
    
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
    
    events = eventX
    
    return jsonify({
        'events': events,
        'tickets': total_tickets_sold,
        'sales': total_sales,
        'agents': total_agents
    })
    
@app.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')
    role = 'agent'
    
    query = "INSERT INTO users (name, email, password, role) VALUES (%s, %s, %s, %s)"
    params = (name, email, password, role)
    
    user_id = execute_query(query, params)
    
    if user_id:
        return jsonify({'message': 'User created successfully', 'user_id': user_id}), 201
    else:
        return jsonify({'error': 'Failed to create user'}), 500

if __name__ == '__main__':
    app.run(debug=True)
    



