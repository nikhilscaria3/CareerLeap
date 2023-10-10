const { Playlist } = require('../models/userModel');

// Create a new playlist
exports.createPlaylist = async (req, res) => {
  try {
    const { category, link1, channel1, link2, channel2 } = req.body;
    
    const newPlaylist = new Playlist({
      category,
      link: [
        {
          link1,
          channel1,
        },
        {
          link2,
          channel2,
        },
      ],
    });
    await newPlaylist.save();

    res.status(201).json({ message: 'Link registered successfully' });
  } catch (err) {
 
    res.status(500).json({ error: err.message });
  }
};

// Get all playlists for a specific category
exports.getPlaylistByCategory = async (req, res) => {
  try {
    const { id } = req.params;
   
    const playlists = await Playlist.find({ category: id });
   
    // Extract the 'link' array from all the playlists
    const allLinks = playlists.reduce((links, playlist) => {
      return links.concat(playlist.link);
    }, []);

    const categories = playlists.map((playlist) => playlist.category);
    res.status(200).json({ links: allLinks, dbcategory: categories[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// Get all playlists
exports.getAllPlaylists = async (req, res) => {
  try {
    const playlists = await Playlist.find({});

    res.status(200).json({ dbcategory: playlists });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
