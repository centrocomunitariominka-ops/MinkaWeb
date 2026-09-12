import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import { ClerkProvider } from "@clerk/clerk-react";
import { esES } from "@clerk/localizations";
import LandingPage from "./pages/LandingPage";
import BlogPost from "./pages/BlogPost";
import { ErrorBoundary } from "./components/ErrorBoundary";

const Admin = lazy(() => import("./pages/Admin"));

const CLERK_PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

function App() {
  return (
    <ErrorBoundary>
      <ClerkProvider
        publishableKey={CLERK_PUBLISHABLE_KEY}
        afterSignOutUrl="/"
        localization={esES}
      >
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/blog/:id" element={<BlogPost />} />
          <Route
            path="/admin"
            element={
              <Suspense
                fallback={<div className="admin-auth">Cargando...</div>}
              >
                <Admin />
              </Suspense>
            }
          />
        </Routes>
      </ClerkProvider>
    </ErrorBoundary>
  );
}

export default App;
