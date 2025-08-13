import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./Homepage/Home";
import About from "./Homepage/About";
import Contact from "./Homepage/Contact";

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
    </Routes>
  );
};

export default App;
