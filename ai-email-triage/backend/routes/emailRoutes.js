import express from 'express';
import multer from 'multer';
import { predictEmail, uploadCSV } from '../controllers/emailController.js';

const router = express.Router();

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'text/csv' || file.originalname.endsWith('.csv')) {
      cb(null, true);
    } else {
      cb(new Error('Only CSV files are allowed'), false);
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// POST /predict - Classify single email
router.post('/predict', predictEmail);

// POST /upload - Upload CSV and classify multiple emails
router.post('/upload', upload.single('file'), uploadCSV);

export default router;
