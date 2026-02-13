const express = require('express');
const multer = require('multer');
const { parseForm16 } = require('../controllers/Form16Controller');

const router = express.Router();

// Configure multer for PDF file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'), false);
    }
  }
});

// Route: Upload and parse Form 16
router.post('/upload', upload.single('form16'), parseForm16);

module.exports = router;
