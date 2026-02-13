import React, { useState, useMemo } from "react";
import "./SwipeLettersButton.css";

/**
 * SwipeLettersButton - A button with animated letter transitions on hover
 * Inspired by Framer component
 */
const SwipeLettersButton = ({
  label = "GET STARTED",
  onClick,
  defaultState = {
    bgColor: "transparent",
    borderColor: "#ffffff",
    textColor: "#ffffff",
  },
  hoverState = {
    bgColor: "rgba(255, 255, 255, 0.1)",
    borderColor: "#ffffff",
    textColor: "#ffffff",
  },
  radius = 9999,
  paddingX = 32,
  paddingY = 16,
  fontSize = "0.9rem",
  fontWeight = 500,
  letterSpacing = "0.15em",
  showBorder = true,
  direction = "alternate", // "top", "bottom", "alternate"
  duration = 380,
  easing = "cubic-bezier(.25,.75,.25,1)",
  stagger = 18,
  className = "",
}) => {
  const [hovered, setHovered] = useState(false);

  const chars = useMemo(
    () => Array.from(label || "").map((c) => (c === " " ? "\u00a0" : c)),
    [label]
  );

  const currentBgColor = hovered ? hoverState.bgColor : defaultState.bgColor;
  const currentBorderColor = hovered
    ? hoverState.borderColor
    : defaultState.borderColor;
  const currentTextColor = hovered
    ? hoverState.textColor
    : defaultState.textColor;

  return (
    <div
      className={`swipe-letters-button ${className}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
      style={{
        backgroundColor: currentBgColor,
        borderRadius: radius,
        border: showBorder ? `1px solid ${currentBorderColor}` : "none",
        padding: `${paddingY}px ${paddingX}px`,
        transition: "background-color 0.2s ease, border-color 0.2s ease",
      }}
    >
      <div
        className="swipe-letters-inner"
        style={{
          gap: `${parseFloat(letterSpacing) || 0.4}px`,
        }}
      >
        {chars.map((ch, i) => {
          const dir =
            direction === "alternate"
              ? i % 2 === 0
                ? "top"
                : "bottom"
              : direction;
          const initY = dir === "top" ? "-50%" : "0%";
          const hoverY = dir === "top" ? "0%" : "-50%";
          const delay = `${i * stagger}ms`;

          return (
            <span
              key={`${ch}-${i}`}
              className="swipe-letter-wrapper"
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: fontSize,
                fontWeight: fontWeight,
                letterSpacing: letterSpacing,
              }}
            >
              <span
                className="swipe-letter-grid"
                style={{
                  transform: `translateY(${hovered ? hoverY : initY})`,
                  transitionProperty: "transform",
                  transitionDuration: `${duration}ms`,
                  transitionTimingFunction: easing,
                  transitionDelay: delay,
                }}
              >
                <span
                  style={{
                    color: currentTextColor,
                    transition: "color 0.2s ease",
                  }}
                >
                  {ch}
                </span>
                <span
                  style={{
                    color: currentTextColor,
                    transition: "color 0.2s ease",
                  }}
                >
                  {ch}
                </span>
              </span>
            </span>
          );
        })}
      </div>
    </div>
  );
};

export default SwipeLettersButton;
