import { BrowserRouter, Route, Routes } from "react-router-dom";
import MainLayout from "./component/layout/MainLayout";
import Placeholder from "./page/Placeholder";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Screens WITH the navbar */}
        <Route element={<MainLayout />}>
          <Route index element={<Placeholder title="Discover" />} />
          <Route path="my-services" element={<Placeholder title="My Services" />} />
          <Route path="activity" element={<Placeholder title="Activity" />} />
          <Route path="profile" element={<Placeholder title="Public Profile" />} />
          <Route path="profile/edit" element={<Placeholder title="Edit Profile & Skills" />} />
          <Route path="settings" element={<Placeholder title="Account Settings" />} />
        </Route>

        {/* Screens WITHOUT the navbar */}
        <Route path="login" element={<Placeholder title="Sign In" />} />
        <Route path="register" element={<Placeholder title="Create Account" />} />
      </Routes>
    </BrowserRouter>
  );
}
