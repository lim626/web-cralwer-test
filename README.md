# Web Crawler Dashboard

A full-stack web application that accepts website URLs as input, crawls them, and displays key information about each page. Built with React/TypeScript frontend and simulated Go-like backend functionality.

## Features

### Core Functionality
- **URL Management**: Add URLs for analysis with validation
- **Real-time Processing**: Start/stop crawling with live status updates
- **Data Collection**: Analyzes HTML version, page title, heading counts, link analysis, broken link detection, and login form presence
- **Authorization**: API requests use Bearer token authentication

### Dashboard Features
- **Sortable Table**: Paginated results with sortable columns
- **Advanced Filtering**: Column filters and global search with fuzzy matching
- **Bulk Actions**: Select multiple URLs for batch operations (start, stop, delete, re-run)
- **Real-time Status**: Live progress indicators (queued → running → completed/error)

### Details View
- **Interactive Charts**: Bar and donut charts showing internal vs external links
- **Broken Links Report**: List of inaccessible links with status codes
- **Comprehensive Analytics**: Complete breakdown of page structure and metadata

### Technical Features
- **Responsive Design**: Works seamlessly on desktop and mobile
- **TypeScript**: Full type safety throughout the application
- **Error Handling**: Graceful error handling with user feedback
- **Testing**: Automated tests covering happy-path scenarios
- **Modern UI**: Clean, accessible interface with shadcn/ui components

## Technology Stack

### Frontend
- **React 18** with TypeScript
- **Next.js 14** (App Router)
- **Tailwind CSS** for styling
- **shadcn/ui** component library
- **Recharts** for data visualization
- **Lucide React** for icons

### Backend (Simulated)
- **Next.js API Routes** (simulating Go backend)
- **RESTful API** design
- **Bearer token authentication**
- **In-memory data storage** (for demo purposes)

### Testing
- **Jest** testing framework
- **React Testing Library** for component testing
- **@testing-library/jest-dom** for DOM assertions

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn package manager

### Installation

1. **Clone the repository**
   \`\`\`bash
   git clone <repository-url>
   cd web-crawler-dashboard
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   # or
   yarn install
   \`\`\`

3. **Run the development server**
   \`\`\`bash
   npm run dev
   # or
   yarn dev
   \`\`\`

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Building for Production

\`\`\`bash
npm run build
npm start
\`\`\`

### Running Tests

\`\`\`bash
# Run tests once
npm test

# Run tests in watch mode
npm run test:watch
\`\`\`

## Usage Guide

### Adding URLs
1. Enter a valid URL in the input field at the top of the dashboard
2. Click "Add URL" or press Enter
3. The URL will be queued for analysis

### Managing Crawls
- **Start**: Click the play button to begin crawling a queued URL
- **Stop**: Click the pause button to halt a running crawl
- **View Details**: Click the eye icon or click on a table row to see detailed analysis
- **Bulk Actions**: Select multiple URLs using checkboxes for batch operations

### Viewing Results
- **Table View**: See all URLs with sortable columns and pagination
- **Search & Filter**: Use the search bar and status filter to find specific results
- **Details Modal**: Click any completed result to see charts and detailed breakdown

### Real-time Updates
The dashboard automatically updates crawl statuses every 2 seconds, showing progress from queued → running → completed.

## API Endpoints

### Authentication
All API requests require a Bearer token in the Authorization header:
\`\`\`
Authorization: Bearer <your-token>
\`\`\`

### Endpoints

#### GET /api/crawl
Retrieve all crawl results with optional filtering
- Query params: `status`, `search`
- Returns: Array of crawl results

#### POST /api/crawl
Add a new URL for crawling
- Body: `{ "url": "https://example.com" }`
- Returns: Created crawl result

#### PUT /api/crawl/[id]
Update crawl status (start, stop, rerun)
- Body: `{ "action": "start|stop|rerun" }`
- Returns: Updated crawl result

#### DELETE /api/crawl/[id]
Delete a crawl result
- Returns: Success confirmation

## Data Structure

### Crawl Result
\`\`\`typescript
interface CrawlResult {
  id: string
  url: string
  status: 'queued' | 'running' | 'completed' | 'error' | 'stopped'
  createdAt: string
  startedAt?: string
  completedAt?: string
  data: CrawlData | null
}
\`\`\`

### Crawl Data
\`\`\`typescript
interface CrawlData {
  htmlVersion: string
  title: string
  headingCounts: {
    h1: number
    h2: number
    h3: number
    h4: number
    h5: number
    h6: number
  }
  internalLinks: number
  externalLinks: number
  brokenLinks: Array<{
    url: string
    statusCode: number
  }>
  hasLoginForm: boolean
}
\`\`\`

## Development Notes

### Architecture Decisions
- **Next.js App Router**: Modern routing with server components
- **Component Composition**: Modular, reusable components
- **Type Safety**: Comprehensive TypeScript coverage
- **State Management**: React hooks for local state
- **Real-time Updates**: Polling-based status updates

### Code Organization
\`\`\`
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Main dashboard
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── crawl-results-table.tsx
│   ├── crawl-details-modal.tsx
│   └── bulk-actions-bar.tsx
├── types/                # TypeScript definitions
├── __tests__/            # Test files
└── README.md
\`\`\`

### Testing Strategy
- **Unit Tests**: Component behavior and props
- **Integration Tests**: User interactions and workflows
- **Happy Path Coverage**: Core functionality scenarios

## Production Considerations

For a production deployment, consider:

1. **Database**: Replace in-memory storage with MySQL/PostgreSQL
2. **Authentication**: Implement proper JWT/OAuth authentication
3. **Rate Limiting**: Add API rate limiting and request throttling
4. **Caching**: Implement Redis caching for frequently accessed data
5. **Monitoring**: Add logging, metrics, and error tracking
6. **Scaling**: Consider queue systems for crawling operations
7. **Security**: Add input validation, CORS policies, and security headers

## License

This project is created as a test task and is available for portfolio use.
