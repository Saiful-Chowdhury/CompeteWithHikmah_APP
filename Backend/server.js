const express = require('express');
const cors = require('cors');
const logger = require('./config/logger');
const connectToDatabase = require('./config/db');
require('dotenv').config();

const path = require('path');

// Validate environment variables
if (!process.env.MONGODB_URI || !process.env.JWT_SECRET) {
  logger.error('Missing required environment variables.');
  process.exit(1); // Exit with failure
}

// Initialize the app
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (CSS, JS, images, etc.)
app.use(express.static(path.join(__dirname, 'public')));

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// CORS Configuration: Allow All Origins
app.use(
  cors({
    origin: '*', // Allow all origins
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
    credentials: false, // Disable credentials (cookies, authorization headers)
  })
);

// Routes Admin
app.get('/', (req, res) => {
  res.status(200).send({
    success: true,
    message: 'Server is running',
  });
});

const adminblogRoutes = require('./routes/admin/adminblogRoutes');
const carouselRoutes = require('./routes/admin/caroselRoutes');
const adminCompetitionRoute = require('./routes/admin/adminCompetitionRoute');
const authRoutes = require('./routes/admin/authRoutes');

// Routes API
app.use('/api/admin/blogs', adminblogRoutes);
app.use('/api/admin/carousel', carouselRoutes);
app.use('/api/admin/competition', adminCompetitionRoute);
app.use('/api/admin/auth', authRoutes);

// Start Server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, async () => {
  logger.info(`Server running on port http://localhost:${PORT}`);
  await connectToDatabase(); // Connect to the database
});