import React, { useState } from "react";
import "./CircleExpandButton.css";
import { FaArrowRight } from "react-icons/fa";

/**
 * CircleExpandButton - Button with expanding circle animation on hover
 * Inspired by Framer component
 */
const CircleExpandButton = ({
  children,
  text = "Button text",
  onClick,
  className = "",
  bgColor = "transparent",
  hoverBgColor = "#ffffff",
  textColor = "#ffffff",
  hoverTextColor = "#0e0e0e",
  borderColor = "#ffffff",
  showArrow = true,
  arrowSize = 14,
  style = {},
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button
      className={`circle-expand-btn ${className}`}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        "--btn-bg": bgColor,
        "--btn-hover-bg": hoverBgColor,
        "--btn-text": textColor,
        "--btn-hover-text": hoverTextColor,
        "--btn-border": borderColor,
        ...style,
      }}
    >
      {/* Expanding circle */}
      <span className={`circle-expand ${isHovered ? "expanded" : ""}`}></span>

      {/* Button content */}
      <span className="btn-content">
        <span className="btn-text">{children || text}</span>
        {showArrow && (
          <span className="btn-arrow-wrapper">
            <span className="btn-arrow-circle">
              <FaArrowRight
                size={arrowSize}
                className="btn-arrow-icon"
                style={{
                  transform: isHovered ? "rotate(0deg)" : "rotate(-45deg)",
                }}
              />
            </span>
          </span>
        )}
      </span>
    </button>
  );
};

export default CircleExpandButton;
