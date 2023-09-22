import React, { useEffect, useState } from 'react';
import axios from 'axios';
import YouTube from 'react-youtube';
import '../styles/brotoplaylist.css';
import { useLocation, useNavigate } from 'react-router-dom';

const YouTubeBrotoPlaylist = ({ apiKey }) => {
  const [playlistItems, setPlaylistItems] = useState([]);
  const [playlistId, setPlaylistId] = useState(null);
  const [dbcategory, setDbCategory] = useState([]);
  const navigate = useNavigate()

  useEffect(() => {
    // Check for authentication
    const isAuthenticated = !!localStorage.getItem("jwtLoginToken");
    if (!isAuthenticated) {
      // If not authenticated, redirect to the login page
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    const fetchPlaylistItems = async (playlistId) => {
      try {
        const response = await axios.get(`https://www.googleapis.com/youtube/v3/playlistItems`, {
          params: {
            key: apiKey,
            playlistId: playlistId,
            part: 'snippet',
            maxResults: 50,
          },
        });

        const data = response.data;
        if (data.items) {
          setPlaylistItems(data.items);
          setPlaylistId(playlistId);
        } else {
          console.error('No playlist items found for playlistId:', playlistId);
        }
      } catch (error) {
        console.error('Error fetching playlist items:', error);
      }
    };

    if (playlistId) {
      fetchPlaylistItems(playlistId);
    }
  }, [apiKey, playlistId]);

  useEffect(() => {
    const fetchPlaylist = async () => {
      try {
        const response = await axios.get('http://localhost:5000/getBrotoplaylist');
        const data = response.data;

        if (Array.isArray(data.dbcategory)) {
          setDbCategory(data.dbcategory);
        } else {
          console.error('API response does not contain valid category data:', data.dbcategory);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchPlaylist();
  }, []);

  // Define the handleCategoryClick function
  const handleCategoryClick = async (category) => {
    try {
      const playlist = dbcategory.find((item) => item.category === category);

      if (playlist && playlist.link.length > 0) {
        const linkItem = playlist.link[0];
        const playlistId = linkItem.link1 || linkItem.link2;

        // Set the playlistId to trigger the useEffect to fetch the playlist items
        setPlaylistId(playlistId);
      } else {
        console.error('Playlist with category not found:', category);
      }
    } catch (error) {
      console.error('Error fetching playlist items:', error);
    }
  };

  return (
    <div className="playlistsection">
      <div className="playlistnavbrand">
        <h1 className='brotoplaylistname'>BROTOTYPE COURSES</h1>

      </div>
      <div className='playlistnav'>
        {dbcategory.length > 0 ? (
          <div className='playlistnav' >
            {dbcategory.map((category, index) => (
              <div key={index}>
                {category.link.length > 0 ? (
                  <div className='brotocoursecategory'>
                    <ul>
                      {category.category.startsWith("BROTOTYPE") && (
                        category.link.map((linkItem, linkIndex) => (
                          <button className="playlist-button" key={linkIndex} onClick={() => handleCategoryClick(category.category)}>
                            {category.category}
                          </button>
                        ))
                      )}
                    </ul>
                  </div>
                ) : (
                  <p>No links available for this category.</p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </div>

      <div className="playlist-container">
        {playlistItems.map((item) => (
          <div className="video-container" key={item.id}>
            <h2 className="video-title">{item.snippet.title}</h2>
            <div className="video-player-container">
              <YouTube className="video-player" videoId={item.snippet.resourceId.videoId} opts={{ width: '640', height: '360' }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default YouTubeBrotoPlaylist;
