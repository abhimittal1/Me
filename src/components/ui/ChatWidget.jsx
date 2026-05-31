import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Bot, User } from "lucide-react";

const API_BASE =
  process.env.REACT_APP_CHATBOT_API_URL || "http://localhost:8000";

const WELCOME = {
  role: "assistant",
  content:
    "Hi! I'm Abhishek's AI assistant. Ask me anything about his background, skills, projects, or experience — I'm here to help!",
};

// ── Typing dots ───────────────────────────────────────────────────────────────
function TypingIndicator() {
  return (
    <div className="flex items-end gap-2 max-w-[80%]">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--primary)] to-[var(--accent)] shadow-md">
        <Bot size={14} className="text-white" />
      </span>
      <div className="flex items-center gap-1.5 px-4 py-3 rounded-2xl rounded-bl-sm bg-[var(--card)] border border-[var(--border)]">
        {[0, 0.15, 0.3].map((delay, i) => (
          <motion.span
            key={i}
            className="block h-1.5 w-1.5 rounded-full bg-[var(--muted)]"
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 0.6, repeat: Infinity, delay, ease: "easeInOut" }}
          />
        ))}
      </div>
    </div>
  );
}

// ── Single message bubble ─────────────────────────────────────────────────────
function MessageBubble({ msg, index }) {
  const isUser = msg.role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.25, delay: index * 0.03, ease: [0.22, 1, 0.36, 1] }}
      className={`flex items-end gap-2 ${isUser ? "flex-row-reverse" : "flex-row"} max-w-[84%] ${isUser ? "ml-auto" : "mr-auto"}`}
    >
      {/* Avatar */}
      {!isUser && (
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--primary)] to-[var(--accent)] shadow-md self-end">
          <Bot size={14} className="text-white" />
        </span>
      )}
      {isUser && (
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-2xl bg-[var(--surface)] border border-[var(--border)] self-end">
          <User size={14} className="text-[var(--muted)]" />
        </span>
      )}

      {/* Bubble */}
      <div
        className={[
          "px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap break-words",
          isUser
            ? "rounded-2xl rounded-br-sm bg-gradient-to-br from-[var(--primary)] to-[var(--accent)] text-white shadow-md shadow-[var(--primary)]/20"
            : "rounded-2xl rounded-bl-sm bg-[var(--card)] border border-[var(--border)] text-[var(--text)]",
        ].join(" ")}
      >
        {msg.content}
      </div>
    </motion.div>
  );
}

// ── Main widget ───────────────────────────────────────────────────────────────
export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([WELCOME]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);
  const scrollRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setHasUnread(false);
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  const sendMessage = useCallback(async () => {
    const text = input.trim();
    if (!text || isLoading) return;

    const userMsg = { role: "user", content: text };
    const historyForApi = messages.slice(1); // exclude welcome msg for API history

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch(`${API_BASE}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          history: historyForApi.map(({ role, content }) => ({ role, content })),
        }),
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const data = await res.json();
      const botMsg = { role: "assistant", content: data.reply };
      setMessages((prev) => [...prev, botMsg]);

      if (!isOpen) setHasUnread(true);
    } catch (err) {
      console.error("Chat error:", err);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Sorry, I'm having trouble connecting right now. Please try again in a moment.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading, messages, isOpen]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* Chat window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="chat-window"
            initial={{ opacity: 0, y: 20, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.92 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="fixed bottom-24 right-6 z-[999] w-[360px] max-w-[calc(100vw-1.5rem)] flex flex-col rounded-3xl overflow-hidden shadow-2xl shadow-black/30 border border-[var(--border)]"
            style={{ height: "min(520px, calc(100dvh - 110px))" }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-5 py-4 shrink-0"
              style={{
                background:
                  "linear-gradient(135deg, var(--primary), var(--accent))",
              }}
            >
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
                  <Bot size={18} className="text-white" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-white leading-none">
                    Abhishek's Assistant
                  </p>
                  <p className="text-[11px] text-white/70 mt-0.5 flex items-center gap-1">
                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-300 animate-pulse" />
                    Online
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                aria-label="Close chat"
                className="flex h-8 w-8 items-center justify-center rounded-xl text-white/80 hover:text-white hover:bg-white/15 transition-all duration-200"
              >
                <X size={16} />
              </button>
            </div>

            {/* Messages */}
            <div
              ref={scrollRef}
              className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3 glass"
              style={{ scrollbarWidth: "thin" }}
            >
              {messages.map((msg, i) => (
                <MessageBubble key={i} msg={msg} index={i} />
              ))}
              {isLoading && <TypingIndicator />}
            </div>

            {/* Input */}
            <div className="shrink-0 px-4 py-3 glass border-t border-[var(--border)] flex items-center gap-2">
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask me anything…"
                aria-label="Chat input"
                disabled={isLoading}
                className="flex-1 min-w-0 bg-transparent text-sm text-[var(--text)] placeholder:text-[var(--muted)] outline-none disabled:opacity-50"
              />
              <button
                onClick={sendMessage}
                disabled={!input.trim() || isLoading}
                aria-label="Send message"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105 active:scale-95"
                style={{
                  background:
                    input.trim() && !isLoading
                      ? "linear-gradient(135deg, var(--primary), var(--accent))"
                      : "var(--surface)",
                }}
              >
                <Send
                  size={15}
                  className={
                    input.trim() && !isLoading
                      ? "text-white"
                      : "text-[var(--muted)]"
                  }
                />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating toggle button */}
      <motion.button
        onClick={() => setIsOpen((v) => !v)}
        aria-label={isOpen ? "Close chat" : "Open chat"}
        className="fixed bottom-8 right-6 z-[999] flex h-14 w-14 items-center justify-center rounded-2xl shadow-xl shadow-[var(--primary)]/30 hover:shadow-2xl hover:shadow-[var(--primary)]/40 hover:scale-110 active:scale-95 transition-shadow duration-300"
        style={{
          background:
            "linear-gradient(135deg, var(--primary), var(--accent))",
        }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
      >
        <AnimatePresence mode="wait" initial={false}>
          {isOpen ? (
            <motion.span
              key="x"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.18 }}
            >
              <X size={22} className="text-white" />
            </motion.span>
          ) : (
            <motion.span
              key="chat"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.18 }}
            >
              <MessageCircle size={22} className="text-white" />
            </motion.span>
          )}
        </AnimatePresence>

        {/* Unread dot */}
        <AnimatePresence>
          {hasUnread && !isOpen && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="absolute -top-1 -right-1 h-3.5 w-3.5 rounded-full bg-rose-500 border-2 border-[var(--bg)]"
            />
          )}
        </AnimatePresence>
      </motion.button>

      {/* Idle pulse ring (only when closed) */}
      {!isOpen && (
        <motion.span
          className="fixed bottom-8 right-6 z-[998] h-14 w-14 rounded-2xl pointer-events-none"
          style={{
            background:
              "linear-gradient(135deg, var(--primary), var(--accent))",
            opacity: 0.25,
          }}
          animate={{ scale: [1, 1.35, 1], opacity: [0.25, 0, 0.25] }}
          transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
        />
      )}
    </>
  );
}
