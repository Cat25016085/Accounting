// src/App.jsx
import { useEffect, useState } from 'react'
import { supabase } from './lib/supabase'

function App() {
  const [status, setStatus] = useState('Connecting...')

  useEffect(() => {
    const testConnection = async () => {
      try {
        const { data, error } = await supabase.from('userss').select('*')
        if (error) throw error
        setStatus(`Connected! Found ${data.length} records.`)
      } catch (err) {
        setStatus('❌ Failed to connect: ' + err.message)
      }
    }

    testConnection()
  }, [])

  return (
    <div style={{ padding: 20 }}>
      <h1>Supabase 測試</h1>
      <p>{status}</p>
    </div>
  )
}

export default App
