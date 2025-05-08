import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import FileDropOrReader from './components/FileDropOrReader';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div style={{ height: '100dvh' }}>
        <FileDropOrReader />
      </div>
    </QueryClientProvider>
  );
}

export default App;
