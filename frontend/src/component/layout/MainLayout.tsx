import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import BottomTabs from "./BottomTabs";
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
    <div className="min-h-dvh">
      <Navbar user={user} onLogout={logout} activityCount={activityCount} />
      <main className="pb-16 md:pb-0">
        <Outlet />
      </main>
      <BottomTabs activityCount={user ? activityCount : 0} />
    </div>
  );
}
