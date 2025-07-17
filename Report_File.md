📊 Google Play Store Analytics Dashboard — Report
🧩 Objective
To analyze and visualize key insights from the Google Play Store dataset using an interactive dashboard built with ReactJS, Chart.js, and Tailwind CSS. The goal is to help users understand app trends, ratings, categories, and reviews.

📁 Dataset Used
googleplaystore.csv – Contains metadata for apps (e.g., category, rating, installs, etc.)

googleplaystore_user_reviews.csv – Contains user reviews and sentiment polarity

⚙️ Tech Stack
Frontend: ReactJS, Tailwind CSS, Chart.js

Data Handling: CSV files in /public/data/

Visualizations: Bar charts, Pie charts, Line charts, Word clouds

📈 Key Features
Category-wise App Distribution

Shows number of apps per category.

Rating Analysis

Average ratings across apps with sentiment breakdown.

App Size vs. Rating Correlation

Visualization of how app size relates to user rating.

Install Trends

Popularity of apps based on download counts.

Sentiment Analysis

Word clouds based on positive/negative/neutral reviews.

🔍 Insights
Tools and Productivity apps have high install counts and good ratings.

Games and Entertainment dominate the Play Store in terms of quantity.

Sentiment analysis shows common positive words: “love”, “great”, “easy”;
negative words: “crash”, “bug”, “slow”.

📤 Deployment/Usage
Run with: npm install → npm run dev

Upload new datasets via UI to see updated analytics

Reports can be exported from the browser or saved as screenshots

🏁 Conclusion
This dashboard serves as a powerful and interactive tool for exploring Play Store data. It can be extended to include time-based analysis, monetization trends, and NLP-based deep review summaries.
