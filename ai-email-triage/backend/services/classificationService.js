import axios from 'axios';

// Hugging Face API configuration
const HF_API_URL = 'https://api-inference.huggingface.co/models/facebook/bart-large-mnli';
const HF_API_KEY = process.env.HF_API_KEY || '';

// Category labels for classification
const CATEGORIES = ['Finance', 'Technical', 'Spam', 'Support'];

// Priority keywords for rule-based detection
const PRIORITY_KEYWORDS = {
  high: ['urgent', 'asap', 'immediately', 'critical', 'emergency', 'deadline', 'important'],
  medium: ['soon', 'please', 'request', 'need', 'required', 'update'],
  low: ['fyi', 'information', 'newsletter', 'update', 'notification']
};

// Department mapping based on category
const DEPARTMENT_MAP = {
  Finance: 'Finance Department',
  Technical: 'IT Support',
  Spam: 'Security Team',
  Support: 'Customer Service'
};

/**
 * Classify a single email using Hugging Face API with fallback to rule-based logic
 * @param {string} emailText - The email text to classify
 * @returns {Object} Classification result with category, priority, department, and reply
 */
export const classifyEmail = async (emailText) => {
  try {
    // Try Hugging Face API first
    const result = await classifyWithHuggingFace(emailText);
    return result;
  } catch (error) {
    console.warn('Hugging Face API failed, using fallback:', error.message);
    // Fallback to rule-based classification
    return classifyWithRules(emailText);
  }
};

/**
 * Classify multiple emails in bulk
 * @param {Array} emails - Array of email objects with text
 * @returns {Array} Array of classification results
 */
export const classifyEmailsBulk = async (emails) => {
  const results = [];
  
  for (const email of emails) {
    try {
      const result = await classifyEmail(email.text || email.content || email.body || '');
      results.push({
        ...result,
        originalEmail: email.text || email.content || email.body || '',
        id: email.id || results.length + 1
      });
    } catch (error) {
      results.push({
        category: 'Unknown',
        priority: 'Low',
        department: 'General',
        reply: 'Unable to classify',
        originalEmail: email.text || email.content || email.body || '',
        id: email.id || results.length + 1,
        error: error.message
      });
    }
  }
  
  return results;
};

/**
 * Classify email using Hugging Face API
 * @param {string} text - Email text
 * @returns {Object} Classification result
 */
const classifyWithHuggingFace = async (text) => {
  const headers = {
    'Content-Type': 'application/json'
  };

  // Add API key if available
  if (HF_API_KEY) {
    headers['Authorization'] = `Bearer ${HF_API_KEY}`;
  }

  const response = await axios.post(
    HF_API_URL,
    {
      inputs: text,
      parameters: {
        candidate_labels: CATEGORIES
      }
    },
    { headers, timeout: 10000 }
  );

  // Parse response
  const { labels, scores } = response.data;
  const category = labels[0];
  const confidence = scores[0];

  // Determine priority based on content
  const priority = detectPriority(text);

  // Generate reply
  const reply = generateReply(category, priority);

  return {
    category,
    priority,
    department: DEPARTMENT_MAP[category] || 'General',
    confidence: Math.round(confidence * 100),
    reply
  };
};

/**
 * Rule-based classification fallback
 * @param {string} text - Email text
 * @returns {Object} Classification result
 */
const classifyWithRules = (text) => {
  const lowerText = text.toLowerCase();

  // Rule-based category detection
  let category = 'Support'; // Default category

  // Finance keywords
  if (lowerText.match(/invoice|payment|billing|account|bank|transaction|money|budget|expense|revenue/)) {
    category = 'Finance';
  }
  // Technical keywords
  else if (lowerText.match(/bug|error|server|code|deploy|api|database|system|technical|software|hardware/)) {
    category = 'Technical';
  }
  // Spam keywords
  else if (lowerText.match(/winner|prize|lottery|click here|free|offer|limited time|act now|congratulations/)) {
    category = 'Spam';
  }
  // Support keywords
  else if (lowerText.match(/help|support|issue|problem|question|assistance|request|ticket/)) {
    category = 'Support';
  }

  // Detect priority
  const priority = detectPriority(text);

  // Generate reply
  const reply = generateReply(category, priority);

  return {
    category,
    priority,
    department: DEPARTMENT_MAP[category] || 'General',
    confidence: 85, // Default confidence for rule-based
    reply
  };
};

/**
 * Detect email priority based on keywords
 * @param {string} text - Email text
 * @returns {string} Priority level (High, Medium, Low)
 */
const detectPriority = (text) => {
  const lowerText = text.toLowerCase();

  // Check for high priority keywords
  if (PRIORITY_KEYWORDS.high.some(keyword => lowerText.includes(keyword))) {
    return 'High';
  }

  // Check for medium priority keywords
  if (PRIORITY_KEYWORDS.medium.some(keyword => lowerText.includes(keyword))) {
    return 'Medium';
  }

  // Default to low priority
  return 'Low';
};

/**
 * Generate a reply based on category and priority
 * @param {string} category - Email category
 * @param {string} priority - Email priority
 * @returns {string} Generated reply
 */
const generateReply = (category, priority) => {
  const replies = {
    Finance: {
      High: 'This financial matter has been flagged as urgent and forwarded to the Finance Department for immediate attention.',
      Medium: 'Your financial inquiry has been received and will be processed within 24-48 hours.',
      Low: 'Thank you for your financial update. We have logged this for our records.'
    },
    Technical: {
      High: 'Our technical team has been alerted about this critical issue and will respond within 1 hour.',
      Medium: 'Your technical request has been assigned to our IT support team. Expected resolution: 24 hours.',
      Low: 'Thank you for the technical information. We have added this to our knowledge base.'
    },
    Spam: {
      High: 'This email has been flagged as potential spam and quarantined for security review.',
      Medium: 'This message has been identified as low-priority and moved to the spam folder.',
      Low: 'This appears to be promotional content and has been filtered accordingly.'
    },
    Support: {
      High: 'Your urgent support request has been escalated to our senior support team. We will contact you shortly.',
      Medium: 'Thank you for contacting support. A representative will assist you within 24 hours.',
      Low: 'Your support ticket has been created and assigned number #' + Math.floor(Math.random() * 10000) + '.'
    }
  };

  return replies[category]?.[priority] || 'Thank you for your email. We will respond shortly.';
};
