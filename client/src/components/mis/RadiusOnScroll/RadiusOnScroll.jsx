import React, { useState, useEffect, useRef, useCallback } from "react";
import "./RadiusOnScroll.css";

/**
 * RadiusOnScroll - Animates border-radius and padding based on scroll position
 * Inspired by Framer component
 */

const getWindowHeight = () =>
  typeof window !== "undefined" ? window.innerHeight : 1000;

const getTriggerPosition = (trigger, elementTop, elementHeight) => {
  const windowHeight = getWindowHeight();
  switch (trigger) {
    case "enter-top":
      return elementTop - windowHeight;
    case "enter-center":
      return elementTop + elementHeight / 2 - windowHeight;
    case "enter-bottom":
      return elementTop + elementHeight - windowHeight;
    case "exit-top":
      return elementTop;
    case "exit-center":
      return elementTop + elementHeight / 2;
    case "exit-bottom":
      return elementTop + elementHeight;
    default:
      return elementTop - windowHeight;
  }
};

const clamp01 = (v) => Math.min(Math.max(v, 0), 1);
const lerp = (a, b, t) => a + (b - a) * t;

const RadiusOnScroll = ({
  children,
  src,
  alt = "",
  mediaType = "image", // "image" or "video"
  videoUrl,
  poster,
  startRadius = 0,
  endRadius = 48,
  startPadding = 0,
  endPadding = 0,
  startTrigger = "enter-bottom", // when animation starts
  endTrigger = "exit-center", // when animation ends
  offset = 0,
  transformDistance = 100,
  autoPlay = true,
  loop = true,
  muted = true,
  className = "",
  style = {},
}) => {
  const containerRef = useRef(null);
  const [progress, setProgress] = useState(0);

  const computeRange = useCallback(() => {
    if (!containerRef.current) return [0, 1];

    const rect = containerRef.current.getBoundingClientRect();
    const scrollTop =
      window.scrollY || document.documentElement.scrollTop || 0;
    const elementTop = rect.top + scrollTop;
    const elementHeight = rect.height;

    let s = getTriggerPosition(startTrigger, elementTop, elementHeight) + offset;
    let e = getTriggerPosition(endTrigger, elementTop, elementHeight) + offset;

    const dist = Math.abs(e - s);
    const adjusted = (dist * transformDistance) / 100;
    const center = (s + e) / 2;
    s = center - adjusted / 2;
    e = center + adjusted / 2;

    if (e <= s) e = s + 1;
    return [s, e];
  }, [startTrigger, endTrigger, offset, transformDistance]);

  useEffect(() => {
    let rafId = null;
    const latestProgress = { current: progress };

    const tick = () => {
      const [s, e] = computeRange();
      const scrollTop =
        window.scrollY || document.documentElement.scrollTop || 0;
      const raw = (scrollTop - s) / (e - s);
      const target = clamp01(raw);

      if (Math.abs(target - latestProgress.current) > 0.001) {
        latestProgress.current = target;
        setProgress(target);
      }

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, [computeRange, progress]);

  const currentRadius = Math.round(lerp(startRadius, endRadius, progress) * 100) / 100;
  const currentPadding = Math.round(lerp(startPadding, endPadding, progress) * 100) / 100;

  const containerStyle = {
    ...style,
    borderRadius: `${currentRadius}px`,
    padding: `${currentPadding}px`,
    overflow: "hidden",
    transition: "none",
  };

  return (
    <div
      ref={containerRef}
      className={`radius-on-scroll ${className}`}
      style={containerStyle}
    >
      <div className="radius-on-scroll-inner">
        {children ? (
          children
        ) : mediaType === "image" && src ? (
          <img src={src} alt={alt} draggable={false} />
        ) : mediaType === "video" && (src || videoUrl) ? (
          <video
            src={src || videoUrl}
            poster={poster}
            autoPlay={autoPlay}
            loop={loop}
            muted={muted}
            playsInline
          />
        ) : null}
      </div>
    </div>
  );
};

export default RadiusOnScroll;
