import axios from 'axios';

// Hugging Face API configuration (fallback)
const HF_API_URL = 'https://api-inference.huggingface.co/models/MoritzLaurer/DeBERTa-v3-base-mnli-fever-anli';

// Category labels for classification
const CATEGORIES = ['Finance', 'Technical', 'Spam', 'Support', 'Promotional / Marketing'];

// Priority keywords for rule-based detection
const PRIORITY_KEYWORDS = {
  high: ['urgent', 'asap', 'immediately', 'critical', 'emergency', 'deadline', 'important'],
  medium: ['soon', 'please', 'request', 'need', 'required', 'update'],
  low: ['fyi', 'information', 'newsletter', 'update', 'notification']
};

// Category keywords for explanation
const CATEGORY_KEYWORDS = {
  Finance: ['invoice', 'payment', 'billing', 'account', 'bank', 'transaction', 'money', 'budget', 'expense', 'revenue', 'financial', 'cost', 'price', 'purchase', 'order'],
  Technical: ['bug', 'error', 'server', 'code', 'deploy', 'api', 'database', 'system', 'technical', 'software', 'hardware', 'login', 'password', 'backup', 'deployment'],
  Spam: ['winner', 'prize', 'lottery', 'click here', 'limited time', 'act now', 'congratulations', 'claim', 'reward', 'fraud', 'phishing', 'suspicious', 'scam', 'hack', 'virus', 'malware'],
  Support: ['help', 'support', 'issue', 'problem', 'question', 'assistance', 'request', 'ticket', 'reset', 'contact', 'trouble'],
  'Promotional / Marketing': ['offer', 'free', 'partner', 'join', 'signup', 'promotion', 'discount', 'deal', 'sale', 'event', 'collaboration', 'participation', 'merchandise', 'exclusive', 'limited offer', 'special', 'campaign', 'marketing', 'advertisement', 'sponsor', 'affiliate']
};

// Department mapping based on category
const DEPARTMENT_MAP = {
  Finance: 'Finance Department',
  Technical: 'IT Support',
  Spam: 'Security Team',
  Support: 'Customer Service',
  'Promotional / Marketing': 'Marketing Department'
};

/**
 * Classify a single email using Gemini API with fallback to Hugging Face and rule-based logic
 * @param {string} emailText - The email text to classify
 * @returns {Object} Classification result with category, priority, department, explanation, reply, and model_used
 */
export const classifyEmail = async (emailText) => {
  try {
    // Try Groq API first
    const result = await classifyWithGroq(emailText);
    // Apply validation layer to force promotional classification if needed
    return validatePromotionalClassification(emailText, result);
  } catch (groqError) {
    console.warn('Groq API failed, trying Hugging Face:', groqError.message);
    try {
      // Fallback to Hugging Face API
      const result = await classifyWithHuggingFace(emailText);
      // Apply validation layer to force promotional classification if needed
      return validatePromotionalClassification(emailText, result);
    } catch (hfError) {
      console.warn('Hugging Face API failed, using rule-based fallback:', hfError.message);
      // Fallback to rule-based classification
      const result = classifyWithRules(emailText);
      // Apply validation layer to force promotional classification if needed
      return validatePromotionalClassification(emailText, result);
    }
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
        explanation: 'Unable to classify this email due to an error.',
        reply: 'Unable to classify',
        originalEmail: email.text || email.content || email.body || '',
        id: email.id || results.length + 1,
        model_used: 'Error',
        error: error.message
      });
    }
  }
  
  return results;
};

/**
 * Classify email using Groq API
 * @param {string} text - Email text
 * @returns {Object} Classification result
 */
const classifyWithGroq = async (text) => {
  const GROQ_API_KEY = process.env.GROQ_API_KEY || '';
  
  if (!GROQ_API_KEY) {
    throw new Error('Groq API key not configured');
  }
  
  // Validate API key format (Groq keys start with 'gsk_')
  if (!GROQ_API_KEY.startsWith('gsk_')) {
    console.warn('Warning: Groq API key may be invalid. Expected format: gsk_...');
  }
  
  // Log API key status (first 10 chars only for security)
  console.log(`Using Groq API key: ${GROQ_API_KEY.substring(0, 10)}...`);

  const prompt = `You are a highly accurate enterprise AI email classification system.

Classify emails based on intent and context.

Categories:
- Technical Support
- Finance
- HR
- Spam
- Promotional / Marketing
- General

Rules:
- If email promotes a service, course, event, or offer → Promotional / Marketing
- If login/bug issues → Technical Support
- If money/invoice → Finance
- If job/hiring → HR
- If fraud/suspicious → Spam
- Else → General

Return ONLY JSON:

{
  "category": "",
  "priority": "",
  "confidence": "",
  "department": "",
  "explanation": ""
}

Email: ${text}`;

  try {
    const response = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: 'llama3-8b-8192',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.1,
        max_tokens: 1024
      },
      {
        headers: {
          'Authorization': `Bearer ${GROQ_API_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: 30000
      }
    );

    const responseText = response.data.choices[0].message.content;

    // Extract JSON from response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Invalid JSON response from Groq');
    }

    const parsed = JSON.parse(jsonMatch[0]);

    // Validate required fields
    if (!parsed.category || !parsed.priority || !parsed.confidence || !parsed.department || !parsed.explanation) {
      throw new Error('Missing required fields in Groq response');
    }

    // Generate reply based on category and priority
    const reply = generateReply(parsed.category, parsed.priority);

    return {
      category: parsed.category,
      priority: parsed.priority,
      department: parsed.department,
      confidence: parseInt(parsed.confidence, 10) || 85,
      explanation: parsed.explanation,
      reply,
      model_used: 'Groq (llama3-8b-8192)'
    };
  } catch (error) {
    // Log detailed error information for debugging
    if (error.response) {
      console.error('Groq API Error Response:', {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data
      });
      
      // Provide specific guidance for 400 errors
      if (error.response.status === 400) {
        console.error('');
        console.error('=== GROQ API 400 ERROR - TROUBLESHOOTING ===');
        console.error('This error usually means your API key is invalid or expired.');
        console.error('');
        console.error('To fix this:');
        console.error('1. Go to https://console.groq.com/keys');
        console.error('2. Generate a new API key');
        console.error('3. Update the GROQ_API_KEY in ai-email-triage/backend/.env');
        console.error('4. Restart your backend server');
        console.error('');
        console.error('Current API key starts with:', GROQ_API_KEY.substring(0, 10) + '...');
        console.error('==========================================');
        console.error('');
      }
    } else if (error.request) {
      console.error('Groq API No Response:', error.message);
    } else {
      console.error('Groq API Error:', error.message);
    }
    throw error;
  }
};

/**
 * Classify email using Hugging Face API
 * @param {string} text - Email text
 * @returns {Object} Classification result
 */
const classifyWithHuggingFace = async (text) => {
  const HF_API_KEY = process.env.HF_API_KEY || '';
  
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

  // Generate explanation
  const explanation = generateExplanation(text, category, priority);

  // Generate reply
  const reply = generateReply(category, priority);

  return {
    category,
    priority,
    department: DEPARTMENT_MAP[category] || 'General',
    confidence: Math.round(confidence * 100),
    explanation,
    reply,
    model_used: 'Hugging Face'
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
  let matchedKeywords = [];

  // Finance keywords
  const financeMatches = CATEGORY_KEYWORDS.Finance.filter(keyword => lowerText.includes(keyword));
  if (financeMatches.length > 0) {
    category = 'Finance';
    matchedKeywords = financeMatches;
  }
  
  // Technical keywords
  const technicalMatches = CATEGORY_KEYWORDS.Technical.filter(keyword => lowerText.includes(keyword));
  if (technicalMatches.length > 0 && technicalMatches.length >= financeMatches.length) {
    category = 'Technical';
    matchedKeywords = technicalMatches;
  }
  
  // Promotional / Marketing keywords (check before Spam to prioritize promotional content)
  const promotionalMatches = CATEGORY_KEYWORDS['Promotional / Marketing'].filter(keyword => lowerText.includes(keyword));
  if (promotionalMatches.length > 0 && promotionalMatches.length >= financeMatches.length && promotionalMatches.length >= technicalMatches.length) {
    category = 'Promotional / Marketing';
    matchedKeywords = promotionalMatches;
  }
  
  // Spam keywords (only if no promotional content detected)
  const spamMatches = CATEGORY_KEYWORDS.Spam.filter(keyword => lowerText.includes(keyword));
  if (spamMatches.length > 0 && category !== 'Promotional / Marketing' && spamMatches.length >= financeMatches.length && spamMatches.length >= technicalMatches.length) {
    category = 'Spam';
    matchedKeywords = spamMatches;
  }
  
  // Support keywords
  const supportMatches = CATEGORY_KEYWORDS.Support.filter(keyword => lowerText.includes(keyword));
  if (supportMatches.length > 0 && category === 'Support') {
    matchedKeywords = supportMatches;
  }

  // Detect priority
  const priority = detectPriority(text);

  // Generate explanation
  const explanation = generateExplanation(text, category, priority, matchedKeywords);

  // Generate reply
  const reply = generateReply(category, priority);

  return {
    category,
    priority,
    department: DEPARTMENT_MAP[category] || 'General',
    confidence: 85, // Default confidence for rule-based
    explanation,
    reply,
    model_used: 'Rule-based'
  };
};

/**
 * Validate and force promotional classification if promotional keywords are detected
 * @param {string} text - Email text
 * @param {Object} classification - Current classification result
 * @returns {Object} Validated classification result
 */
const validatePromotionalClassification = (text, classification) => {
  const lowerText = text.toLowerCase();
  
  // Promotional keywords that should force "Promotional / Marketing" category
  const promotionalKeywords = [
    'offer', 'free', 'partner', 'join', 'signup', 'sign up', 'promotion',
    'discount', 'deal', 'sale', 'event', 'collaboration', 'participation',
    'merchandise', 'exclusive', 'limited offer', 'special', 'campaign',
    'marketing', 'advertisement', 'sponsor', 'affiliate', 'collaborate',
    'participate', 'register', 'enroll', 'subscribe', 'membership'
  ];
  
  // Check if email contains promotional keywords
  const hasPromotionalContent = promotionalKeywords.some(keyword => 
    lowerText.includes(keyword)
  );
  
  // If promotional content is detected and category is not already "Promotional / Marketing"
  if (hasPromotionalContent && classification.category !== 'Promotional / Marketing') {
    // Force category to "Promotional / Marketing"
    classification.category = 'Promotional / Marketing';
    classification.department = DEPARTMENT_MAP['Promotional / Marketing'];
    classification.confidence = 90; // High confidence for forced classification
    
    // Update explanation
    const matchedKeywords = promotionalKeywords.filter(keyword => lowerText.includes(keyword));
    const keywordList = matchedKeywords.slice(0, 3).map(k => `"${k}"`).join(', ');
    classification.explanation = `This email is classified as "Promotional / Marketing" because it contains promotional keywords like ${keywordList}. The priority is set to "${classification.priority}" based on the overall tone and context. This email has been routed to the Marketing Department for handling.`;
    
    // Update reply
    classification.reply = generateReply('Promotional / Marketing', classification.priority);
  }
  
  return classification;
};

/**
 * Detect email priority based on keywords
 * @param {string} text - Email text
 * @returns {string} Priority level (High, Medium, Low)
 */
const detectPriority = (text) => {
  const lowerText = text.toLowerCase();

  // Check for high priority keywords
  const highMatches = PRIORITY_KEYWORDS.high.filter(keyword => lowerText.includes(keyword));
  if (highMatches.length > 0) {
    return 'High';
  }

  // Check for medium priority keywords
  const mediumMatches = PRIORITY_KEYWORDS.medium.filter(keyword => lowerText.includes(keyword));
  if (mediumMatches.length > 0) {
    return 'Medium';
  }

  // Default to low priority
  return 'Low';
};

/**
 * Generate explanation for classification
 * @param {string} text - Email text
 * @param {string} category - Detected category
 * @param {string} priority - Detected priority
 * @param {Array} matchedKeywords - Optional matched keywords for rule-based
 * @returns {string} Explanation text
 */
const generateExplanation = (text, category, priority, matchedKeywords = []) => {
  const lowerText = text.toLowerCase();
  
  // Find matched keywords for category
  const categoryKeywords = CATEGORY_KEYWORDS[category] || [];
  const foundCategoryKeywords = matchedKeywords.length > 0 
    ? matchedKeywords 
    : categoryKeywords.filter(keyword => lowerText.includes(keyword));
  
  // Find matched keywords for priority
  const priorityKeywords = PRIORITY_KEYWORDS[priority.toLowerCase()] || [];
  const foundPriorityKeywords = priorityKeywords.filter(keyword => lowerText.includes(keyword));

  // Build explanation
  let explanation = `This email is classified as "${category}" `;
  
  if (foundCategoryKeywords.length > 0) {
    const keywordList = foundCategoryKeywords.slice(0, 3).map(k => `"${k}"`).join(', ');
    explanation += `because it contains keywords like ${keywordList}`;
  } else {
    explanation += `based on the content analysis`;
  }

  explanation += `. The priority is set to "${priority}" `;
  
  if (foundPriorityKeywords.length > 0) {
    const priorityKeywordList = foundPriorityKeywords.slice(0, 2).map(k => `"${k}"`).join(' and ');
    explanation += `due to the presence of ${priorityKeywordList}`;
  } else {
    explanation += `based on the overall tone and context`;
  }

  explanation += `. This email has been routed to the ${DEPARTMENT_MAP[category] || 'General'} department for handling.`;

  return explanation;
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
      Low: 'This appears to be suspicious content and has been filtered accordingly.'
    },
    Support: {
      High: 'Your urgent support request has been escalated to our senior support team. We will contact you shortly.',
      Medium: 'Thank you for contacting support. A representative will assist you within 24 hours.',
      Low: 'Your support ticket has been created and assigned number #' + Math.floor(Math.random() * 10000) + '.'
    },
    'Promotional / Marketing': {
      High: 'Your promotional offer has been received and forwarded to our Marketing Department for immediate review.',
      Medium: 'Thank you for your marketing proposal. Our team will review it within 48 hours.',
      Low: 'We have received your promotional content and it has been logged for our marketing team.'
    }
  };

  return replies[category]?.[priority] || 'Thank you for your email. We will respond shortly.';
};
