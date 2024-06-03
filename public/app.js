document.addEventListener('DOMContentLoaded', function() {
    fetchClients();

    const form = document.getElementById('clientForm');
    const measurementForm = document.getElementById('measurementForm');
    const clientModal = new bootstrap.Modal(document.getElementById('clientModal'));
    let currentClientId = null;

    // Event listener for client form submission
    form.addEventListener('submit', function(event) {
        event.preventDefault();
        const formData = new FormData(form);

        fetch('/clients', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const clientCardHTML = createClientCard(data.client);
                const clientCardsContainer = document.getElementById('clientCards');
                clientCardsContainer.insertAdjacentHTML('beforeend', clientCardHTML);
                displayNotification('Client added successfully!', 'alert-success');
                form.reset();
            } else {
                displayNotification('Failed to add client.', 'alert-danger');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            displayNotification('An error occurred while adding the client.', 'alert-danger');
        });
    });

    // Fetches the list of clients from the server and displays them
    function fetchClients() {
        fetch('/clients')
        .then(response => response.json())
        .then(clients => {
            clients.forEach(client => {
                const clientCardHTML = createClientCard(client);
                const clientCardsContainer = document.getElementById('clientCards');
                clientCardsContainer.insertAdjacentHTML('beforeend', clientCardHTML);
            });
        })
        .catch(error => console.error('Error loading clients:', error));
    }

    // Event listener for measurement form submission
    measurementForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const formData = new FormData(measurementForm);
        const data = {};

        formData.forEach((value, key) => {
            data[key] = value;
        });

        fetch(`/clients/${currentClientId}/measurements`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const measurementHTML = createMeasurementListItem(data.measurement);
                const measurementsList = document.getElementById('measurementsList');
                measurementsList.insertAdjacentHTML('beforeend', measurementHTML);
                displayNotification('Measurement added successfully!', 'alert-success');
                measurementForm.reset();
            } else {
                displayNotification('Failed to add measurement.', 'alert-danger');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            displayNotification('An error occurred while adding the measurement.', 'alert-danger');
        });
    });

     // Creates the HTML structure for a client card
    function createClientCard(client) {
        return `
            <div class="col-lg-3 col-md-4 col-sm-6 mb-4" id="client-${client.id}">
                <div class="card shadow">
                    <div class="card-image">
                        <img src="${client.imagePath}" alt="${client.name}" class="card-img-top">
                    </div>
                    <div class="card-body">
                        <h5 class="card-title">${client.name}</h5>
                        <p class="card-text">Age: ${client.age}</p>
                        <p class="card-text">Gender: ${client.gender}</p>
                        <p class="card-text">Fitness Level: ${client.fitnessLevel}</p>
                        <p class="card-text">Fitness Goal: ${client.goal}</p>
                        <div class="btn-container">
                            <button class="btn btn-primary" onclick="viewClient(${client.id})">View</button>
                            <button class="btn btn-danger" onclick="deleteClient(${client.id})">Delete</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // Displays the client details in a modal
    window.viewClient = function(id) {
        currentClientId = id; 
        fetch(`/clients/${id}`)
            .then(response => response.json())
            .then(client => {
                document.getElementById('clientInfo').innerHTML = `
                    <p><strong>Name:</strong> ${client.name}</p>
                    <p><strong>Age:</strong> ${client.age}</p>
                    <p><strong>Gender:</strong> ${client.gender}</p>
                    <p><strong>Fitness Level:</strong> ${client.fitnessLevel}</p>
                    <p><strong>Fitness Goal:</strong> ${client.goal}</p>
                `;
                loadMeasurements(id);
                clientModal.show();
            })
            .catch(error => console.error('Error fetching client details:', error));
    };

    // Loads the measurements for a client
    function loadMeasurements(clientId) {
        fetch(`/clients/${clientId}/measurements`)
            .then(response => response.json())
            .then(measurements => {
                const measurementsList = document.getElementById('measurementsList');
                measurementsList.innerHTML = '';
                measurements.forEach(measurement => {
                    const measurementHTML = createMeasurementListItem(measurement);
                    measurementsList.insertAdjacentHTML('beforeend', measurementHTML);
                });
            })
            .catch(error => console.error('Error fetching measurements:', error));
    }

    // Creates the HTML structure for a measurement list item
    function createMeasurementListItem(measurement) {
        return `
            <li class="list-group-item">
                <p><strong>Date:</strong> ${new Date(measurement.date).toLocaleDateString()}</p>
                <p><strong>Arm:</strong> ${measurement.arm} cm</p>
                <p><strong>Chest:</strong> ${measurement.chest} cm</p>
                <p><strong>Waist:</strong> ${measurement.waist} cm</p>
            </li>
        `;
    }

    // Deletes a client and removes their card from the UI
    window.deleteClient = function(id) {
        if (confirm('Are you sure you want to delete this client?')) {
            fetch(`/clients/${id}`, {
                method: 'DELETE'
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    const element = document.getElementById(`client-${id}`);
                    element.parentNode.removeChild(element);
                    displayNotification('Client deleted successfully!', 'alert-success');
                } else {
                    displayNotification('Failed to delete client.', 'alert-danger');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                displayNotification('An error occurred while deleting the client.', 'alert-danger');
            });
        }
    };

    // Displays a notification message
    function displayNotification(message, type) {
        const notification = document.getElementById('notification');
        notification.className = `alert ${type}`;
        notification.textContent = message;
        notification.style.display = 'block';
        setTimeout(() => notification.style.display = 'none', 4000);
    }
});
