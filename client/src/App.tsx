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
      {/* The Manifest landing is the front door as of 2026-08-19. It stopped
          being a preview then — the skin it hands to the case studies is now
          their default too, so the whole site reads in one language. */}
      <Route path={"/"} component={HandoffManifest} />
      {/* The previous home page, kept reachable for comparison. The pre-today
          site in full is the `original-2026-08-17` tag — see RESTORE.md. */}
      <Route path={"/v3"}>{() => <LandingV3 />}</Route>
      {/* Where the landing lived while it was a preview. Kept so older links,
          and anything written down during the build, still resolve. */}
      <Route path={"/handoff/manifest"} component={HandoffManifest} />
      {/* Gate → landing → case study on one URL, for demoing the sequence
          without clearing the auth cookie. */}
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
