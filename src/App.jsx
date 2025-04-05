import { useEffect, useState } from 'react'
import { supabase } from './lib/supabase'

function App() {
  const [data, setData] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase.from('users').select('*')
      if (error) {
        console.error('Supabase Error:', error)
      } else {
        setData(data)
      }
    }

    fetchData()
  }, [])

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Hello Supabase + Vercel</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  )
}

export default App
