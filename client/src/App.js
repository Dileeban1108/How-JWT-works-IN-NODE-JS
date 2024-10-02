import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import React from "react";
import Login from "./Pages/Login";
import StudentRegister from "./Pages/StudentRegister"
import Home from "./Pages/Home";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/studentRegister" element={<StudentRegister />} />
      </Routes>
    </Router>
  );
}

export default App;
