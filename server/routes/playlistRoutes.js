const express = require('express');
const router = express.Router();
const { createPlaylist, getPlaylistByCategory, getAllPlaylists } = require('../controllers/playlistController');
// Create a new playlist

router.post('/CreatePlaylist', createPlaylist);

// Get all playlists for a specific category
router.get('/getplaylist/:id', getPlaylistByCategory);

// Get all playlists
router.get('/getBrotoplaylist', getAllPlaylists);

// Add more API routes as needed for login, user profiles, etc.

module.exports = router;
