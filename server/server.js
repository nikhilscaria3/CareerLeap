const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoutes'); // Import the userRoutes file
const LoginRoute = require('./routes/loginRoutes')
const ProfileRoute = require('./routes/ProfileRoutes')
const CreatePlaylistRoute = require('./routes/createPlaylist')
const CourseAddRoute = require('./routes/courseData');
const taskRoute = require('./routes/weektaskRoute');
const timerRouter = require('./routes/timerRoute')
const adminUserupdate = require('./routes/adminUserUpdate')
const adminmanifest = require('./routes/manifestData')

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use('/uploads', express.static('uploads'));

app.use(cors({ origin: 'http://localhost:3000' }));

const dbURI = 'mongodb://127.0.0.1:27017/ReduxApp';

mongoose.connect(dbURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on('connected', () => {
  console.log('Connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('Error connecting to MongoDB:', err);
});

app.use('/', userRoutes); // Use the userRoutes middleware
app.use('/', LoginRoute); // Use the userRoutes middleware
app.use('/', ProfileRoute)
app.use('/', CourseAddRoute)
app.use('/', CreatePlaylistRoute)
app.use('/', taskRoute)
app.use('/', timerRouter)
app.use('/', adminUserupdate)
app.use('/', adminmanifest)
// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
