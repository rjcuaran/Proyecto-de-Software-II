import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Recetas from "../pages/Recetas";
import ShoppingList from "../pages/ShoppingList";

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Recetas />} />
        <Route path="/shopping-list" element={<ShoppingList />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
