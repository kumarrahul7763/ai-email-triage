import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import emailRoutes from './routes/emailRoutes.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api', emailRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Email Triage API is running' });
});

// Test Groq API key endpoint
app.get('/test-groq', async (req, res) => {
  const GROQ_API_KEY = process.env.GROQ_API_KEY || '';
  
  if (!GROQ_API_KEY) {
    return res.json({ 
      success: false, 
      error: 'GROQ_API_KEY not configured in .env file' 
    });
  }
  
  try {
    const axios = (await import('axios')).default;
    const response = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: 'llama3-8b-8192',
        messages: [{ role: 'user', content: 'Say hello' }],
        max_tokens: 10
      },
      {
        headers: {
          'Authorization': `Bearer ${GROQ_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    res.json({ 
      success: true, 
      message: 'Groq API key is valid!',
      response: response.data.choices[0].message.content
    });
  } catch (error) {
    res.json({ 
      success: false, 
      error: error.response?.data || error.message,
      status: error.response?.status
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal Server Error'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📧 Email Triage API ready`);
});
