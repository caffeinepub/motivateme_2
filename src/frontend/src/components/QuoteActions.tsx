import { Heart, Share2 } from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";
import type { Quote } from "../backend.d";
import { useAddFavorite, useRemoveFavorite } from "../hooks/useQueries";

interface QuoteActionsProps {
  quote: Quote;
  isFavorited: boolean;
  favoriteToggleOcid?: string;
  shareOcid?: string;
  size?: "sm" | "lg";
}

export default function QuoteActions({
  quote,
  isFavorited,
  favoriteToggleOcid,
  shareOcid,
  size = "sm",
}: QuoteActionsProps) {
  const addFavorite = useAddFavorite();
  const removeFavorite = useRemoveFavorite();

  const iconSize = size === "lg" ? 22 : 18;
  const btnClass =
    size === "lg"
      ? "p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      : "p-2 rounded-lg hover:bg-muted/50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

  const handleFavoriteToggle = () => {
    if (isFavorited) {
      removeFavorite.mutate(quote.id);
    } else {
      addFavorite.mutate(quote.id);
      toast.success("Added to favorites ✨");
    }
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
    <div className="flex items-center gap-2">
      <motion.button
        data-ocid={favoriteToggleOcid}
        onClick={handleFavoriteToggle}
        className={`${btnClass} heart-btn ${isFavorited ? "favorited" : ""}`}
        whileTap={{ scale: 0.85 }}
        animate={isFavorited ? { scale: [1, 1.25, 0.9, 1] } : { scale: 1 }}
        transition={{ duration: 0.35 }}
        aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}
        aria-pressed={isFavorited}
      >
        <Heart
          size={iconSize}
          strokeWidth={1.8}
          className={isFavorited ? "text-destructive" : "text-muted-foreground"}
          fill={isFavorited ? "oklch(0.65 0.22 25)" : "none"}
        />
      </motion.button>

      <motion.button
        data-ocid={shareOcid}
        onClick={handleShare}
        className={btnClass}
        whileTap={{ scale: 0.9 }}
        aria-label="Share this quote"
      >
        <Share2
          size={iconSize}
          strokeWidth={1.8}
          className="text-muted-foreground hover:text-foreground transition-colors"
        />
      </motion.button>
    </div>
  );
}
