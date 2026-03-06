import { Toaster } from "@/components/ui/sonner";
import { useState } from "react";
import BottomNav from "./components/BottomNav";
import ExploreScreen from "./screens/ExploreScreen";
import FavoritesScreen from "./screens/FavoritesScreen";
import HomeScreen from "./screens/HomeScreen";

export type TabId = "home" | "explore" | "favorites";

export default function App() {
  const [activeTab, setActiveTab] = useState<TabId>("home");

  return (
    <div className="app-shell app-bg-mesh">
      {/* Screen content */}
      <div
        className="content-area"
        style={{ display: activeTab === "home" ? "block" : "none" }}
      >
        <HomeScreen />
      </div>
      <div
        className="content-area"
        style={{ display: activeTab === "explore" ? "block" : "none" }}
      >
        <ExploreScreen />
      </div>
      <div
        className="content-area"
        style={{ display: activeTab === "favorites" ? "block" : "none" }}
      >
        <FavoritesScreen />
      </div>

      {/* Bottom navigation */}
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />

      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: "oklch(0.22 0.04 265)",
            color: "oklch(0.97 0.01 90)",
            border: "1px solid oklch(0.82 0.16 80 / 0.3)",
          },
        }}
      />
    </div>
  );
}
