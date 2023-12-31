const express = require('express');
const cors = require('cors')
const mongoose = require('mongoose');
const { spawn } = require('child_process');
const bodyParser = require('body-parser');
const app = express();
const path = require('path');
const port = process.env.PORT || 5000;
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const session = require('express-session');
const dotenv = require('dotenv');
dotenv.config({ path: path.join(__dirname, "../server/config/config.env") });


app.use(bodyParser.json());

app.use(cors());

app.use(session({ secret: 'your-secret-key', resave: true, saveUninitialized: true }));
app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname, '../uploads')))



const dbURI = process.env.DB_LOCAL_URI;

mongoose.set('strictQuery', true);


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


const { Message } = require('../server/models/userModel')

const userRoutes = require('./routes/userRoutes'); // Import the userRoutes file
const LoginRoute = require('./routes/loginRoutes')
const ProfileRoute = require('./routes/ProfileRoutes')
const CreatePlaylistRoute = require('./routes/playlistRoutes')
const CourseAddRoute = require('./routes/courseRoutes');
const taskRoute = require('./routes/weektaskRoutes');
const adminUserupdate = require('./routes/adminRoutes')
const adminmanifest = require('./routes/manifestRoutes')
const messageRouter = require('./routes/messageRoute')
const chatbotRoutes = require('./routes/chatgpt');
const pdfRoutes = require('./routes/pdfRoutes');
const questionsRouter = require('./routes/fumigationRoutes');
const userAnswersRouter = require('./routes/questionRoutes');
const RealTimeMessages = require('./routes/realtimemessages');
const progressRoutes = require('./routes/progressRoutes'); // Adjust the path accordingly


app.use('/api/progress', progressRoutes);
app.use('/', questionsRouter);
app.use('/', userAnswersRouter);
app.use('/', userRoutes); // Use the userRoutes middleware
app.use('/', LoginRoute); // Use the userRoutes middleware
app.use('/', ProfileRoute)
app.use('/', CourseAddRoute)
app.use('/', CreatePlaylistRoute)
app.use('/', taskRoute)
app.use('/', adminUserupdate)
app.use('/', adminmanifest)
app.use('/', messageRouter)
app.use('/', chatbotRoutes);
app.use('/', pdfRoutes);
app.use('/', RealTimeMessages)

const { User } = require('./models/userModel');

app.use(passport.initialize());
app.use(passport.session());



// Configure Passport for Google login
passport.use(new GoogleStrategy({
  clientID: '710019880977-d77t8mffj0e0cbsl9q1hja4ntesg9mdi.apps.googleusercontent.com',
  clientSecret: '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',
  callbackURL: `http://localhost:5000/auth/google/callback`,
},
  async (accessToken, refreshToken, profile, done) => {
    // Check if the user already exists in the database
    try {
      // Check if the user already exists in the database
      const existingUser = await User.findOne({ googleId: profile.id });

      if (!existingUser) {
        // If user doesn't exist, create a new user in the database
        const newUser = new User({
          googleId: profile.id,
          email: profile.emails[0].value,
          name: profile.displayName,
        });

        await newUser.save();
        done(null, newUser);
      } else {
        // If user exists, simply return the user object
        done(null, existingUser);
      }
    } catch (error) {
      done(error);
    }
  }));


// Serialize user data
passport.serializeUser((user, done) => {
  done(null, user.id);
});


passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});


// Routes
app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] }));

const PORT = 5000;
const server = app.listen(PORT, console.log(`Server is running on port ${PORT}`));



const io = require("socket.io")(server, {
  cors: {
    origin: "*"
  },
  pingTimeout: 60000
})


app.get('/messages', async (req, res) => {
  try {

    const messages = await Message.find();
    res.json({ data: messages });
  } catch (error) {
    console.error('Error retrieving messages:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

io.on('connection', (socket) => {
  console.log('A user connected');

  // Handle chat messages
  socket.on('chat message', async (message) => {
    try {
      // Save the new message to the database
      const newMessage = new Message({
        content: message.content,
        user: message.user,

      });

      const savedMessage = await newMessage.save();

      // Emit the saved message to all connected clients
      io.emit('chat message', savedMessage);

    } catch (error) {
      console.error('Error saving message:', error);
    }
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

app.post('/execute-python', (req, res) => {
  const pythonCode = req.body.code;

  console.log('Received Python code:', pythonCode);

  // Use spawn for asynchronous execution
  const pythonProcess = spawn('python', ['-c', pythonCode]);

  let stdout = '';
  let stderr = '';

  pythonProcess.stdout.on('data', (data) => {
    stdout += data.toString();
  });

  pythonProcess.stderr.on('data', (data) => {
    stderr += data.toString();
  });

  pythonProcess.on('close', (code) => {
    console.log('Python output:', stdout);
    console.log('Python error output:', stderr);

    if (code !== 0) {
      res.status(500).json({ error: 'Python execution error' });
    } else {
      res.json({ stdout, stderr });
    }
  });
});





if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, '../client/build')));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client/build/index.html'))
  })
}

