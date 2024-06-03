# Client Management App

## Description
The aim of this web application is to provide a tool that allows fitness professionals to track their clients' progress. Attributes like name, age, gender, etc., will be stored as well as fitness-related attributes like weight, circumference measurements, and fitness level. The main functionalities include:
1. Create a new client profile.
2. Delete an existing client profile.
3. Update an existing client profile.

## Project Setup Instructions

### Prerequisites
Make sure you have the following installed on your machine:
- [Node.js](https://nodejs.org/)
- npm (Node package manager, which comes with Node.js)
- [SQLite](https://www.sqlite.org/)
- A web browser (e.g., Chrome, Firefox)


### Step-by-Step Guide
1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd client-management-app
   ```

2. **Install dependencies:**
   Navigate to the project directory and install the required npm packages.
   ```bash
   npm install express body-parser multer sqlite3
   ```

3. **Create `uploads` Directory:**
   Create an `uploads` directory in the `public` folder for file uploads.
   ```bash
   mkdir -p public/uploads
   ```

4. **Database Setup:**
   Ensure that you have SQLite installed. The database will be automatically created and initialized when you start the application.

5. **Run the Application:**
   Start the server by running:
   ```bash
   npm start
   ```

6. **Open the Application:**
   Open your web browser and go to `http://localhost:3000` to view the application.

### Project Structure
- **public/**: Contains static files such as HTML, CSS, JavaScript, and images.
- **server.js**: The main server file that sets up the Express server and routes.
- **database.js**: Handles all database operations including client and measurement management.
- **package.json**: Lists dependencies and scripts.

### API Endpoints

#### Clients
- **GET /clients**: Fetch all clients.
- **POST /clients**: Add a new client.
  - Body parameters:
    - `name` (string): Client's name.
    - `age` (number): Client's age.
    - `gender` (string): Client's gender.
    - `fitnessLevel` (string): Client's fitness level.
    - `goal` (string): Client's fitness goal.
    - `clientImage` (file): Client's image (optional).
- **GET /clients/:id**: Fetch a client by ID.
- **DELETE /clients/:id**: Delete a client by ID.

#### Measurements
- **POST /clients/:id/measurements**: Add measurements for a client.
  - Body parameters:
    - `arm` (number): Arm circumference.
    - `chest` (number): Chest circumference.
    - `waist` (number): Waist circumference.
- **GET /clients/:id/measurements**: Fetch all measurements for a client.


### Author
Johannes la Cock
- Email: [johannes-bernardus.la-cock@iu-study.org](mailto:johannes-bernardus.la-cock@iu-study.org)

Feel free to reach out if you have any questions or need further assistance.
