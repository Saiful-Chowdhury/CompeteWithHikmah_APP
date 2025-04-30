const Joi = require('joi');
const Competition = require('../../models/CompetitionnewsSchema');

// Schema for validating query parameters
const querySchema = Joi.object({
  type: Joi.string().optional(),
  region: Joi.string().optional(),
  sort: Joi.string().valid('date', 'title').optional(),
});

exports.getAllCompetitions = async (req, res) => {
  try {
    // Validate query parameters
    const { error, value } = querySchema.validate(req.query);
    if (error) {
      return res.status(400).render('partials/error', { message: 'Invalid query parameters.' });
    }

    const { type, region, sort } = value;
    let query = {};

    if (type) query.type = type;
    if (region) query.region = region;

    let sortQuery = {};
    if (sort === 'date') {
      sortQuery.date = -1; // Sort by date descending
    } else if (sort === 'title') {
      sortQuery.title = 1; // Sort by title ascending
    } else {
      sortQuery.date = -1; // Default to sorting by date descending
    }

    const competitions = await Competition.find(query).sort(sortQuery);

    console.log('Competitions:', competitions); // Debugging

    res.status(200).json({ message: 'Competition added successfully', competitions });
    // res.render('pages/competitions', { competitions });
  } catch (err) {
    console.error('Error fetching competitions:', err);
    // res.status(500).render('partials/error', { message: 'An unexpected error occurred. Please try again later.' });
  }
};

exports.addCompetition = async (req, res) => {
    try {
      const { title, date, type, region, institute, description, imageUrl } = req.body;
      const competition = new Competition({ title, date, type, region, institute, description, imageUrl });
      await competition.save();
      res.status(200).json({ message: "News Added Successfully", competition })
  
      // res.redirect('pages/addcompetitions'); // Redirect to the competitions page
    } catch (err) {
      console.error('Error adding competition:', err);
      res.status(500).render('partials/error', { message: 'Failed to add competition. Please try again later.' });
    }
};
exports.updateCompetition = async (req, res) => {
    try {
      const { id } = req.params;
      const { title, date, type, region, institute, description, imageUrl } = req.body;
  
      const competition = await Competition.findByIdAndUpdate(id, { title, date, type, region, institute, description, imageUrl }, { new: true });
  
      if (!competition) {
        return res.status(404).render('partials/error', { message: 'Competition not found.' });
      }
      res.status(200).json({message:"Updated Successfully",competition})
  
      // res.redirect('pages/competitions'); // Redirect to the competitions page
    } catch (err) {
      console.error('Error updating competition:', err);
      res.status(500).render('partials/error', { message: 'Failed to update competition. Please try again later.' });
    }
}
exports.deleteCompetition = async (req, res) => {
    try {
      const { id } = req.params;
  
      const competition = await Competition.findByIdAndDelete(id);
  
      if (!competition) {
        return res.status(404).render('partials/error', { message: 'Competition not found.' });
      }
      res.status(200).json({ message: "Deleted Successfully" })
      
   
      res.redirect('pages/competitions'); // Redirect to the competitions page
    } catch (err) {
      console.error('Error deleting competition:', err);
      res.status(500).render('partials/error', { message: 'Failed to delete competition. Please try again later.' });
    }
};
exports.getCompetitionById = async (req, res) => {
  try {
    const { id } = req.params;
  
    const competition = await Competition.findById(id);
    if (!competition) {
      return res.status(404).render('partials/error', { message: 'Competition not found.' });
    }
    res.status(200).json({competition})
  }
  catch (err) {
    console.error('Error fetching competition:', err);
    res.status(500).render('partials/error', { message: 'Failed to fetch competition. Please try again later.' });
  }
}

