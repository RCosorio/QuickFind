# QuickFind Database Scripts

This directory contains scripts for managing the QuickFind MongoDB database.

## Prerequisites

- MongoDB connection string is configured in the `.env` file at the project root
- The current configuration is set up for MongoDB Atlas 

## Available Scripts

### Clear Database

Removes all data from the collections: users, businesses, and reviews.

```bash
npm run db:clear
```

### Seed Database

Populates the database with sample data:
- 4 sample users (student, store owner, restaurant owner, housing owner)
- 3 sample businesses (bookstore, café, housing complex)
- No initial reviews (these can be added through the application)

```bash
npm run db:seed
```

### Reset Database

Combines the clear and seed operations: first removes all data, then adds fresh sample data.

```bash
npm run db:reset
```

## Sample Data

After running the seed script, the following accounts will be available:

### User Accounts

| Email | Password | Role |
|-------|----------|------|
| student@example.com | 123123 | Student |
| store@example.com | 123123 | Business Owner |
| restaurant@example.com | 123123 | Business Owner |
| housing@example.com | 123123 | Business Owner |

### Businesses

- Campus Bookstore (owned by store@example.com)
- Campus Café (owned by restaurant@example.com)
- Student Housing Complex (owned by housing@example.com)

## Troubleshooting

If you encounter connection issues:

1. Check that your MongoDB connection string in the `.env` file is correct
2. Make sure you've replaced `<db_password>` with your actual password
3. Verify that your IP address is whitelisted in MongoDB Atlas 