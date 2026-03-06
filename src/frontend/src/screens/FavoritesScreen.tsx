import { Heart, Share2, Trash2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { toast } from "sonner";
import type { Quote } from "../backend.d";
import {
  useAllQuotes,
  useFavorites,
  useRemoveFavorite,
} from "../hooks/useQueries";

interface FavoriteItemProps {
  quote: Quote;
  index: number;
}

function FavoriteItem({ quote, index }: FavoriteItemProps) {
  const removeFavorite = useRemoveFavorite();

  const handleRemove = () => {
    removeFavorite.mutate(quote.id);
    toast("Removed from favorites", {
      description: `"${quote.text.slice(0, 40)}..."`,
    });
  };

  const handleShare = async () => {
    const shareText = `"${quote.text}" — ${quote.author}`;
    if (navigator.share) {
      try {
        await navigator.share({ text: shareText });
      } catch {
        // user cancelled
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareText);
        toast.success("Copied to clipboard!");
      } catch {
        toast.error("Could not copy to clipboard");
      }
    }
  };

  return (
    <motion.article
      data-ocid={`favorites.item.${index}`}
      className="rounded-xl p-4 bg-card border border-border"
      layout
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 12, transition: { duration: 0.2 } }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      {/* Heart badge */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-1.5">
          <Heart
            size={14}
            className="text-destructive flex-shrink-0 mt-0.5"
            fill="oklch(0.65 0.22 25)"
          />
          {quote.category && (
            <span className="text-[10px] font-body text-muted-foreground bg-muted/50 px-2 py-0.5 rounded-full">
              {quote.category}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          <motion.button
            onClick={handleShare}
            className="p-1.5 rounded-lg hover:bg-muted/50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            whileTap={{ scale: 0.9 }}
            aria-label="Share quote"
          >
            <Share2 size={14} className="text-muted-foreground" />
          </motion.button>
          <motion.button
            onClick={handleRemove}
            className="p-1.5 rounded-lg hover:bg-destructive/15 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            whileTap={{ scale: 0.9 }}
            aria-label="Remove from favorites"
          >
            <Trash2
              size={14}
              className="text-muted-foreground hover:text-destructive transition-colors"
            />
          </motion.button>
        </div>
      </div>

      {/* Quote text */}
      <blockquote>
        <p className="quote-text text-sm text-foreground leading-relaxed line-clamp-4 mb-3">
          &ldquo;{quote.text}&rdquo;
        </p>
      </blockquote>

      {/* Author */}
      <p className="text-xs font-display font-semibold text-gold">
        — {quote.author}
      </p>
    </motion.article>
  );
}

export default function FavoritesScreen() {
  const { data: favoriteIds = [], isLoading: favLoading } = useFavorites();
  const { data: allQuotes = [], isLoading: quotesLoading } = useAllQuotes();

  const isLoading = favLoading || quotesLoading;

  const favoriteQuotes = allQuotes.filter((q) =>
    favoriteIds.some((id) => id === q.id),
  );

  return (
    <main data-ocid="favorites.page" className="px-4 pt-6 pb-4">
      {/* Header */}
      <motion.header
        className="flex items-center gap-3 mb-5"
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        <div className="p-2.5 rounded-xl bg-destructive/10 border border-destructive/20">
          <Heart
            size={20}
            className="text-destructive"
            fill="oklch(0.65 0.22 25)"
          />
        </div>
        <div>
          <h1 className="font-display font-bold text-xl text-foreground">
            Favorites
          </h1>
          <p className="text-xs text-muted-foreground font-body">
            {isLoading
              ? "Loading..."
              : `${favoriteQuotes.length} saved quote${favoriteQuotes.length !== 1 ? "s" : ""}`}
          </p>
        </div>
      </motion.header>

      {/* Content */}
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="loading"
            data-ocid="favorites.loading_state"
            className="space-y-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {(["sk1", "sk2", "sk3"] as const).map((k) => (
              <div
                key={k}
                className="rounded-xl p-4 bg-card border border-border"
              >
                <div className="skeleton h-3 w-20 mb-3" />
                <div className="skeleton h-4 w-full mb-2" />
                <div className="skeleton h-4 w-4/5 mb-2" />
                <div className="skeleton h-4 w-3/5 mb-3" />
                <div className="skeleton h-3 w-28" />
              </div>
            ))}
          </motion.div>
        ) : favoriteQuotes.length === 0 ? (
          <motion.div
            key="empty"
            data-ocid="favorites.empty_state"
            className="flex flex-col items-center justify-center py-16 text-center"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="text-5xl mb-4"
              animate={{ scale: [1, 1.08, 1], opacity: [0.7, 1, 0.7] }}
              transition={{
                duration: 2.5,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            >
              💝
            </motion.div>
            <p className="font-display font-semibold text-base text-foreground mb-2">
              No favorites yet
            </p>
            <p className="text-sm font-body text-muted-foreground max-w-[240px] leading-relaxed">
              Tap the{" "}
              <Heart
                size={13}
                className="inline text-muted-foreground"
                strokeWidth={2}
              />{" "}
              heart on any quote to save it here.
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="list"
            className="space-y-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <AnimatePresence>
              {favoriteQuotes.map((quote, i) => (
                <FavoriteItem
                  key={quote.id.toString()}
                  quote={quote}
                  index={i + 1}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
