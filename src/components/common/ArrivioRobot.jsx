import { useEffect, useState, useRef } from "react";
import "./ArrivioRobot.css";
import "./ChatPanel.css";
import neutralRobot from "../../assets/robot/robo-hi.png";

export default function ArrivioRobot() {
  const [visible, setVisible] = useState(false);
  const [showBubble, setShowBubble] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);

  const panelRef = useRef(null);

  const triggerBubble = () => {
    if (chatOpen) return; // Prevent bubble if chat is open

    setShowBubble(true);
    setVisible(true);

    setTimeout(() => {
      setVisible(false);
      setTimeout(() => {
        setShowBubble(false);
      }, 600); // matches CSS fade duration
    }, 4000);
  };

  useEffect(() => {
    triggerBubble();
  }, []);

  // Close chat when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        chatOpen &&
        panelRef.current &&
        !panelRef.current.contains(event.target)
      ) {
        setChatOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [chatOpen]);

  const handleRobotClick = () => {
    setChatOpen((prev) => !prev);
    setShowBubble(false);
    setVisible(false);
  };

  return (
    <div
      className="robot-wrapper"
      onMouseEnter={triggerBubble}
      onClick={handleRobotClick}
    >
      {/* Speech Bubble */}
      {showBubble && (
        <div className={`robot-bubble ${visible ? "fade-in" : "fade-out"}`}>
          Hey there, I can assist you :)
        </div>
      )}

      {/* Chat Panel */}
      {chatOpen && (
        <div className="chat-panel" ref={panelRef}>
          <div className="chat-header">
            Arrivio Bot
          </div>

          <div className="chat-body">
            <p>Hello!</p>
            <p>How can I help you today?</p>
          </div>

          <div className="chat-input">
            <input placeholder="Type your message..." />
          </div>
        </div>
      )}

      {/* Robot */}
      <div className="robot-inner">
        <img
          src={neutralRobot}
          alt="Arrivio Bot"
          className="robot-image"
        />
      </div>
    </div>
  );
}
