    // src/pages/HomePage.jsx
import { useNavigate } from "react-router-dom";

function HomePage() {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/login");
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-6">Welcome to Accounting System</h1>
        <button
          onClick={handleLogin}
          className="px-6 py-3 bg-blue-600 text-white rounded-xl shadow hover:bg-blue-700 transition"
        >
          登入
        </button>
      </div>
    </div>
  );
}

export default HomePage;
