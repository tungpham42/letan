import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import VisitorPage from "./pages/Visitors";
import Dashboard from "./pages/Dashboard";
import DeliveriesPage from "./pages/Deliveries";
import CompaniesPage from "./pages/Companies";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="quan-ly-khach" element={<VisitorPage />} />
          <Route path="buu-pham" element={<DeliveriesPage />} />
          <Route path="danh-ba-cong-ty" element={<CompaniesPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
