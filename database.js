const sqlite3 = require('sqlite3').verbose();

// Open or create the database file
const db = new sqlite3.Database('./clients.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Connected to the clients database.');
});

// Initialize the database schema
db.serialize(() => {
    // Create the clients table if it doesn't exist
    db.run("CREATE TABLE IF NOT EXISTS clients (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, age INTEGER, gender TEXT, fitnessLevel TEXT, goal TEXT, imagePath TEXT)");
    
    // Create the measurements table if it doesn't exist
    db.run(`CREATE TABLE IF NOT EXISTS measurements (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        clientId INTEGER,
        arm INTEGER,
        chest INTEGER,
        waist INTEGER,
        date DATE DEFAULT CURRENT_DATE,
        FOREIGN KEY(clientId) REFERENCES clients(id)
    )`);
});

// Add a new client to the database
function addClient(client, callback) {
    const sql = 'INSERT INTO clients (name, age, gender, fitnessLevel, goal, imagePath) VALUES (?, ?, ?, ?, ?, ?)';
    db.run(sql, [client.name, client.age, client.gender, client.fitnessLevel, client.goal, client.imagePath], function(err) {
        if (err) {
            callback(err);
        } else {
            client.id = this.lastID; 
            callback(null, client);
        }
    });
}

// Retrieve a client by ID from the database
function getClient(clientId, callback) {
    const sql = 'SELECT * FROM clients WHERE id = ?';
    db.get(sql, [clientId], (err, row) => {
        if (err) {
            callback(err, null);
        } else {
            callback(null, row);
        }
    });
}

// Delete a client by ID from the database
function deleteClient(id, callback) {
    db.run("DELETE FROM clients WHERE id = ?", [id], function(err) {
        callback(err);
    });
}

// Retrieve all clients from the database
function getAllClients(callback) {
    const sql = 'SELECT * FROM clients';
    db.all(sql, [], (err, rows) => {
        if (err) {
            callback(err, null);
        } else {
            callback(null, rows);
        }
    });
}

// Add a new measurement for a client to the database
function addMeasurement(measurement, callback) {
    const sql = 'INSERT INTO measurements (clientId, arm, chest, waist, date) VALUES (?, ?, ?, ?, ?)';
    db.run(sql, [measurement.clientId, measurement.arm, measurement.chest, measurement.waist, measurement.date], function(err) {
        if (err) {
            callback(err);
        } else {
            callback(null);
        }
    });
}

// Retrieve all measurements for a client from the database
function getMeasurements(clientId, callback) {
    const sql = 'SELECT * FROM measurements WHERE clientId = ? ORDER BY date DESC';
    db.all(sql, [clientId], (err, rows) => {
        if (err) {
            callback(err, null);
        } else {
            callback(null, rows);
        }
    });
}

// Close the database connection
function closeDatabase() {
    db.close((err) => {
        if (err) {
            console.error(err.message);
        }
        console.log('Closed the database connection.');
    });
}

module.exports = { addClient, getClient, deleteClient, getAllClients, addMeasurement, getMeasurements, closeDatabase };
