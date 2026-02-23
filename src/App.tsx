import "./App.css";
import { Routes, Route } from "react-router-dom";
import Home from "./marketing/pages/Home";
import WhyCashCare from "./marketing/pages/WhyCashCare";
import Product from "./marketing/pages/Product";
// import Demo from "./marketing/pages/Demo";
import Interest from "./marketing/pages/Interest";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/why-cash-care" element={<WhyCashCare />} />
        <Route path="/product" element={<Product />} />
        {/* <Route path="/demo" element={<Demo />} /> */}
        <Route path="/contact" element={<Interest />} />
      </Routes>
    </>
  );
}

export default App;
