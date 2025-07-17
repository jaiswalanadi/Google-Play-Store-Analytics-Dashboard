# Google Play Store Analytics Dashboard

A comprehensive, interactive analytics dashboard for analyzing Google Play Store apps data, built with React and modern data visualization libraries.

![Dashboard Preview](https://via.placeholder.com/800x400/3b82f6/ffffff?text=Google+Play+Store+Analytics+Dashboard)

## 🚀 Features

### 📊 **Comprehensive Analytics**
- **Overview Dashboard**: Key metrics, insights, and performance indicators
- **Category Analysis**: Market share, performance comparison, and trends by app category
- **Rating Analysis**: Rating distributions, correlations, and performance metrics
- **Sentiment Analysis**: User review sentiment with polarity and subjectivity analysis
- **Trend Analysis**: Market trends and patterns over time

### 🎯 **Interactive Visualizations**
- **Charts**: Bar charts, pie charts, line charts, scatter plots with Recharts
- **Responsive Design**: Mobile-friendly interface with Tailwind CSS
- **Real-time Filtering**: Dynamic filtering by category, rating, type, and content rating
- **Export Functionality**: Generate and download analysis reports

### ⚡ **Performance & UX**
- **Lazy Loading**: Optimized component loading for better performance
- **Error Boundaries**: Robust error handling and recovery
- **Loading States**: Comprehensive loading indicators and skeleton screens
- **Accessibility**: WCAG compliant with keyboard navigation and screen reader support

## 📈 **Data Processing Capabilities**

### **Supported Data Sources**
- Google Play Store Apps dataset (10,000+ apps)
- User Reviews dataset (64,000+ reviews)
- CSV format with automatic parsing and validation

### **Analytics Features**
- Statistical analysis (mean, median, correlations, distributions)
- Data cleaning and preprocessing
- Duplicate detection and removal
- Missing value handling
- Outlier identification

## 🛠️ **Technology Stack**

### **Frontend Framework**
- **React 18.2.0** - Modern React with hooks and concurrent features
- **Vite 4.4.0** - Fast build tool and development server
- **Tailwind CSS 3.3.0** - Utility-first CSS framework

### **Data Visualization**
- **Recharts 2.8.0** - Composable charting library for React
- **D3.js 7.8.0** - Advanced data manipulation and visualization
- **Lucide React** - Beautiful icon library

### **Data Processing**
- **Papa Parse 5.4.1** - Powerful CSV parsing library
- **Lodash 4.17.21** - Utility functions for data manipulation
- **Math.js 11.11.0** - Mathematical calculations and statistics

### **Development Tools**
- **ESLint & Prettier** - Code quality and formatting
- **PostCSS & Autoprefixer** - CSS processing
- **React Router DOM** - Client-side routing

## 🚀 **Quick Start**

### **Prerequisites**
- Node.js 16+ and npm
- Windows OS (optimized for Windows development)
- VS Code (recommended)

### **Installation**

1. **Clone or download the project files**
```bash
# Create project directory
mkdir google-play-store-analytics
cd google-play-store-analytics
```

2. **Run the Windows setup commands**
```cmd
REM Initialize React project with Vite
npm create vite@latest . -- --template react
npm install

REM Install required dependencies
npm install recharts d3 papaparse lodash mathjs lucide-react react-router-dom

REM Install development dependencies
npm install -D tailwindcss postcss autoprefixer eslint prettier

REM Initialize Tailwind CSS
npx tailwindcss init -p
```

3. **Copy your CSV data files**
```cmd
REM Copy CSV files to public/data directory
copy googleplaystore.csv public\data\
copy googleplaystore_user_reviews.csv public\data\
```

4. **Start the development server**
```bash
npm run dev
```

5. **Open your browser**
Navigate to `http://localhost:3000` to view the dashboard.

## 📁 **Project Structure**

```
google-play-store-analytics/
├── public/
│   ├── index.html                 # HTML template
│   └── data/                      # CSV data files
│       ├── googleplaystore.csv
│       └── googleplaystore_user_reviews.csv
├── src/
│   ├── components/
│   │   ├── Dashboard/             # Main dashboard components
│   │   ├── Analytics/             # Analysis components
│   │   ├── Charts/                # Reusable chart components
│   │   ├── Reports/               # Report generation
│   │   └── UI/                    # UI components
│   ├── utils/                     # Utility functions
│   ├── hooks/                     # Custom React hooks
│   ├── styles/                    # Global styles
│   ├── App.jsx                    # Main application component
│   └── main.jsx                   # Application entry point
├── reports/                       # Analysis reports
├── package.json                   # Dependencies and scripts
├── vite.config.js                # Vite configuration
├── tailwind.config.js            # Tailwind configuration
└── README.md                      # Project documentation
```

## 📊 **Dashboard Sections**

### **1. Overview**
- Total apps, categories, and key metrics
- Quick insights and recommendations
- Market leaders and performance indicators
- Interactive navigation to detailed sections

### **2. Category Analysis**
- App distribution by category
- Market share analysis
- Category performance comparison
- Interactive category filtering

### **3. Rating Analysis**
- Rating distribution and statistics
- Top-rated and poorly-rated apps
- Correlation analysis (rating vs installs/reviews)
- Performance benchmarking

### **4. Sentiment Analysis**
- User review sentiment distribution
- Polarity and subjectivity analysis
- Sentiment health scoring
- Actionable recommendations

### **5. Trend Analysis**
- Market trends over time
- Category performance trends
- Predictive insights
- Growth patterns

### **6. Reports**
- Comprehensive analysis reports
- Export functionality
- Key findings summary
- Business recommendations

## 🔧 **Configuration**

### **Data Files**
Place your CSV files in the `public/data/` directory:
- `googleplaystore.csv` - Main apps dataset
- `googleplaystore_user_reviews.csv` - User reviews dataset

### **Environment Variables**
Create a `.env` file for custom configuration:
```env
VITE_APP_TITLE=Google Play Store Analytics
VITE_API_BASE_URL=http://localhost:3000
VITE_ENABLE_ANALYTICS=true
```

### **Customization**
- **Colors**: Modify `src/utils/constants.js` for custom color schemes
- **Charts**: Configure chart defaults in chart components
- **Filters**: Add custom filters in the sidebar component

## 🚀 **Deployment**

### **Build for Production**
```bash
npm run build
```

### **Deploy to Vercel**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### **Deploy to Railway**
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway deploy
```

### **Deploy to Netlify**
```bash
# Build the project
npm run build

# Upload the dist/ folder to Netlify
```

## 📈 **Performance Optimization**

### **Built-in Optimizations**
- **Code Splitting**: Lazy-loaded components for better initial load time
- **Tree Shaking**: Unused code elimination
- **Asset Optimization**: Minified CSS/JS and optimized images
- **Caching**: Browser caching for static assets

### **Data Processing**
- **Efficient Algorithms**: Optimized data processing and statistical calculations
- **Memory Management**: Proper cleanup and garbage collection
- **Chunked Processing**: Large datasets processed in chunks

## 🔍 **Browser Support**

- **Chrome** 90+
- **Firefox** 88+
- **Safari** 14+
- **Edge** 90+

## 🤝 **Contributing**

### **Development Workflow**
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

### **Code Standards**
- Follow ESLint configuration
- Use Prettier for formatting
- Write meaningful commit messages
- Add JSDoc comments for functions

## 📝 **License**

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## 🙏 **Acknowledgments**

- **Dataset**: Google Play Store Apps dataset from Kaggle
- **Libraries**: React, Recharts, Tailwind CSS, and all contributors
- **Icons**: Lucide React icon library
- **Design**: Modern dashboard design principles

