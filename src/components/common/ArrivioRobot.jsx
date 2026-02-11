import { useEffect, useState } from "react";
import "./ArrivioRobot.css";
import neutralRobot from "../../assets/robot/robo-hi.png";

export default function ArrivioRobot() {
  const [visible, setVisible] = useState(false);
  const [showBubble, setShowBubble] = useState(false);

  const triggerBubble = () => {
    setShowBubble(true);
    setVisible(true);

    setTimeout(() => {
      setVisible(false); // start fade out
      setTimeout(() => {
        setShowBubble(false); // remove from DOM after fade
      }, 300); // match CSS fade duration
    }, 4000);
  };

  useEffect(() => {
    triggerBubble();
  }, []);

  return (
    <div className="robot-wrapper" onMouseEnter={triggerBubble}>
      {showBubble && (
        <div className={`robot-bubble ${visible ? "fade-in" : "fade-out"}`}>
          Hey there, I can assist you :)
        </div>
      )}

      <div className="robot-inner">
        <img
          src={neutralRobot}
          alt="Arrivio Assistant"
          className="robot-image"
        />
      </div>
    </div>
  );
}
