// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  week: {
    type: String
  },
  profileImage: {
    filepath: { type: String },
    filename: { type: String }
  },
});

const adminSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  profileImage: {
    type: String,
  },
});


const courseSchema = new mongoose.Schema({
  name: {
    type: String
  },
  description: {
    type: String
  }
  ,
  price: {
    type: Number
  },
  playlistapi: {
    type: String
  }
})


const manifestSchema = new mongoose.Schema({
  week: {
    type: String
  },
  email: {
    type: String
  },
  developername: {
    type: String,
    required: true
  },
  advisorname: {
    type: String,
    required: true
  },
  reviewername: {
    type: String,
    required: true
  },
  color: {
    type: String,
    required: true
  },
  nextweektask: {
    type: String,
    required: true
  },
  improvementupdate: {
    type: String,
    required: true
  },
  code: {
    type: Number,
    required: true
  },
  theory: {
    type: Number,
    required: true
  }
});


const PlaylistSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
  },
  link: [{
    link1: {
      type: String,
    },
    link2: {
      type: String,
    },
  }],
});


const TaskInfoSchema = new mongoose.Schema({
  description: {
    type: String
  },
  week: {
    type: String
  }
});


const timerSchema = new mongoose.Schema({
  startTimestamp: {
    type: Date,
    required: true,
  },
  daysRemaining: {
    type: Number,
    required: true,
  },
  // Other fields...
});

const Timer = mongoose.model('Timer', timerSchema);
const TaskInfo = mongoose.model('taskinfo', TaskInfoSchema);
const CourseData = mongoose.model('Course', courseSchema);
const Playlist = mongoose.model('playlist', PlaylistSchema);
const User = mongoose.model('User', userSchema);
const Admin = mongoose.model('Admin', adminSchema);
// Create a Mongoose model using the schema
const Manifest = mongoose.model('Manifest', manifestSchema);



module.exports = { User, Timer, Playlist, Manifest, TaskInfo, Admin, CourseData };
