import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  MessageSquare,
  X,
  Send,
  Bot,
  User,
  Sparkles,
  RotateCcw,
  ChevronDown,
} from "lucide-react";
import axios from "axios";
import "./Chatbot.css";

const QUICK_QUESTIONS = [
  { label: "Old vs New Regime?", text: "Which tax regime is better for me — Old or New? Compare them for AY 2025-26." },
  { label: "80C Investments", text: "What are the best Section 80C tax saving investment options?" },
  { label: "HRA Exemption", text: "How do I calculate HRA exemption under Section 10(13A)?" },
  { label: "Section 87A Rebate", text: "What is the Section 87A rebate for AY 2025-26 under both regimes?" },
  { label: "NPS Benefits", text: "What are the tax benefits of investing in NPS under Section 80CCD?" },
  { label: "ITR Filing Guide", text: "How do I file ITR-1 online? Give me a step-by-step guide." },
];

const WELCOME_MSG = {
  role: "model",
  text: "Hi! I'm **TaxSarthi AI** 🤖\n\nI can help you with Indian income tax queries — regime comparison, deductions, HRA, ITR filing, and more.\n\nAsk me anything or pick a quick question below!",
};

function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([WELCOME_MSG]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const messagesEndRef = useRef(null);
  const chatBodyRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen, messages, scrollToBottom]);

  // Track scroll position to show/hide scroll-to-bottom button
  const handleScroll = () => {
    if (!chatBodyRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = chatBodyRef.current;
    setShowScrollBtn(scrollHeight - scrollTop - clientHeight > 100);
  };

  // Build Gemini-compatible history from messages (skip welcome)
  const buildHistory = () => {
    return messages
      .slice(1) // skip welcome message
      .map((m) => ({
        role: m.role === "model" ? "model" : "user",
        parts: [{ text: m.text }],
      }));
  };

  const sendMessage = async (text) => {
    if (!text.trim() || loading) return;

    const userMsg = { role: "user", text: text.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const history = buildHistory();
      const res = await axios.post("http://localhost:8000/api/chat", {
        message: text.trim(),
        history,
      });

      const botMsg = { role: "model", text: res.data.reply };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      const status = err.response?.status;
      let errorText;
      if (status === 429) {
        errorText = "Rate limit reached — please wait a minute and try again.";
      } else if (status === 403) {
        errorText = "AI service is temporarily unavailable. Please try later.";
      } else {
        errorText =
          err.response?.data?.message ||
          "Sorry, I couldn't process that. Please try again.";
      }
      setMessages((prev) => [
        ...prev,
        { role: "model", text: `⚠️ ${errorText}` },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleQuickQuestion = (text) => {
    sendMessage(text);
  };

  const resetChat = () => {
    setMessages([WELCOME_MSG]);
    setInput("");
  };

  // Simple markdown-ish renderer (bold, bullets, newlines)
  const renderText = (text) => {
    return text.split("\n").map((line, i) => {
      // Bold: **text**
      let rendered = line.replace(
        /\*\*(.*?)\*\*/g,
        '<strong>$1</strong>'
      );
      // Bullet points
      if (rendered.startsWith("- ") || rendered.startsWith("• ")) {
        rendered = `<span class="chat-bullet">•</span> ${rendered.slice(2)}`;
      }
      // Numbered lists
      const numMatch = rendered.match(/^(\d+)\.\s/);
      if (numMatch) {
        rendered = `<span class="chat-num">${numMatch[1]}.</span> ${rendered.slice(numMatch[0].length)}`;
      }
      return (
        <div
          key={i}
          className="chat-line"
          dangerouslySetInnerHTML={{ __html: rendered || "&nbsp;" }}
        />
      );
    });
  };

  return (
    <>
      {/* Floating Button */}
      <button
        className={`chatbot-fab ${isOpen ? "chatbot-fab-hidden" : ""}`}
        onClick={() => setIsOpen(true)}
        aria-label="Open TaxSarthi AI Chat"
      >
        <MessageSquare size={24} />
        <span className="chatbot-fab-pulse" />
      </button>

      {/* Chat Window */}
      <div className={`chatbot-window ${isOpen ? "chatbot-open" : ""}`}>
        {/* Header */}
        <div className="chatbot-header">
          <div className="chatbot-header-left">
            <div className="chatbot-avatar">
              <Bot size={18} />
            </div>
            <div>
              <h4 className="chatbot-title">TaxSarthi AI</h4>
              <span className="chatbot-status">
                <span className="chatbot-dot" /> Online
              </span>
            </div>
          </div>
          <div className="chatbot-header-actions">
            <button
              className="chatbot-icon-btn"
              onClick={resetChat}
              title="New Chat"
            >
              <RotateCcw size={16} />
            </button>
            <button
              className="chatbot-icon-btn"
              onClick={() => setIsOpen(false)}
              title="Close"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div
          className="chatbot-body"
          ref={chatBodyRef}
          onScroll={handleScroll}
        >
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`chat-msg ${msg.role === "user" ? "chat-user" : "chat-bot"}`}
            >
              <div className="chat-msg-icon">
                {msg.role === "user" ? (
                  <User size={14} />
                ) : (
                  <Sparkles size={14} />
                )}
              </div>
              <div className="chat-msg-bubble">{renderText(msg.text)}</div>
            </div>
          ))}

          {/* Typing indicator */}
          {loading && (
            <div className="chat-msg chat-bot">
              <div className="chat-msg-icon">
                <Sparkles size={14} />
              </div>
              <div className="chat-msg-bubble chat-typing">
                <span className="typing-dot" />
                <span className="typing-dot" />
                <span className="typing-dot" />
              </div>
            </div>
          )}

          {/* Quick questions (show only after welcome, before any user msg) */}
          {messages.length === 1 && !loading && (
            <div className="chat-quick-questions">
              {QUICK_QUESTIONS.map((q, i) => (
                <button
                  key={i}
                  className="chat-quick-btn"
                  onClick={() => handleQuickQuestion(q.text)}
                >
                  {q.label}
                </button>
              ))}
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Scroll to bottom button */}
        {showScrollBtn && (
          <button className="chatbot-scroll-btn" onClick={scrollToBottom}>
            <ChevronDown size={16} />
          </button>
        )}

        {/* Input */}
        <form className="chatbot-input-area" onSubmit={handleSubmit}>
          <input
            ref={inputRef}
            type="text"
            className="chatbot-input"
            placeholder="Ask about taxes..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
          />
          <button
            type="submit"
            className="chatbot-send-btn"
            disabled={!input.trim() || loading}
          >
            <Send size={16} />
          </button>
        </form>

        <div className="chatbot-footer-text">
          Powered by Gemini AI · Not financial advice
        </div>
      </div>
    </>
  );
}

export default Chatbot;
