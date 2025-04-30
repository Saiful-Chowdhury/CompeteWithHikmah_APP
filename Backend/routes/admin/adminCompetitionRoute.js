const express = require('express');
const router = express.Router();
const { getAllCompetitions,addCompetition } = require('../../controllers/admin/competitions');

// Public routes
router.get('/', getAllCompetitions);

// Admin routes
// router.post('/', require('../../controllers/admin/competitions').addCompetition);
router.post('/',addCompetition);

router.put('/:id', require('../../controllers/admin/competitions').updateCompetition);
router.delete('/:id', require('../../controllers/admin/competitions').deleteCompetition);
router.get('/:id', require('../../controllers/admin/competitions').getCompetitionById);


module.exports = router;