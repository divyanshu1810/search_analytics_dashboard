# Search Analytics Dashboard

A responsive React + TypeScript dashboard for visualizing search analytics data with interactive charts, filtering, and sorting capabilities.

## 🎥 Demo Video


## 🔗 Deployed Link

[View Live Demo](https://search-analytics-dashboard.vercel.app/)

## 🚀 Features

- **Date Range Selection**: Pick custom date ranges with a default of the last 30 days
- **Metrics Table**: Display top 20 search queries with clicks, impressions, CTR, and position data
- **Interactive Sorting**: Click column headers to sort by any metric (ascending/descending)
- **Real-time Filtering**: Filter queries by substring with instant results
- **Detail Charts**: Click any query row to view time-series data with line charts
- **Responsive Design**: Optimized for both desktop and mobile devices
- **Loading States**: Smooth loading indicators and error handling
- **TypeScript**: Full type safety throughout the application

## 🛠️ Tech Stack

- **Frontend**: React 19 with TypeScript
- **Charts**: Recharts for data visualization
- **Icons**: Lucide React
- **Testing**: Jest + React Testing Library
- **GraphQL**: Apollo Client (ready to integrate)
- **Styling**: Tailwind CSS utility classes

## 📦 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd seo-stack
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm start
   ```

4. **Open in browser**
   Navigate to `http://localhost:3000`

### Running Tests
```bash
npm test
```

### Build for Production
```bash
npm run build
```

## 🔌 GraphQL Integration

The application is ready for GraphQL integration with Apollo Client. Currently running with mock data for demonstration purposes.

### Enabling Real GraphQL API

1. **Uncomment Apollo Client setup in `src/App.tsx`:**
   ```typescript
   import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
   
   const client = new ApolloClient({
     uri: 'https://api.example.com/graphql',
     cache: new InMemoryCache(),
     headers: {
       // Add authentication headers if needed
       // 'Authorization': `Bearer ${token}`,
     }
   });

   function App() {
     return (
       <ApolloProvider client={client}>
         <SearchAnalyticsDashboard />
       </ApolloProvider>
     );
   }
   ```

2. **Enable GraphQL hook in `src/hooks/useSearchAnalytics.ts`:**
   - Uncomment the GraphQL query definition
   - Uncomment either the Apollo hook implementation or manual fetch approach
   - Comment out the mock data implementation

3. **Install Apollo Client** (if not already installed):
   ```bash
   npm install @apollo/client graphql
   ```

### GraphQL Query Structure

The application expects this GraphQL query structure:

```graphql
query GetSearchAnalytics($startDate: String!, $endDate: String!, $queryFilter: String) {
  searchAnalytics(startDate: $startDate, endDate: $endDate, filter: $queryFilter) {
    topQueries(limit: 20, sortBy: CLICKS_DESC) {
      query
      clicks
      impressions
      ctr
      position
    }
    timeSeries(query: $queryFilter, dimensions: ["date"]) {
      date
      clicks
      impressions
    }
  }
}
```

## 🏗️ Architecture & Design Decisions

### Component Structure
```
src/
├── components/
│   ├── dashboard/           # Main dashboard container
│   ├── charts/             # Chart components (DetailChart, OverviewCharts)
│   ├── filters/            # DateRangePicker, SearchFilter
│   └── SortableTable/      # Reusable sortable table component
├── hooks/
│   └── useSearchAnalytics.ts # Data fetching and state management
├── types/
│   └── index.ts            # TypeScript type definitions
└── __tests__/              # Unit tests
```

### Key Design Principles

1. **Component Reusability**: Created generic `SortableTable` component that can be reused across the application
2. **Separation of Concerns**: Data fetching logic isolated in custom hooks
3. **Type Safety**: Comprehensive TypeScript interfaces for all data structures
4. **Responsive Design**: Mobile-first approach with Tailwind CSS
5. **Error Boundary**: Graceful error handling with user-friendly messages
6. **Performance**: Memoization and efficient re-rendering strategies

### State Management
- **Local State**: React hooks (`useState`, `useEffect`) for component-level state
- **Data Fetching**: Custom `useSearchAnalytics` hook encapsulates all API logic
- **Props Drilling**: Minimal due to focused component hierarchy

## 🧪 Testing Strategy

### Current Test Coverage
- **Component Tests**: `SortableTable.test.tsx` - Tests sorting functionality and user interactions
- **Hook Tests**: `useSearchAnalytics.test.ts` - Tests data fetching, filtering, and error states

### Test Examples
```bash
# Run specific test suites
npm test -- --testNamePattern="SortableTable"
npm test -- --testNamePattern="useSearchAnalytics"

# Run with coverage
npm test -- --coverage
```

### Testing Philosophy
- **User-Centric**: Tests focus on user interactions rather than implementation details
- **Integration**: Tests cover component behavior with real data flows
- **Error Cases**: Comprehensive error state and edge case testing

## 🔧 Configuration & Environment

### Environment Variables
Create a `.env` file for configuration:
```env
REACT_APP_GRAPHQL_ENDPOINT=https://api.example.com/graphql
REACT_APP_AUTH_TOKEN=your_auth_token_here
```

### TypeScript Configuration
The project uses strict TypeScript settings for enhanced type safety:
- Strict null checks enabled
- No implicit any
- Unused locals/parameters detection

## 🚧 Trade-offs & Assumptions

### Current Limitations
1. **Mock Data**: Using simulated data instead of real API calls
2. **No Caching Strategy**: Beyond Apollo's default caching
3. **Limited Error Recovery**: Basic error handling without retry mechanisms
4. **No Offline Support**: Requires active internet connection

### Assumptions Made
1. **Data Format**: Assumed consistent API response structure
2. **Date Ranges**: Limited to reasonable ranges (max 1 year)
3. **Browser Support**: Modern browsers with ES6+ support
4. **Network**: Stable internet connection for real-time updates

### Performance Considerations
- **Debounced Search**: 300ms delay on filter input to reduce API calls
- **Memoized Components**: Chart components memoized to prevent unnecessary re-renders
- **Lazy Loading**: Ready for code splitting implementation

## 🔮 Future Enhancements

### With Additional Time (4+ hours)
1. **Advanced Filtering**: Multiple filter criteria, date-based filtering
2. **Data Export**: CSV/PDF export functionality
3. **Real-time Updates**: WebSocket integration for live data
4. **Advanced Charts**: Heatmaps, geographic data visualization
9. **Advanced Analytics**: Comparative analysis, trend predictions

### Technical Improvements
- **Error Boundary**: Global error boundary with error reporting
- **Monitoring**: Integration with analytics services
- **Progressive Web App**: PWA capabilities for mobile experience
- **Micro-frontends**: Component library extraction

## 📄 License

This project is licensed under the MIT License.

---

**Total Development Time**: ~4 hours for core MVP functionality