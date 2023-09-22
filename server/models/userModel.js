// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  googleId:
  {
    type: String
  },
  name: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  otp: { type: String, default: null },
  status: {
    type: String
  },
  password: {
    type: String,
    default: 'google-auth', // Default value for Google-authenticated users
  },

  score: {
    type: Number
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  userid: {
    type: String
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
  link: [
    {
      link1: {
        type: String,
      },
      channel1: {
        type: String,
      },
    },
    {
      link2: {
        type: String,
      },
      channel2: {
        type: String,
      },
    },
  ],
});


const pdfSchema = new mongoose.Schema({
  title: { type: String, required: true },
  path: { type: String, required: true },
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

const messageSchema = new mongoose.Schema({
  from: {
    type: String
  },
  to: {
    type: String
  },
  message: {
    type: String
  }
})

const GlobalMessageSchema = new mongoose.Schema({
  from: {
    type: String
  },
  to: {
    type: String
  },
  message: {
    type: String
  }
})


const questionSchema = new mongoose.Schema({
  question: String,
  answer: String, // You can add the answer field here if needed
});


const userAnswerSchema = new mongoose.Schema({
  useremail: String,
  useranswers: [String],
  score: Number
});

const userIdSchema = new mongoose.Schema({
  email: String,
  userid: String,
})


const realtimemessageSchema = new mongoose.Schema({
  senderEmail: String,
  recipientEmail: String,
  message: String,
  timestamp: { type: Date, default: Date.now },
});


const progressSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  videoId: { type: String, required: true },
  progress: { type: Number, required: true },
});


const enquirySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const Enquiry = mongoose.model('Enquiry', enquirySchema);


const Progress = mongoose.model('Progress', progressSchema);
const RealTimeMessage = mongoose.model('RealTimeMessage', realtimemessageSchema);
const UserId = mongoose.model("usersid", userIdSchema)
const fumigationanswers = mongoose.model('useranswers', userAnswerSchema);
const Question = mongoose.model('Question', questionSchema);
const Timer = mongoose.model('Timer', timerSchema);
const TaskInfo = mongoose.model('taskinfo', TaskInfoSchema);
const CourseData = mongoose.model('Course', courseSchema);
const Playlist = mongoose.model('playlist', PlaylistSchema);
const User = mongoose.model('User', userSchema);
const Admin = mongoose.model('Admin', adminSchema);
// Create a Mongoose model using the schema
const Manifest = mongoose.model('Manifest', manifestSchema);
const Message = mongoose.model('Message', messageSchema);
const GlobalMessage = mongoose.model('globalmessage', GlobalMessageSchema);

const Pdf = mongoose.model('Pdf', pdfSchema);


module.exports = { User, Enquiry,Progress, RealTimeMessage, UserId, fumigationanswers, Question, GlobalMessage, Pdf, Message, Timer, Playlist, Manifest, TaskInfo, Admin, CourseData };
