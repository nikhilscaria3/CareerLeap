const express = require('express');
const router = express.Router();
const { Playlist } = require('../models/userModel');

// Define API routes for user registration, login, etc.
router.post('/CreatePlaylist', async (req, res) => {
    try {
        const { category, link1, link2 } = req.body;
        const newUser = new Playlist({
            category,
            link: [{
                link1
            }, {
                link2,
            }]
        });

        // // Save the user to the database
        await newUser.save();

        res.status(201).json({ message: 'Link registered successfully' });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
    }
});


router.get('/getplaylist/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const playlists = await Playlist.find({ category: id });

        // Extract the 'link' array from all the playlists
        const allLinks = playlists.reduce((links, playlist) => {
            return links.concat(playlist.link);
        }, []);

        const categories = playlists.map(playlist => playlist.category);
        res.status(200).json({ links: allLinks, dbcategory: categories[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});


router.get('/getBrotoplaylist', async (req, res) => {
    try {
      const playlists = await Playlist.find({});

      res.status(200).json({dbcategory: playlists });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  });
// Add more API routes as needed for login, user profiles, etc.

module.exports = router;
