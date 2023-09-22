const express = require('express');
const router = express.Router();
const pdfController = require('../controllers/pdfController');
const multer = require('multer');

// Set up Multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage });

// Upload a PDF
router.post('/api/pdf/upload', upload.single('pdf'), pdfController.uploadPdf);

// Get all PDFs
router.get('/api/pdf', pdfController.getAllPdfs);

module.exports = router;
