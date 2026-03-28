import axios from 'axios';

// Create axios instance with base URL
const API = axios.create({
  baseURL: 'http://localhost:5000/api',
  timeout: 30000, // 30 second timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging
API.interceptors.request.use(
  (config) => {
    console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('[API] Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
API.interceptors.response.use(
  (response) => {
    console.log(`[API] Response:`, response.data);
    return response;
  },
  (error) => {
    console.error('[API] Response error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

/**
 * Check if backend server is running
 * @returns {Promise<Object>} Health status
 */
export const checkHealth = async () => {
  try {
    const response = await axios.get('http://localhost:5000/health', {
      timeout: 5000 // 5 second timeout for health check
    });
    return { 
      success: true, 
      data: response.data 
    };
  } catch (error) {
    return { 
      success: false, 
      error: error.code === 'ECONNREFUSED' 
        ? 'Backend server is not running. Please start the backend server first.' 
        : error.message || 'Cannot connect to backend server'
    };
  }
};

/**
 * Analyze a single email
 * @param {string} emailText - The email text to analyze
 * @returns {Promise<Object>} Classification result
 */
export const analyzeEmail = async (emailText) => {
  try {
    // First check if backend is available
    const health = await checkHealth();
    if (!health.success) {
      throw new Error(health.error);
    }

    const response = await API.post('/predict', { text: emailText });
    return response.data;
  } catch (error) {
    // Provide more helpful error messages
    if (error.code === 'ECONNREFUSED' || error.message.includes('Backend server is not running')) {
      throw new Error(
        'Cannot connect to backend server. Please make sure the backend is running on port 5000.\n\n' +
        'To start the backend:\n' +
        '1. Open a terminal\n' +
        '2. Navigate to the backend folder: cd ai-email-triage/backend\n' +
        '3. Install dependencies: npm install\n' +
        '4. Start the server: npm start'
      );
    }
    
    if (error.code === 'ERR_NETWORK') {
      throw new Error(
        'Network error. Please check:\n' +
        '1. Backend server is running (http://localhost:5000)\n' +
        '2. No firewall is blocking the connection\n' +
        '3. CORS is properly configured'
      );
    }

    throw new Error(
      error.response?.data?.error || 
      error.message || 
      'Failed to analyze email'
    );
  }
};

/**
 * Upload CSV file for bulk email classification
 * @param {File} file - The CSV file to upload
 * @returns {Promise<Object>} Bulk classification results
 */
export const uploadCSV = async (file) => {
  try {
    // First check if backend is available
    const health = await checkHealth();
    if (!health.success) {
      throw new Error(health.error);
    }

    const formData = new FormData();
    formData.append('file', file);

    const response = await API.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    // Provide more helpful error messages
    if (error.code === 'ECONNREFUSED' || error.message.includes('Backend server is not running')) {
      throw new Error(
        'Cannot connect to backend server. Please make sure the backend is running on port 5000.\n\n' +
        'To start the backend:\n' +
        '1. Open a terminal\n' +
        '2. Navigate to the backend folder: cd ai-email-triage/backend\n' +
        '3. Install dependencies: npm install\n' +
        '4. Start the server: npm start'
      );
    }

    throw new Error(
      error.response?.data?.error || 
      error.message || 
      'Failed to upload CSV file'
    );
  }
};

export default API;
