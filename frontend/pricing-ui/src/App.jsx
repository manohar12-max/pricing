import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CreatePricingForm from "./components/CreatePricingForm";
import PricingList from "./components/PricingList";
import PriceCalculator from "./components/PriceCalculator";
import Home from "./pages/Home";
import Navbar from "./components/Navbar"; 

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create" element={<CreatePricingForm />} />
        <Route path="/edit/:id" element={<CreatePricingForm />} />
        <Route path="/configs" element={<PricingList />} />
        <Route path="/calculate" element={<PriceCalculator />} />
      </Routes>
    </Router>
  );
}

export default App;
