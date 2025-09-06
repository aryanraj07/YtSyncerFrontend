import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import MainLayouts from "./layouts/MainLayouts";
import Homepage from "./pages/Homepage";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import PrivateRoute from "./routes/PrivateRoutes";
import Dashboard from "./pages/Dashboar";
import Room from "./pages/Room";

const App = () => {
  return (
  <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayouts />}>
          <Route index={1} element={<Homepage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="login" element={<LoginPage />} />
        </Route>
        <Route
          element={
            <PrivateRoute>
              <MainLayouts />
            </PrivateRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/room/:roomId" element={<Room />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
