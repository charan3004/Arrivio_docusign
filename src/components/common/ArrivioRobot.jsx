import "./ArrivioRobot.css";
import neutralRobot from "../../assets/robot/robo-hi.png";

export default function ArrivioRobot() {
  return (
    <div className="robot-wrapper">
      {/* Speech Bubble */}
      <div className="robot-bubble">
        Hey there, I can assist you :)
      </div>

      {/* Floating Robot */}
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
