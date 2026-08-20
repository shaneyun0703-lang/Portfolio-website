import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ImageLightbox } from "./components/ImageLightbox";
import { ThemeProvider } from "./contexts/ThemeContext";
import LandingV3 from "./pages/LandingV3";
import SearchAds from "./pages/SearchAds";
import WhatsApp from "./pages/WhatsApp";
import CommerceAds from "./pages/CommerceAds";
import Resume from "./pages/Resume";
import ResumeAI from "./pages/ResumeAI";
import { PasswordGate } from "./components/PasswordGate";
import HandoffManifest from "./pages/handoff/LandingManifest";
import HandoffFlow from "./pages/handoff/Flow";

function Router() {
  return (
    <Switch>
      <Route path={"/"}>{() => <LandingV3 />}</Route>
      {/* The one surviving landing exploration. PREVIEW ONLY, never linked from /.
          Everything else that lived here (the bright/terminal/editorial/bento/code
          iterations, the Access direction, the unlock flow, the /v1 landing) is
          parked in archive/2026-08-explorations/ rather than deleted. */}
      <Route path={"/handoff/manifest"} component={HandoffManifest} />
      {/* The whole thing end to end on one URL: gate → landing → case study. */}
      <Route path={"/flow"} component={HandoffFlow} />
      <Route path={"/search-ads"} component={SearchAds} />
      <Route path={"/whatsapp"} component={WhatsApp} />
      <Route path={"/commerce-ads"} component={CommerceAds} />
      <Route path={"/resume"} component={Resume} />
      <Route path={"/resume-ai"} component={ResumeAI} />
      <Route path={"/gate"}>{() => <PasswordGate preview>{null}</PasswordGate>}</Route>
      <Route path={"/404"} component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <ImageLightbox />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
