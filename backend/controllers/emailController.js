import { classifyEmail, classifyEmailsBulk } from '../services/classificationService.js';
import { parseCSV } from '../utils/csvParser.js';

/**
 * POST /api/predict - Classify a single email
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const predictEmail = async (req, res) => {
  try {
    const { text } = req.body;

    // Validate input
    if (!text || text.trim() === '') {
      return res.status(400).json({
        success: false,
        error: 'Email text is required'
      });
    }

    // Classify the email
    const result = await classifyEmail(text);

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Error in predictEmail:', error.message);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to classify email'
    });
  }
};

/**
 * POST /api/upload - Upload CSV and classify multiple emails
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const uploadCSV = async (req, res) => {
  try {
    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No CSV file uploaded'
      });
    }

    // Parse CSV file
    const csvContent = req.file.buffer.toString('utf-8');
    const emails = parseCSV(csvContent);

    if (emails.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'No valid emails found in CSV'
      });
    }

    // Classify all emails
    const results = await classifyEmailsBulk(emails);

    res.json({
      success: true,
      data: {
        total: results.length,
        results
      }
    });
  } catch (error) {
    console.error('Error in uploadCSV:', error.message);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to process CSV file'
    });
  }
};
