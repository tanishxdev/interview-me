import { useAuth, useUser } from "@clerk/clerk-react";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import TopNav from "./components/layout/TopNav.jsx";
import Footer from "./components/layout/Footer.jsx";
import Landing from "./pages/Landing.jsx";
import AppRoutes from "./routes/AppRoutes.jsx";

function App() {
  const { isLoaded, isSignedIn } = useAuth();
  const { user } = useUser();
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="w-10 h-10 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isSignedIn) {
    return <Landing />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <TopNav user={user} />
      <main className="flex-1">
        <AppRoutes />
      </main>
      <Footer />
    </div>
  );
}

export default App;
