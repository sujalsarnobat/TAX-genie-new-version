import React, { useState, useMemo } from "react";
import "./WavyNavLink.css";

/**
 * WavyNavLink - Nav link with wavy character animation and underline on hover
 * Inspired by Framer component
 */
const WavyNavLink = ({
  label = "About Us",
  onClick,
  href,
  textColor = "#f5f5f5",
  hoverColor = "#ffffff",
  underlineColor = "#ffffff",
  fontSize = "0.9rem",
  fontWeight = 500,
  showUnderline = true,
  className = "",
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const chars = useMemo(
    () => Array.from(label || "").map((c) => (c === " " ? "\u00a0" : c)),
    [label]
  );

  const handleClick = (e) => {
    if (onClick) {
      onClick(e);
    }
  };

  return (
    <a
      className={`wavy-nav-link ${className}`}
      href={href}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        "--text-color": textColor,
        "--hover-color": hoverColor,
        "--underline-color": underlineColor,
        "--font-size": fontSize,
        "--font-weight": fontWeight,
      }}
    >
      <span className="wavy-link-text">
        {chars.map((char, index) => (
          <span
            key={`${char}-${index}`}
            className={`wavy-char ${isHovered ? "wave" : ""}`}
            style={{
              animationDelay: `${index * 30}ms`,
              transitionDelay: `${index * 20}ms`,
            }}
          >
            {char}
          </span>
        ))}
      </span>
      {showUnderline && (
        <span className={`wavy-underline ${isHovered ? "expanded" : ""}`}></span>
      )}
    </a>
  );
};

export default WavyNavLink;
