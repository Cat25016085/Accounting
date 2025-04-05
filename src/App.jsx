import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import ExpenseReportPage from "./pages/ExpenseReportPage";
import HomePage from "./pages/HomePage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/expense-report" element={<ExpenseReportPage />} />
      </Routes>
    </Router>
  );
}

export default App;
