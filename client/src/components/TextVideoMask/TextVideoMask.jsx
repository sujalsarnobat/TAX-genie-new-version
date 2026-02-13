import React, { useRef, useEffect } from "react";
import "./TextVideoMask.css";

/**
 * TextVideoMask Component
 * Creates a stunning effect where video plays through text as a mask
 * Similar to Framer's TextVideoMask component
 */
const TextVideoMask = ({
  text = "taxworthy",
  subText = "",
  videoSrc = "https://videos.pexels.com/video-files/3129671/3129671-uhd_2560_1440_30fps.mp4",
  fallbackImage = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1920&q=80",
  fontSize = "clamp(4rem, 15vw, 12rem)",
  subFontSize = "clamp(1rem, 2vw, 1.3rem)",
  fontWeight = 700,
  fontFamily = "var(--font-serif)",
  letterSpacing = "-0.04em",
  lineHeight = 1,
  textTransform = "lowercase",
  className = "",
}) => {
  const videoRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    // Ensure video plays
    if (videoRef.current) {
      videoRef.current.play().catch(() => {
        // Autoplay failed, likely due to browser restrictions
        console.log("Video autoplay prevented by browser");
      });
    }
  }, []);

  const textStyle = {
    fontSize,
    fontWeight,
    fontFamily,
    letterSpacing,
    lineHeight,
    textTransform,
  };

  const subTextStyle = {
    fontSize: subFontSize,
  };

  return (
    <div ref={containerRef} className={`text-video-mask-container ${className}`}>
      {/* Video Background */}
      <div className="text-video-mask-media">
        <video
          ref={videoRef}
          className="text-video-mask-video"
          autoPlay
          loop
          muted
          playsInline
          poster={fallbackImage}
        >
          <source src={videoSrc} type="video/mp4" />
        </video>
        {/* Gradient overlay for better text contrast */}
        <div className="text-video-mask-gradient"></div>
      </div>

      {/* Text with clip-path/background-clip effect */}
      <div className="text-video-mask-content">
        <h1 className="text-video-mask-heading" style={textStyle}>
          {text}
        </h1>
        {subText && (
          <p className="text-video-mask-subtext" style={subTextStyle}>
            {subText}
          </p>
        )}
      </div>

      {/* Ambient glow */}
      <div className="text-video-mask-glow"></div>
    </div>
  );
};

export default TextVideoMask;
