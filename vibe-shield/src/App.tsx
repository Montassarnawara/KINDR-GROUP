import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Community from "./pages/Community";
import Leaderboard from "./pages/Leaderboard";
import Journey from "./pages/Journey";
import Missions from "./pages/Missions";
import Extension from "./pages/Extension";
import SettingsPage from "./pages/Settings";
import Profile from "./pages/Profile";
import Bestie from "./pages/Bestie";
import Analytics from "./pages/Analytics";
import AppLayout from "./components/AppLayout";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/bestie" element={<Bestie />} />
            <Route path="/community" element={<Community />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/journey" element={<Journey />} />
            <Route path="/missions" element={<Missions />} />
            <Route path="/extension" element={<Extension />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/profile" element={<Profile />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
