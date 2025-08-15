import { Routes, Route } from "react-router-dom";
import Home from "./Modules/Homepage/components/Home";
import About from "./Modules/Homepage/components/About";
import Contact from "./Modules/Homepage/components/Contact";
import { DoctorPage } from "./Modules/Doctor/components";

function App() {
  return (
    <div>
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
