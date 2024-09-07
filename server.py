from flask import Flask, jsonify
from flask_cors import CORS
import mysql.connector
from mysql.connector import Error
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

def execute_query(query):
    connection = create_connection()
    if connection:
        cursor = connection.cursor()
        try:
            cursor.execute(query)
            results = cursor.fetchall()  # Fetch all the rows from the result of the query
            cursor.close()
            connection.close()
            return results
        except Error as e:
            print(f"Error executing query: {e}")
            return None
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



if __name__ == '__main__':
    app.run(debug=True)
    
