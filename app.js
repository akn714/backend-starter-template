// Imports
const express = require('express');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const path = require('path');
const log = require('./logger');
const { COOKIES } = require('./utility/util');

// Load environment variables
dotenv.config();

const app = express();

// Mini apps
const routes = require('./routes/routes');

// Middleware for authentication
const { is_user_authentic } = require('./controllers/controller');

// Middlewares
app.use(express.urlencoded({ extended: true })); // Parse form data
app.use(cookieParser());
app.use(express.static('public')); // Serve static files
app.use(log); // logging method and url of all incomming request
app.set('views', path.join(__dirname, 'views')); // Set views directory

// Routes for mini apps
app.use('/routes', routes);

// Route for unauthorized users
app.get('/unauthorized', (req, res) => {
    // Clear authentication cookies and redirect to login page
    res.clearCookie(COOKIES.LOGIN);
    res.clearCookie(COOKIES.ROLE);
    res.status(401).sendFile(path.join(__dirname, '/views/html/unauthorized.html'));
});

// Home route
app.get('/', (req, res) => {
    try {
        return res.status(200).json({
            message: '# Home Route #'
        })
    } catch (error) {
        console.error('[-] Error in home route:', error.message);
        res.status(500).json({
            error: error.message
        });
    }
});

// Handle 404 errors
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, '/views/html/404.html'));
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`[+] App running on http://localhost:${PORT}`);
});
