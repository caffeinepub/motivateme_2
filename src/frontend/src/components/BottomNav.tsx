import { Compass, Heart, Home } from "lucide-react";
import { motion } from "motion/react";
import type { TabId } from "../App";

interface BottomNavProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}

const tabs: { id: TabId; label: string; Icon: React.ElementType }[] = [
  { id: "home", label: "Home", Icon: Home },
  { id: "explore", label: "Explore", Icon: Compass },
  { id: "favorites", label: "Favorites", Icon: Heart },
];

export default function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  return (
    <nav className="nav-bar fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] z-50 safe-bottom">
      <div className="flex items-center justify-around px-3 py-2.5">
        {tabs.map(({ id, label, Icon }) => {
          const isActive = activeTab === id;
          return (
            <button
              type="button"
              key={id}
              data-ocid={`nav.${id}.link`}
              onClick={() => onTabChange(id)}
              className="flex flex-col items-center gap-1 px-5 py-2 rounded-2xl relative focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              aria-label={label}
              aria-current={isActive ? "page" : undefined}
            >
              {/* Sliding pill background */}
              {isActive && (
                <motion.span
                  layoutId="nav-active-pill"
                  className="nav-active-pill"
                  transition={{ type: "spring", stiffness: 420, damping: 32 }}
                />
              )}

              <motion.div
                animate={{
                  scale: isActive ? 1.08 : 1,
                  y: isActive ? -0.5 : 0,
                }}
                transition={{ type: "spring", stiffness: 400, damping: 28 }}
                className="relative z-10"
              >
                <Icon
                  size={21}
                  strokeWidth={isActive ? 2.2 : 1.7}
                  className={isActive ? "text-gold" : "text-muted-foreground"}
                  style={
                    isActive
                      ? {
                          filter:
                            "drop-shadow(0 0 5px oklch(0.82 0.16 80 / 0.45))",
                        }
                      : undefined
                  }
                  fill={
                    isActive && id === "favorites"
                      ? "oklch(0.65 0.22 25)"
                      : "none"
                  }
                />
              </motion.div>
              <span
                className={`text-[10px] font-body font-semibold tracking-wide transition-colors duration-200 relative z-10 ${
                  isActive ? "text-gold" : "text-muted-foreground"
                }`}
              >
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
