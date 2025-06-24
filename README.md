# Shazam for Food

## Overview
"Shazam for Food" is a single-page web application that allows users to upload images of dishes and identify them using machine learning. The app provides users with recipes, dietary tags, and restaurant locations based on the identified dish. Built with Next.js, Tailwind CSS, Framer Motion, Express, MongoDB, and TensorFlow for Node.js, this application offers a seamless and interactive experience.

## Features
- **Photo Upload**: Users can drag and drop images to identify dishes.
- **Dish Identification**: Utilizes TensorFlow to recognize dishes and provide top predictions.
- **Recipe and Tags**: Displays the recipe and dietary tags for the identified dish.
- **Location Suggestions**: Provides 3-5 restaurant locations where the dish can be found.
- **Filters**: Users can filter results by dietary preferences (e.g., vegetarian, gluten-free) and city.
- **Share Functionality**: Users can share their findings on social media using the Web Share API.
- **Responsive Design**: The application is designed to be mobile-friendly and visually appealing.

## Project Structure
```
shazam-for-food
├── pages
│   ├── page.tsx
│   └── layout.tsx
├── components
│   ├── PhotoDropzone.tsx
│   ├── ResultCard.tsx
│   ├── DietFilter.tsx
│   ├── CityFilter.tsx
│   ├── ShareButton.tsx
│   └── Loader.tsx
├── styles
│   └── globals.css
├── public
│   └── favicon.ico
├── .env.example
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── postcss.config.js
├── vercel.json
├── README.md
└── schema.json
```

## Setup Instructions

1. **Install Dependencies**: Run `npm install` to install all required packages for both frontend and backend.

2. **Run Locally**:
   - Frontend: Navigate to the `app` directory and run `npm run dev` to start the Next.js application on `http://localhost:3000`.
   - Backend: Test the Express server locally using `ts-node backend/src/index.ts`.
5. **Deploy to Vercel**: Use the Vercel CLI to deploy the application. Run `vercel --prod` and set the environment variables as needed.

## Technologies Used
- **Frontend**: Next.js, TypeScript, Tailwind CSS, Framer Motion
- **Deployment**: Vercel

## Future Enhancements
- Implement user-submitted dishes via a POST endpoint.
- Enhance the UI with more animations and transitions.
- Add user authentication for personalized experiences.

## License
This project is licensed under the MIT License. See the LICENSE file for more details.