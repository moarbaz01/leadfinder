This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Lead Finder - Lead Generation & Management System

A comprehensive lead generation and management system built with Next.js, MongoDB, and Google Places API.

### Features

- **Lead Generation**: Search for businesses using Google Places API with location and radius filters
- **Lead Management**: Track leads with status updates (New, Contacted, Qualified, Converted, Rejected)
- **Pagination**: Browse through leads with robust pagination controls
- **Filtering**: Filter leads by status, business type, and search terms
- **Analytics**: View conversion rates and lead statistics
- **Data Export**: Export leads to Excel/CSV format
- **Database Storage**: Persistent storage with MongoDB and Mongoose

### Pages

- **Search** (`/`): Generate new leads by searching businesses
- **Leads** (`/leads`): Manage existing leads with filtering and pagination
- **Analytics** (`/analytics`): View lead statistics and conversion rates

## Getting Started

### Prerequisites

1. **MongoDB**: Install and run MongoDB locally on `mongodb://localhost:27017`
2. **Google Places API Key**: Get an API key from Google Cloud Console

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables in `.env.local`:
```bash
MONGODB_URI=mongodb://localhost:27017/leadfinder
PLACE_API_KEY=your_google_places_api_key_here
```

3. Start MongoDB locally:
```bash
# On Windows
net start MongoDB

# On macOS/Linux
sudo systemctl start mongod
```

4. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### API Endpoints

- `GET /api/leads` - Fetch leads with pagination and filtering
- `POST /api/leads` - Create a new lead
- `PUT /api/leads/[id]` - Update a lead
- `DELETE /api/leads/[id]` - Delete a lead
- `POST /api/leads/save-batch` - Save multiple leads at once
- `POST /api/search-places` - Search for places using Google Places API
- `POST /api/get-place-details` - Get detailed information about a place

### Database Schema

The Lead model includes:
- `name`: Business name
- `address`: Business address
- `phone`: Phone number
- `website`: Website URL
- `mapsUrl`: Google Maps URL
- `rating`: Google rating
- `reviews`: Number of reviews
- `status`: Lead status (New, Contacted, Qualified, Converted, Rejected)
- `placeId`: Google Places ID (unique)
- `businessType`: Type of business
- `location`: Search location
- `notes`: Additional notes

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.