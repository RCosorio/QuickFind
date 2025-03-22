# QuickFind

QuickFind is a platform that connects users with local businesses, including stores, restaurants, and housing options.

## Features

- **User Authentication**: Separate login flows for users and businesses
- **Business Directory**: Browse businesses by category (stores, restaurants, housing)
- **Search Functionality**: Find businesses based on keywords
- **Detailed Business Information**: View comprehensive details about each business

## Tech Stack

- React
- TypeScript
- Tailwind CSS
- React Router
- React Icons

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/YOUR_USERNAME/quick-find.git
   cd quick-find
   ```

2. Install dependencies
   ```bash
   npm install
   # or
   yarn
   ```

3. Start the development server
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

## Project Structure

```
quick-find/
├── public/             # Static files
├── src/
│   ├── components/     # Reusable UI components
│   │   ├── auth/       # Authentication-related components
│   │   └── dashboard/  # Dashboard-related components
│   ├── context/        # React context providers
│   ├── pages/          # Application pages
│   ├── types/          # TypeScript type definitions
│   ├── utils/          # Utility functions
│   ├── App.tsx         # Main application component
│   └── main.tsx        # Application entry point
├── .gitignore          # Git ignore configuration
├── index.html          # HTML entry point
├── package.json        # Dependencies and scripts
├── tsconfig.json       # TypeScript configuration
└── tailwind.config.js  # Tailwind CSS configuration
```

## License

[MIT](https://choosealicense.com/licenses/mit/)
