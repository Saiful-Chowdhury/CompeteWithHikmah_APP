const express = require('express');
const cors = require('cors');
const logger=require('./config/logger');
const connectToDatabase = require('./config/db');
require('dotenv').config();
const path = require('path');
// Validate environment variables
if (!process.env.MONGODB_URI || !process.env.PORT || !process.env.JWT_SECRET) {
    logger.error('Missing required environment variables.');
    process.exit(1); // Exit with failure
  }

// Intialize the app
const app = express();

// Middleware

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Serve static files (CSS, JS, images, etc.)
app.use(express.static(path.join(__dirname, 'public')));

// Set EJS as the view engine
app.set('view engine', 'ejs');

// Set the views directory (where your EJS files are stored)
app.set('views', path.join(__dirname, 'views'));
// Routes Admin

// const adminblogRoutes = require('./routes/admin/adminblogRoutes');
// const adminCourseRoute = require('./routes/admin/adminCourseRoute');
const adminCompetitionRoute = require('./routes/admin/adminCompetitionRoute');
// const authRoutes = require('./routes/admin/authRoutes');

// // Routes User
// const courseRoutes = require('./routes/user/courseRoutes');
// const newsRoutes = require('./routes/user/newsRoutes');
// const blogRoutes = require('./routes/user/blogRoutes');


// // Routes API
// app.use('/api/admin/blogs', adminblogRoutes)
// app.use('/api/admin/courses', adminCourseRoute);
app.use('/api/admin/competition', adminCompetitionRoute);
// app.use('/api/admin/auth', authRoutes);

// // Routes API User
// app.use('api/user/blogs', blogRoutes);
// app.use('api/user/courses', courseRoutes);
// app.use('api/user/news', newsRoutes);


// Start Server
const PORT =process.env.PORT || 5000;
const server = app.listen(PORT, async () => {
    logger.info(`Server running on port  http://localhost:${PORT}`);
    await connectToDatabase(); // Connect to the database

});
  
// // Grace Shutdown

// const shutdown = async () => {
//     logger.info('Shutting down server...');
//     await server.close(); // Close the server
//     await mongoose.connection.close(); // Close the database connection
//     logger.info('Server shut down gracefully.');
//     process.exit(0); // Exit with success
// }
  
// process.on('SIGINT', shutdown); // Handle Ctrl+C
// process.on('SIGTERM', shutdown); // Handle termination signal


