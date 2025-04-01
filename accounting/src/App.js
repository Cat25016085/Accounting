import React, { useState } from 'react';
import Login from './Login';
import Report from './Report';

function App() {
  const [user, setUser] = useState(null);

  const handleLogin = (loggedInUser) => {
    setUser(loggedInUser);
  };

  return (
    <div>
      {!user ? (
        <Login onLogin={handleLogin} />
      ) : (
        <Report />
      )}
    </div>
  );
}

export default App;
