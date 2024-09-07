-- Create the Users table
CREATE TABLE Users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    role VARCHAR(50) NOT NULL,
    password VARCHAR(255) NOT NULL
);

-- Create the Events table
CREATE TABLE Events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    startdate DATE NOT NULL,
    enddate DATE NOT NULL,
    venue VARCHAR(255) NOT NULL,
    artist VARCHAR(100),
    host VARCHAR(100),
    nooftickets INT,
    price DECIMAL(10, 2),
    coords VARCHAR(255),
    agentID INT,
    FOREIGN KEY (agentID) REFERENCES Users(id)
);

-- Create the Images table
CREATE TABLE Images (
    id INT AUTO_INCREMENT PRIMARY KEY,
    event_id INT,
    image_url VARCHAR(255),
    FOREIGN KEY (event_id) REFERENCES Events(id) ON DELETE CASCADE
);

-- Create the Customers table
CREATE TABLE Customers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100),
    phone VARCHAR(20),
    eventID INT,
    ticketNo INT,
    price DECIMAL(10, 2),
    FOREIGN KEY (eventID) REFERENCES Events(id) ON DELETE CASCADE
);

-- Insert dummy data into Users table
INSERT INTO Users (name, email, role, password) VALUES
('John Doe', 'johndoe@example.com', 'admin', 'password123'),
('Alice Smith', 'alice@example.com', 'agent', 'password123'),
('Bob Johnson', 'bob@example.com', 'agent', 'password123'),
('Charlie Brown', 'charlie@example.com', 'host', 'password123'),
('Emily Davis', 'emily@example.com', 'user', 'password123');

-- Insert dummy data into Events table
INSERT INTO Events (title, description, startdate, enddate, venue, artist, host, nooftickets, price, coords, agentID) VALUES
('Music Fest', 'A grand music festival', '2024-09-20', '2024-09-21', 'Central Park', 'The Weekend', 'John Doe', 1000, 49.99, '40.785091,-73.968285', 2),
('Art Exhibition', 'Modern art exhibition', '2024-10-01', '2024-10-05', 'Art Gallery', 'Various Artists', 'Alice Smith', 500, 25.00, '40.729515,-73.996460', 3),
('Food Carnival', 'Delicious food from around the world', '2024-09-15', '2024-09-16', 'City Plaza', 'Chef Gordan', 'Bob Johnson', 1500, 35.00, '40.741895,-73.989308', 4),
('Tech Conference', 'Latest in technology trends', '2024-11-10', '2024-11-12', 'Convention Center', 'Elon Musk', 'Charlie Brown', 3000, 199.99, '40.748817,-73.985428', 5),
('Comedy Night', 'Stand-up comedy night', '2024-08-30', '2024-08-30', 'Downtown Theater', 'Kevin Hart', 'Emily Davis', 800, 59.99, '40.730610,-73.935242', 2);

-- Insert dummy data into Images table
INSERT INTO Images (event_id, image_url) VALUES
(1, 'https://example.com/images/musicfest.jpg'),
(2, 'https://example.com/images/artexhibition.jpg'),
(3, 'https://example.com/images/foodcarnival.jpg'),
(4, 'https://example.com/images/techconference.jpg'),
(5, 'https://example.com/images/comedynight.jpg');

-- Insert dummy data into Customers table
INSERT INTO Customers (name, email, phone, eventID, ticketNo, price) VALUES
('Michael Scott', 'michael@example.com', '123-456-7890', 1, 1001, 49.99),
('Jim Halpert', 'jim@example.com', '123-456-7891', 2, 1002, 25.00),
('Pam Beesly', 'pam@example.com', '123-456-7892', 3, 1003, 35.00),
('Dwight Schrute', 'dwight@example.com', '123-456-7893', 4, 1004, 199.99),
('Stanley Hudson', 'stanley@example.com', '123-456-7894', 5, 1005, 59.99);
