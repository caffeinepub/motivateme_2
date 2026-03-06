import { Compass } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import type { Quote } from "../backend.d";
import QuoteActions from "../components/QuoteActions";
import { useFavorites, useQuotesByCategory } from "../hooks/useQueries";

const CATEGORIES = [
  "All",
  "Motivation",
  "Student Success",
  "Career",
  "Positivity",
];

const CATEGORY_ICONS: Record<string, string> = {
  All: "✦",
  Motivation: "🔥",
  "Student Success": "🎓",
  Career: "💼",
  Positivity: "☀️",
};

interface QuoteCardProps {
  quote: Quote;
  isFavorited: boolean;
  index: number;
}

function QuoteCard({ quote, isFavorited, index }: QuoteCardProps) {
  return (
    <motion.article
      data-ocid={`explore.quote.item.${index}`}
      className="quote-card-mini rounded-xl p-4"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.04 }}
      layout
    >
      <p className="quote-text text-sm text-foreground leading-relaxed line-clamp-3 mb-3">
        &ldquo;{quote.text}&rdquo;
      </p>
      <div className="flex items-center justify-between">
        <p className="text-xs font-display font-semibold text-gold truncate mr-2">
          — {quote.author}
        </p>
        <QuoteActions quote={quote} isFavorited={isFavorited} size="sm" />
      </div>
      {quote.category && (
        <div className="mt-2">
          <span className="text-[10px] font-body text-muted-foreground bg-muted/50 px-2 py-0.5 rounded-full">
            {quote.category}
          </span>
        </div>
      )}
    </motion.article>
  );
}

export default function ExploreScreen() {
  const [activeCategory, setActiveCategory] = useState("All");
  const { data: quotes = [], isLoading } = useQuotesByCategory(activeCategory);
  const { data: favorites = [] } = useFavorites();

  return (
    <main data-ocid="explore.page" className="px-4 pt-6 pb-4">
      {/* Header */}
      <motion.header
        className="flex items-center gap-3 mb-5"
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20">
          <Compass size={20} className="text-gold" />
        </div>
        <div>
          <h1 className="font-display font-bold text-xl text-foreground">
            Explore
          </h1>
          <p className="text-xs text-muted-foreground font-body">
            Discover inspiring quotes
          </p>
        </div>
      </motion.header>

      {/* Category tabs */}
      <div className="mb-5 -mx-1">
        <div
          data-ocid="explore.category.tab"
          className="flex gap-2 overflow-x-auto pb-2 px-1"
          style={{ scrollbarWidth: "none" }}
        >
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                type="button"
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`flex-shrink-0 relative flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-body font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                  isActive ? "category-tab-active" : "category-tab"
                }`}
                aria-pressed={isActive}
              >
                {isActive && (
                  <motion.span
                    layoutId="category-active-pill"
                    className="category-active-bg"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{CATEGORY_ICONS[cat]}</span>
                <span className="relative z-10">{cat}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="loading"
            data-ocid="explore.loading_state"
            className="space-y-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {(["sk1", "sk2", "sk3", "sk4"] as const).map((k) => (
              <div
                key={k}
                className="rounded-xl p-4 bg-card border border-border"
              >
                <div className="skeleton h-4 w-full mb-2" />
                <div className="skeleton h-4 w-4/5 mb-2" />
                <div className="skeleton h-4 w-3/5 mb-3" />
                <div className="skeleton h-3 w-24" />
              </div>
            ))}
          </motion.div>
        ) : quotes.length === 0 ? (
          <motion.div
            key="empty"
            data-ocid="explore.empty_state"
            className="flex flex-col items-center justify-center py-16 text-center"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="text-5xl mb-4">🔍</div>
            <p className="font-display font-semibold text-base text-foreground mb-2">
              No quotes found
            </p>
            <p className="text-sm font-body text-muted-foreground max-w-[240px]">
              Try a different category to find inspiring quotes.
            </p>
          </motion.div>
        ) : (
          <motion.div
            key={`quotes-${activeCategory}`}
            className="space-y-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            {quotes.map((quote, i) => (
              <QuoteCard
                key={quote.id.toString()}
                quote={quote}
                isFavorited={favorites.some((id) => id === quote.id)}
                index={i + 1}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
