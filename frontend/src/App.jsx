import { useState, useEffect } from "react";
import Auth from "./pages/Auth";
import ButtonAppBar from "./pages/Navbar";
import Products from "./pages/Card";
import Seller from "./pages/Seller";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Cart from "./pages/Cart";

function App() {
  const [token, setToken] = useState(() => localStorage.getItem("token") || "");
  const [role, setRole] = useState(() => localStorage.getItem("role") || ""); 

  useEffect(() => {
    if (token) {
      setRole(localStorage.getItem("role") || "user");
    }
  }, [token]);

  return (
    <Router>
      {token ? <ButtonAppBar onLogout={() => setToken("")} /> : <Auth setToken={setToken} setRole={setRole} />}
      
      <Routes>
        <Route path="/" element={<Products />} />
        <Route path="/cart" element={<Cart />} />
        
        <Route
          path="/seller"
          element={role === "admin" ? <Seller /> : <Navigate to="/" replace />}
        />
      </Routes>
    </Router>
  );
}

export default App;