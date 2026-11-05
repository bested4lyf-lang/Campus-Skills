import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import BottomTabs from "./BottomTabs";
import Footer from "./Footer";
import { useAuth } from "../../hooks/useAuth";
import { useActivityCount } from "../../hooks/useActivityCount";

/**
 * Wraps every screen that shows the navbar.
 * Login and Create Account are routed outside this layout (see App.tsx).
 */
export default function MainLayout() {
  const { user, logout } = useAuth();
  const activityCount = useActivityCount();

  return (
    <div className="flex min-h-dvh flex-col">
      <Navbar user={user} onLogout={logout} activityCount={activityCount} />
      <main className="flex-1">
        <Outlet />
      </main>
      {/* pb-16 keeps the footer clear of the fixed bottom tabs on mobile */}
      <div className="pb-16 md:pb-0">
        <Footer />
      </div>
      <BottomTabs activityCount={user ? activityCount : 0} />
    </div>
  );
}