# 📧 Smart Email Triage System

A full-stack AI-powered email classification system that automatically categorizes emails, detects priority levels, assigns departments, and provides detailed explanations for each classification. Built with React, Node.js, Express, and Hugging Face AI.

![Dashboard Preview](https://img.shields.io/badge/status-active-brightgreen)
![React](https://img.shields.io/badge/React-19-blue)
![Node.js](https://img.shields.io/badge/Node.js-18+-green)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-blue)

## ✨ Features

### 🎯 Core Functionality
- **Single Email Classification** - Paste email text for instant analysis
- **Bulk CSV Upload** - Process multiple emails at once via CSV
- **AI-Powered Classification** - Uses Hugging Face API for accurate categorization
- **Fallback Rule-Based Logic** - Works even when API is unavailable
- **Priority Detection** - Automatically detects High, Medium, Low priority
- **Department Assignment** - Routes emails to appropriate departments
- **Detailed Explanations** - AI explains why each classification was made

### 📊 Dashboard
- Real-time statistics cards with gradient backgrounds
- Category distribution pie chart
- Priority distribution bar chart
- Confidence scores visualization

### 📬 Inbox
- Pre-loaded dummy emails for testing
- Click-to-classify functionality
- Visual category hints with icons
- Read/unread status tracking

### 💬 Feedback System
- 👍 Helpful and 👎 Not Helpful buttons
- Optional comment textarea
- Success message on submission
- Local state storage for feedback

### 🎨 Modern UI
- Clean, responsive design with Tailwind CSS
- Smooth animations and transitions
- Color-coded badges for categories and priorities
- Mobile-friendly layout
- Glassmorphism effects
- Gradient backgrounds
- Hover effects and micro-interactions

## 🏗️ Project Structure

```
ai-email-triage/
├── backend/                 # Node.js + Express backend
│   ├── controllers/        # Request handlers
│   ├── routes/             # API routes
│   ├── services/           # Business logic & AI integration
│   ├── utils/              # Utility functions
│   ├── server.js           # Express server entry point
│   └── package.json        # Backend dependencies
├── src/                    # React frontend
│   ├── components/         # React components
│   │   ├── EmailInput.jsx  # Single email input form
│   │   ├── FileUpload.jsx  # CSV file upload
│   │   ├── ResultsTable.jsx # Results display table
│   │   ├── ExplanationCard.jsx # AI explanation display
│   │   ├── Dashboard.jsx   # Statistics & charts
│   │   ├── Inbox.jsx       # Dummy email inbox
│   │   └── FeedbackForm.jsx # User feedback form
│   ├── services/           # API service
│   │   └── api.js          # Axios API client
│   ├── App.jsx             # Main app component
│   └── index.css           # Tailwind CSS styles
├── package.json            # Frontend dependencies
├── tailwind.config.js      # Tailwind configuration
└── README.md               # This file
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### 1. Clone the Repository
```bash
git clone <repository-url>
cd ai-email-triage
```

### 2. Setup Backend

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file (optional - for Hugging Face API key)
# The system works with fallback logic even without API key
echo "PORT=5000" > .env

# Start backend server
npm start
```

The backend will run on `http://localhost:5000`

### 3. Setup Frontend

```bash
# Navigate back to project root
cd ..

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will run on `http://localhost:5173`

### 4. Access the Application
Open your browser and navigate to `http://localhost:5173`

## 🔧 Configuration

### Environment Variables (Backend)

Create a `.env` file in the `backend/` directory:

```env
PORT=5000
HF_API_KEY=your_huggingface_api_key_here  # Optional
NODE_ENV=development
```

**Note:** The system works perfectly without the Hugging Face API key using built-in rule-based classification.

### Getting Hugging Face API Key (Optional)

1. Visit [Hugging Face](https://huggingface.co/settings/tokens)
2. Create a new token
3. Add it to your `.env` file

## 📡 API Endpoints

### POST `/api/predict`
Classify a single email.

**Request:**
```json
{
  "text": "Urgent: Please review the attached invoice for Q4 2024."
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "category": "Finance",
    "priority": "High",
    "department": "Finance Department",
    "confidence": 95,
    "explanation": "This email is classified as \"Finance\" because it contains keywords like \"invoice\", \"payment\", \"review\". The priority is set to \"High\" due to the presence of \"urgent\". This email has been routed to the Finance Department department for handling.",
    "reply": "This financial matter has been flagged as urgent and forwarded to the Finance Department for immediate attention."
  }
}
```

### POST `/api/upload`
Upload a CSV file for bulk classification.

**Request:** multipart/form-data with CSV file

**Response:**
```json
{
  "success": true,
  "data": {
    "total": 10,
    "results": [...]
  }
}
```

### GET `/health`
Health check endpoint.

**Response:**
```json
{
  "status": "OK",
  "message": "Email Triage API is running"
}
```

## 📋 CSV Format

Your CSV file should have a column for email content:

```csv
id,text,subject
1,"Urgent: Please review the invoice","Invoice Review"
2,"Bug report: Login page error","Login Bug"
```

Supported column names: `text`, `email`, `content`, `body`, `message`

## 🎨 Categories & Priorities

### Categories
- **Finance** - Invoices, payments, billing, transactions
- **Technical** - Bugs, servers, code, deployments
- **Spam** - Promotional content, lottery, scams
- **Support** - Help requests, issues, questions

### Priorities
- **High** - Urgent, ASAP, critical, emergency
- **Medium** - Soon, please, request, need
- **Low** - FYI, newsletter, information

## 🧠 AI Explanation Feature

The system provides detailed explanations for each classification:

### How It Works
1. **Keyword Detection** - Identifies category-specific keywords (e.g., "invoice" for Finance)
2. **Priority Analysis** - Detects urgency indicators (e.g., "urgent", "asap")
3. **Explanation Generation** - Creates human-readable explanation
4. **Confidence Scoring** - Shows how confident the AI is in its classification

### Example Explanation
```
This email is classified as "Finance" because it contains keywords like "invoice", "payment", "review". 
The priority is set to "High" due to the presence of "urgent". 
This email has been routed to the Finance Department department for handling.
```

### Viewing Explanations
- Click the expand button (▼) in the results table
- Explanation card shows:
  - Category badge with color coding
  - Priority level
  - Confidence percentage
  - Detailed explanation text
  - How it works information

## 🛠️ Technologies Used

### Frontend
- React 19
- Tailwind CSS 3
- Recharts (for charts)
- Axios (for API calls)

### Backend
- Node.js
- Express.js
- Multer (file uploads)
- csv-parser (CSV parsing)
- Axios (Hugging Face API)

## 📱 Usage Examples

### Single Email Classification
1. Go to the "Classify" tab
2. Paste email content in the textarea
3. Click "Analyze Email"
4. View results in the table
5. Click expand button to see AI explanation

### Bulk CSV Upload
1. Go to the "Classify" tab
2. Drag & drop or click to upload CSV file
3. Wait for processing
4. View all results in the table
5. Expand each row to see explanations

### Inbox Classification
1. Go to the "Inbox" tab
2. Click on any email
3. System auto-classifies and shows results
4. View explanation for each classification

### Dashboard
1. Go to the "Dashboard" tab
2. View statistics and charts
3. Monitor category and priority distribution

### Feedback
1. Go to the "Feedback" tab
2. Select 👍 Helpful or 👎 Not Helpful
3. Optionally add comments
4. Click "Submit Feedback"
5. See success message

## 🐛 Troubleshooting

### Backend won't start
- Check if port 5000 is available
- Ensure Node.js 18+ is installed
- Run `npm install` in backend directory

### Frontend won't start
- Check if port 5173 is available
- Run `npm install` in project root
- Clear node_modules and reinstall if needed

### API connection errors
- Ensure backend is running on port 5000
- Check CORS settings in backend
- Verify API URL in `src/services/api.js`

### CSV upload fails
- Ensure file is in CSV format
- Check file size (max 5MB)
- Verify CSV has required columns

### Explanations not showing
- Check if backend returns `explanation` field
- Verify ExplanationCard component is imported
- Check browser console for errors

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

Built with ❤️ for hackathons and production use.

---

**Happy Email Triaging! 📧✨**
