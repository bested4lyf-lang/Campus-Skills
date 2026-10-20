import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import MainLayout from "./component/layout/MainLayout";
import Discover from "./page/Discover";
import AuthPage from "./page/AuthPage";
import Placeholder from "./page/Placeholder";
import MyServices from "./page/MyServices";

export default function App() {
return ( <BrowserRouter> <Routes>
{/* Authentication pages do not use the main navigation layout. */}
<Route path="/login" element={<AuthPage />} />
<Route path="/register" element={<AuthPage />} />


    {/* Main application pages share the navbar and bottom navigation. */}
    <Route element={<MainLayout />}>
      <Route path="/" element={<Discover />} />
      <Route path="/discover" element={<Discover />} />
      <Route path="/activity" element={<Placeholder title="Activity" />} />
      <Route path="/messages" element={<Placeholder title="Messages" />} />
      <Route path="/profile" element={<Placeholder title="Profile" />} />
      <Route path="/my-services" element={<MyServices />} />
    </Route>

    {/* Redirect unknown routes to Discover. */}
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
</BrowserRouter>


);
}
