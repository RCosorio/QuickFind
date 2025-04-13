# QuickFind

QuickFind is a platform that connects users with local businesses, including stores, restaurants, and housing options. The application allows users to browse, search, and interact with businesses, while business owners can create and manage their business profiles.

## Features

### For Users
- **User Authentication**: Secure registration and login system
- **Business Directory**: Browse businesses by category (stores, restaurants, housing)
- **Search Functionality**: Find businesses based on keywords and filters
- **Detailed Business Views**: Comprehensive information about each business
- **Reviews & Inquiries**: Rate businesses and send inquiries directly to business owners

### For Business Owners
- **Dedicated Business Portal**: Separate authentication and dashboard for business accounts
- **Business Profile Management**: Create and update business details, hours, and contact information
- **Product/Menu/Housing Management**: Add, edit, and remove offerings based on business type
- **Review Management**: Respond to customer reviews and inquiries
- **Business Analytics**: Simple analytics to track performance

## Tech Stack

### Frontend
- **React** (v19.0)
- **TypeScript**
- **Tailwind CSS** for styling
- **React Router** for navigation
- **React Icons** for UI elements

### Backend
- **Node.js** with Express
- **MongoDB** for database (with Mongoose)
- **JWT** for authentication

## Database Structure

QuickFind uses MongoDB with the following collections:
- **users**: Regular user accounts
- **businessaccounts**: Business owner accounts
- **businesses**: Business profiles and details
- **reviews**: User reviews and business owner responses

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- MongoDB (local instance or MongoDB Atlas account)

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

3. Configure environment variables
   Create a `.env` file in the root and server directory with:
   ```
   # In server/.env
   MONGO_URI=your_mongodb_connection_string
   PORT=5000
   
   # In root .env
   VITE_API_URL=http://localhost:5000/api
   ```

4. Start the development server
   ```bash
   # Run both frontend and backend
   npm run dev:all
   
   # Or run them separately
   npm run dev        # Frontend only
   npm run dev:server # Backend only
   ```

## Database Management

QuickFind includes scripts for managing the database:

```bash
# Clear the database
npm run db:clear

# Seed the database with sample data
npm run db:seed

# Reset the database (clear and seed)
npm run db:reset

# Migrate user data to business accounts
npm run db:migrate
```

## Project Structure

```
quick-find/
├── src/                   # Frontend React application
│   ├── components/        # Reusable UI components
│   ├── context/           # React context for state management
│   ├── pages/             # Main application pages
│   ├── services/          # API service functions
│   ├── types/             # TypeScript type definitions
│   └── App.tsx            # Main application component
├── server/                # Backend Node.js application
│   ├── src/
│   │   ├── models/        # MongoDB schema models
│   │   ├── routes/        # API route handlers
│   │   ├── scripts/       # Database management scripts
│   │   ├── utils/         # Utility functions
│   │   └── index.ts       # Server entry point
│   └── .env               # Server environment variables
└── .env                   # Frontend environment variables
```

## Features in Detail

### Authentication
- Multiple authentication flows for regular users and business owners
- Separate dashboards for different user types
- Session persistence with local storage

### Business Categories
- **Stores**: Showcase products with inventory management
- **Restaurants**: Display menus with item availability
- **Housing**: List rental units with amenities and details

### Reviews
- Star ratings for businesses
- Text reviews and inquiries
- Business owner responses
- Review moderation capabilities

## Deployment

The application can be deployed using services like Vercel, Netlify, or Heroku:

1. Build the frontend
   ```bash
   npm run build
   ```

2. Set up environment variables in your deployment platform
3. Configure MongoDB connection for production
4. Deploy both the frontend and backend

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

[MIT](https://choosealicense.com/licenses/mit/)
