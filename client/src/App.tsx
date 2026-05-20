import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { PasswordGate } from "./components/PasswordGate";
import { ImageLightbox } from "./components/ImageLightbox";
import { ThemeProvider } from "./contexts/ThemeContext";
import Landing from "./pages/Landing";
import SearchAds from "./pages/SearchAds";
import WhatsApp from "./pages/WhatsApp";
import CommerceAds from "./pages/CommerceAds";
import Resume from "./pages/Resume";

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Landing} />
      <Route path={"/search-ads"} component={SearchAds} />
      <Route path={"/whatsapp"} component={WhatsApp} />
      <Route path={"/commerce-ads"} component={CommerceAds} />
      <Route path={"/resume"} component={Resume} />
      <Route path={"/404"} component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <PasswordGate>
        <ThemeProvider defaultTheme="light">
          <TooltipProvider>
            <Toaster />
            <ImageLightbox />
            <Router />
          </TooltipProvider>
        </ThemeProvider>
      </PasswordGate>
    </ErrorBoundary>
  );
}

export default App;
