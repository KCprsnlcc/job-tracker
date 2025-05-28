import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const SupabaseConnectionTest: React.FC = () => {
  const [connectionStatus, setConnectionStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    async function testConnection() {
      try {
        // Simple query to test the connection
        const { data, error } = await supabase.from('jobs').select('*');
        
        if (error) {
          console.error('Supabase connection error:', error);
          setConnectionStatus('error');
          setErrorMessage(error.message);
        } else {
          console.log('Supabase connection successful!', data);
          setConnectionStatus('success');
        }
      } catch (err) {
        console.error('Unexpected error:', err);
        setConnectionStatus('error');
        setErrorMessage(err instanceof Error ? err.message : 'Unknown error');
      }
    }
    
    testConnection();
  }, []);

  return (
    <div className="p-4 border rounded-lg my-4">
      <h2 className="text-lg font-semibold mb-2">Supabase Connection Status</h2>
      
      {connectionStatus === 'loading' && (
        <div className="text-blue-500">Testing connection...</div>
      )}
      
      {connectionStatus === 'success' && (
        <div className="text-green-500">
          ✅ Connected to Supabase successfully!
        </div>
      )}
      
      {connectionStatus === 'error' && (
        <div className="text-red-500">
          ❌ Failed to connect to Supabase: {errorMessage}
        </div>
      )}
    </div>
  );
};

export default SupabaseConnectionTest;
