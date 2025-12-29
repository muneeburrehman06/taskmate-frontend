'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

export default function TestApiPage() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    api('/test')
      .then(res => setData(res))
      .catch(err => console.error('API Error:', err));
  }, []);

  return (
    <div>
      <h1>API Test Page</h1>
      {data ? (
        <pre>{JSON.stringify(data, null, 2)}</pre>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}
