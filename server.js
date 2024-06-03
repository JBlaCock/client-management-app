const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');

// Setup multer for file uploadsand specify the destination directory
const upload = multer({ dest: 'public/uploads/' });

const app = express();
const port = 3000;

// Import database functions
const db = require('./database');

// Middleware to serve static files from the 'public' directory
app.use(express.static('public'));
// Middleware to parse URL-encoded data and JSON data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Middleware to log the raw body of incoming requests for debugging
app.use((req, res, next) => {
    console.log('Raw Body:', req.body);
    next();
});

// Serve the main HTML file at the root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Handle client creation with file upload for client images
app.post('/clients', upload.single('clientImage'), (req, res) => {
    const clientData = {
        name: req.body.name,
        age: req.body.age,
        gender: req.body.gender,
        fitnessLevel: req.body.fitnessLevel,
        goal: req.body.goal,
        imagePath: req.file ? `/uploads/${req.file.filename}` : '/images/default.jpg'
    };

    console.log('Client Data to be added:', clientData);

    db.addClient(clientData, function(err, newClient) {
        if (err) {
            console.error('Error adding client:', err);
            res.status(500).send({ success: false, message: 'Failed to add client' });
        } else {
            res.send({ success: true, message: 'Client added successfully', client: newClient });
        }
    });
});

// Fetch a specific client's details by ID
app.get('/clients/:id', (req, res) => {
    const id = req.params.id;
    db.getClient(id, (err, client) => {
        if (err) {
            res.status(500).send({ success: false, message: 'Error retrieving client.' });
        } else if (!client) {
            res.status(404).send({ success: false, message: 'Client not found.' });
        } else {
            res.json(client);
        }
    });
});

// Delete a specific client by ID
app.delete('/clients/:id', (req, res) => {
    const { id } = req.params;
    db.deleteClient(id, function(err) {
        if (err) {
            res.status(500).send({ success: false, message: 'Failed to delete client' });
        } else {
            res.send({ success: true, message: 'Client deleted successfully' });
        }
    });
});

// Fetch all clients from the database
app.get('/clients', (req, res) => {
    db.getAllClients((err, clients) => {
        if (err) {
            res.status(500).send('Error retrieving clients from the database.');
        } else {
            res.json(clients);
        }
    });
});

// Add measurements for a specific client by ID
app.post('/clients/:id/measurements', (req, res) => {
    const clientId = req.params.id;
    const measurementData = {
        clientId: clientId,
        arm: req.body.arm,
        chest: req.body.chest,
        waist: req.body.waist,
        date: new Date()
    };

    console.log('Received Measurement Data:', measurementData);

    db.addMeasurement(measurementData, function(err) {
        if (err) {
            res.status(500).send({ success: false, message: 'Failed to add measurement' });
        } else {
            res.send({ success: true, message: 'Measurement added successfully', measurement: measurementData });
        }
    });
});

// Fetch all measurements for a specific client by ID
app.get('/clients/:id/measurements', (req, res) => {
    const clientId = req.params.id;
    db.getMeasurements(clientId, (err, measurements) => {
        if (err) {
            res.status(500).send({ success: false, message: 'Error retrieving measurements.' });
        } else {
            res.json(measurements);
        }
    });
});

// Close the database connection on server shutdown
process.on('SIGINT', () => {
    db.closeDatabase();
    process.exit(0);
});

// Start the server and listen on the specified port
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
