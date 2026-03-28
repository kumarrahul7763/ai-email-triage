/**
 * Parse CSV content and extract emails
 * @param {string} csvContent - Raw CSV content
 * @returns {Array} Array of email objects
 */
export const parseCSV = (csvContent) => {
  const lines = csvContent.split('\n').filter(line => line.trim());
  
  if (lines.length === 0) {
    return [];
  }

  // Get headers from first line
  const headers = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/"/g, ''));
  
  // Find the email text column (could be 'text', 'email', 'content', 'body', 'message')
  const textColumnIndex = headers.findIndex(h => 
    ['text', 'email', 'content', 'body', 'message'].includes(h)
  );

  // If no standard column found, use the first column
  const emailColumnIndex = textColumnIndex !== -1 ? textColumnIndex : 0;

  const emails = [];

  // Parse each line (skip header)
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // Handle CSV with quotes and commas
    const values = parseCSVLine(line);
    
    if (values.length > emailColumnIndex) {
      const emailText = values[emailColumnIndex].replace(/^"|"$/g, '').trim();
      
      if (emailText) {
        emails.push({
          id: i,
          text: emailText,
          // Include other columns if they exist
          ...headers.reduce((acc, header, index) => {
            if (index !== emailColumnIndex && values[index]) {
              acc[header] = values[index].replace(/^"|"$/g, '').trim();
            }
            return acc;
          }, {})
        });
      }
    }
  }

  return emails;
};

/**
 * Parse a single CSV line handling quotes and commas
 * @param {string} line - CSV line
 * @returns {Array} Array of values
 */
const parseCSVLine = (line) => {
  const values = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      values.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }

  // Add the last value
  values.push(current.trim());

  return values;
};

/**
 * Generate sample CSV content for testing
 * @returns {string} Sample CSV content
 */
export const generateSampleCSV = () => {
  return `id,text,subject
1,"Urgent: Please review the attached invoice for Q4 2024. Payment is due immediately.","Invoice Review"
2,"Bug report: The login page throws a 500 error when users try to authenticate.","Login Bug"
3,"Congratulations! You've won a $1000 gift card. Click here to claim now!","You Won!"
4,"Can you help me reset my password? I've been locked out of my account.","Password Reset"
5,"The server deployment is scheduled for tomorrow. Please ensure all tests pass.","Deployment Notice"
6,"Monthly newsletter: Tips for improving your productivity this month.","Newsletter"
7,"Critical: Database backup failed last night. Need immediate attention.","Database Issue"
8,"Thank you for your purchase. Your order #12345 has been shipped.","Order Confirmation"
9,"Please review the budget proposal for the new project by end of week.","Budget Review"
10,"FYI: Team meeting rescheduled to Friday at 3 PM.","Meeting Update"`;
};
