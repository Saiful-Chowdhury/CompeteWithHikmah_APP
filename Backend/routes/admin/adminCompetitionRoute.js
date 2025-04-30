const express = require('express');
const router = express.Router();
const { getAllCompetitions } = require('../../controllers/admin/competitions');

// Public routes
router.get('/', getAllCompetitions);

// Admin routes
router.post('/add',  require('../../controllers/admin/competitions').addCompetition);

module.exports = router;