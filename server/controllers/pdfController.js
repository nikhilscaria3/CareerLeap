const { Pdf } = require('../models/userModel');

// Upload a PDF
exports.uploadPdf = async (req, res) => {
  try {
    const { title } = req.body;
    const path = req.file.path;
    const pdf = new Pdf({ title, path });
    await pdf.save();
    res.json({ message: 'PDF uploaded successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Get all PDFs
exports.getAllPdfs = async (req, res) => {
  try {
    const pdfs = await Pdf.find();
    res.json(pdfs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};
