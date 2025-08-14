import React from "react";
import { Routes, Route, Link } from 'react-router-dom';
import Home from "./Homepage/Home";
import About from "./Homepage/About";
import Contact from "./Homepage/Contact";
import { DoctorPage } from './Modules/Doctor/components';

function App() {

  return (
    <div>
      <nav>
        <Link to="/doctors">Doctors</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/doctors" element={<DoctorPage />} />
      </Routes>
    </div>
  );
}
export default App;
