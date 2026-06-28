import { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./Chatbot.css";

export default function Chatbot() {
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hello 👋 How can I assist you today?" }
  ]);
  const [input, setInput] = useState("");
  const [open, setOpen] = useState(false);

  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = { sender: "user", text: input };
    setMessages(prev => [...prev, userMsg]);

    try {
      const res = await axios.post("http://localhost:5001/api/auth/chat", {
        message: input
      });

      const botMsg = { sender: "bot", text: res.data.reply };
      setMessages(prev => [...prev, botMsg]);
    } catch {
      setMessages(prev => [...prev, { sender: "bot", text: "Server error ❌" }]);
    }

    setInput("");
  };

  return (
    <>
      {/* Floating Button */}
      <div className="chatbot-toggle" onClick={() => setOpen(!open)}>
        💬
      </div>

      {/* Chat Window */}
      {open && (
        <div className="chatbot-container">
          {/* Header */}
          <div className="chatbot-header">
            DonateCare Assistant
          </div>

          {/* Messages */}
          <div className="chatbot-messages">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`chatbot-message ${
                  msg.sender === "user" ? "user" : "bot"
                }`}
              >
                {msg.text}
              </div>
            ))}
            <div ref={bottomRef}></div>
          </div>

          {/* Input */}
          <div className="chatbot-input">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && input.trim()) {
                  sendMessage();
                }
              }}
              placeholder="Type a message and press Enter..."
            />
            <button className="chatbot-send-btn" onClick={sendMessage}>
              ➤
            </button>
          </div>
        </div>
      )}
    </>
  );
}