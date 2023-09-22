import React, { useEffect, useState } from 'react';
import axios from 'axios';
import YouTube from 'react-youtube';
import '../styles/playlist.css';
import { useLocation } from 'react-router-dom';

const YouTubePlaylist = ({ apiKey }) => {
  const [playlistItems, setPlaylistItems] = useState([]);
  const [playlistapiitems, setplaylistapiitems] = useState([]);
  const [playlistId, setPlaylistId] = useState([]); // Rename the state variable to playlistId
  const [dbcategory, setdbcategory] = useState(null)
  const [channelName, setChannelName] = useState('');


  const location = useLocation();
  const playlistApi = location.state?.apidata;
  const playlistcategory = location.state?.category;

  console.log(playlistcategory);
  console.log(playlistapiitems);

  useEffect(() => {
    const fetchPlaylistItems = async (playlistId) => {
      try {
        let nextPageToken = null;
        let allItems = [];
        setPlaylistId(playlistApi)
        // Fetch playlist items in multiple requests until all videos are retrieved
        do {
          const response = await axios.get(`https://www.googleapis.com/youtube/v3/playlistItems`, {
            params: {
              key: apiKey,
              playlistId: playlistId, // Use the playlistId argument passed to the function
              part: 'snippet',
              maxResults: 50,
              pageToken: nextPageToken,
            }
          });

          allItems = allItems.concat(response.data.items);
          nextPageToken = response.data.nextPageToken;
        } while (nextPageToken);

        setPlaylistItems(allItems);
        const channelName = allItems.length > 0 ? allItems[0].snippet.channelTitle : ''; // Get the channel name from the first video in the playlist
        setChannelName(channelName);
      } catch (error) {
        console.error('Error fetching playlist:', error);
      }
    };

    fetchPlaylistItems(playlistId); // Call the fetchCourses function to initiate the API request
  }, [apiKey, playlistId]); // Add playlistId as a dependency

  useEffect(() => {
    const fetchPlaylist = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/getplaylist/${playlistcategory}`);

        const data = response.data;
        setplaylistapiitems(data); // Update the state with the fetched courses
        setdbcategory(data.dbcategory);
        console.log("datasdbcategory", data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchPlaylist(); // Call the fetchPlaylist function to initiate the API request
  }, []);

  return (
    <div className='playlistsection'>
      <div className='playlistnav'>
        <h1>{playlistcategory}</h1>
      </div>
      <div >
        <div>
          {dbcategory === playlistcategory ? (
            <div className='playlistnav'>
              {playlistapiitems.links ? (
                playlistapiitems.links.map((link, index) => (
                  <button
                    className='playlist-button'
                    key={link._id}
                    onClick={() => setPlaylistId(link.link1 || link.link2)}
                  >
                    Channel {index + 1}: {link.channel} {/* Display the individual channel name */}
                  </button>
                ))
              ) : (
                <p>Loading...</p>
              )}
            </div>
          ) : null}
        </div>
        <div className='channelnamecontainer'>
          <button>Current Channel: {channelName}</button> {/* Display the channel name */}
        </div>

      </div>




      <div className='playlist-container'>
        {playlistItems.map(item => (
          <div className="video-container" key={item.id}>
            <h2 className="video-title">{item.snippet.title}</h2>
            <div className="video-player-container">
              <YouTube
                className="video-player"
                videoId={item.snippet.resourceId.videoId}
                opts={{ width: '640', height: '360' }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default YouTubePlaylist;
