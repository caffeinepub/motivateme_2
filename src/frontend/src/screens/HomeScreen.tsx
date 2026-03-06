import { Sparkles } from "lucide-react";
import { motion } from "motion/react";
import QuoteActions from "../components/QuoteActions";
import { useFavorites, useQuoteOfDay } from "../hooks/useQueries";

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export default function HomeScreen() {
  const { data: quote, isLoading } = useQuoteOfDay();
  const { data: favorites = [] } = useFavorites();

  const isFavorited = quote ? favorites.some((id) => id === quote.id) : false;

  return (
    <main data-ocid="home.page" className="px-4 pt-6 pb-4">
      {/* Header */}
      <motion.header
        className="flex items-center justify-between mb-6"
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <div className="flex items-center gap-2.5">
          <img
            src="/assets/generated/motivateme-logo-transparent.dim_120x120.png"
            alt="MotivateMe logo"
            className="w-9 h-9 object-contain"
          />
          <div>
            <h1 className="font-display font-bold text-lg leading-tight gradient-text">
              MotivateMe
            </h1>
            <p className="text-[10px] text-muted-foreground font-body tracking-wider uppercase">
              Daily Success Tips
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted/40 border border-border">
          <Sparkles size={12} className="text-gold" />
          <span className="text-[11px] font-body text-muted-foreground">
            Daily
          </span>
        </div>
      </motion.header>

      {/* Greeting */}
      <motion.div
        className="mb-5"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <p className="text-sm font-body text-muted-foreground">
          {getGreeting()}! ✨
        </p>
        <p className="text-base font-body font-medium text-foreground/90 leading-snug mt-0.5">
          Here&apos;s your daily dose of motivation
        </p>
      </motion.div>

      {/* Quote of the Day Hero Card */}
      {isLoading ? (
        <div
          data-ocid="home.loading_state"
          className="rounded-2xl p-6 space-y-4 quote-hero-card"
        >
          <div className="skeleton h-4 w-24 mb-2" />
          <div className="skeleton h-5 w-full" />
          <div className="skeleton h-5 w-5/6" />
          <div className="skeleton h-5 w-4/6" />
          <div className="skeleton h-4 w-32 mt-4" />
        </div>
      ) : quote ? (
        <motion.div
          className="quote-hero-card rounded-2xl p-6 shadow-card-glow"
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.45, delay: 0.15, ease: "easeOut" }}
        >
          {/* Label */}
          <div className="flex items-center gap-1.5 mb-4">
            <Sparkles size={11} className="text-gold" />
            <span className="text-[11px] font-display font-semibold text-gold tracking-widest uppercase">
              Quote of the Day
            </span>
          </div>

          {/* Quote text */}
          <blockquote className="relative mb-6">
            {/* Big decorative quote mark */}
            <span
              className="block font-serif leading-none select-none mb-2"
              aria-hidden="true"
              style={{
                fontSize: "5rem",
                lineHeight: 0.8,
                color: "oklch(0.82 0.16 80)",
                opacity: 0.55,
                marginLeft: "-0.15rem",
                letterSpacing: "-0.05em",
              }}
            >
              &ldquo;
            </span>
            <p
              className="quote-text text-foreground leading-relaxed"
              style={{ fontSize: "clamp(1.15rem, 4vw, 1.35rem)" }}
            >
              {quote.text}
            </p>
          </blockquote>

          {/* Divider */}
          <div
            className="mb-4"
            style={{
              height: "1px",
              background:
                "linear-gradient(90deg, oklch(0.82 0.16 80 / 0.3), transparent)",
            }}
          />

          {/* Author & actions */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-display font-bold text-gold tracking-wide">
                {quote.author}
              </p>
              <p className="text-[10px] text-muted-foreground font-body mt-0.5 tracking-wider uppercase">
                {quote.category || "Inspiration"}
              </p>
            </div>
            <QuoteActions
              quote={quote}
              isFavorited={isFavorited}
              favoriteToggleOcid="home.quote.toggle"
              shareOcid="home.quote.button"
              size="lg"
            />
          </div>
        </motion.div>
      ) : null}

      {/* Tips section */}
      <motion.section
        className="mt-6"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
      >
        <h2 className="font-display font-semibold text-sm text-muted-foreground uppercase tracking-widest mb-3">
          Quick Tips
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {QUICK_TIPS.map((tip) => (
            <div
              key={tip.emoji}
              className="rounded-xl p-3.5 border border-border bg-card animate-fade-up"
            >
              <span className="text-xl mb-2 block">{tip.emoji}</span>
              <p className="text-xs font-body font-medium text-foreground leading-snug">
                {tip.text}
              </p>
            </div>
          ))}
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="mt-8 text-center">
        <p className="text-[11px] text-muted-foreground font-body">
          © {new Date().getFullYear()}. Built with{" "}
          <span className="text-destructive">♥</span> using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gold hover:text-gold/80 transition-colors underline underline-offset-2"
          >
            caffeine.ai
          </a>
        </p>
      </footer>
    </main>
  );
}

const QUICK_TIPS = [
  { emoji: "🎯", text: "Set one clear goal for today and stick to it." },
  { emoji: "📚", text: "Read 10 pages daily — knowledge compounds over time." },
  { emoji: "💪", text: "Consistency beats perfection every single day." },
  { emoji: "🌱", text: "Small steps forward are still progress. Keep going." },
];
