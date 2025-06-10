import { SearchAnalyticsDashboard } from "./components/dashboard";
// import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
// 
// const client = new ApolloClient({
//   uri: 'https://api.example.com/graphql',
//   cache: new InMemoryCache(),
//   headers: {
//     // Add any required headers
//     // 'Authorization': `Bearer ${token}`,
//   }
// });

// function App() {
//   return (
//     <ApolloProvider client={client}>
//       <SearchAnalyticsDashboard />
//     </ApolloProvider>
//   );
// }

function App() {
  return <div><SearchAnalyticsDashboard /></div>;
}

export default App;
