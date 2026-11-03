import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import MainLayout from "./component/layout/MainLayout";
import Discover from "./page/Discover";
import AuthPage from "./page/AuthPage";
import Placeholder from "./page/Placeholder";
import ServiceDetail from "./page/ServiceDetail";
import MyServices from "./page/MyServices";
import Activity from "./page/Activity";
import PublicProfile from "./page/PublicProfile";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Authentication pages do not use the main navigation layout. */}
        <Route path="/login" element={<AuthPage />} />
        <Route path="/register" element={<AuthPage />} />

        {/* Main application pages share the navbar and bottom navigation. */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Discover />} />
          <Route path="/discover" element={<Discover />} />
          <Route path="/services/:id" element={<ServiceDetail />} />
          <Route path="/my-services" element={<MyServices />} />
          <Route path="/activity" element={<Activity />} />
          <Route path="/messages" element={<Placeholder title="Messages" />} />
          <Route path="/profile" element={<PublicProfile />} />
          <Route path="/profile/edit" element={<PublicProfile editing />} />
          <Route path="/profile/:id" element={<PublicProfile />} />
        </Route>

        {/* Redirect unknown routes to Discover. */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}