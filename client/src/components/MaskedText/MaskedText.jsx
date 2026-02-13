import React, { useEffect, useRef } from "react";
import "./MaskedText.css";

/**
 * MaskedText Component
 * Creates a stunning text effect where an image/video shows through the text
 * Similar to Framer's ImageMaskText component
 */
const MaskedText = ({
  text = "taxworthy",
  fontSize = "clamp(5rem, 20vw, 15rem)",
  fontWeight = 700,
  fontFamily = "var(--font-serif)",
  letterSpacing = "-0.04em",
  imageSrc = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1920&q=80",
  videoSrc = null,
  className = "",
  animate = true,
  animationDuration = 20,
  animationDirection = "alternate",
  overlay = true,
  overlayGradient = "linear-gradient(135deg, rgba(74, 222, 128, 0.3), rgba(59, 130, 246, 0.3), rgba(168, 85, 247, 0.3))",
}) => {
  const containerRef = useRef(null);

  useEffect(() => {
    // Add scroll-based parallax effect
    const handleScroll = () => {
      if (!containerRef.current) return;
      const scrollY = window.scrollY;
      const rect = containerRef.current.getBoundingClientRect();
      
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        const progress = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
        const offset = (progress - 0.5) * 50;
        containerRef.current.style.setProperty('--parallax-offset', `${offset}px`);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const textStyle = {
    fontSize,
    fontWeight,
    fontFamily,
    letterSpacing,
  };

  return (
    <div 
      ref={containerRef}
      className={`masked-text-container ${className} ${animate ? 'animate-bg' : ''}`}
      style={{
        '--animation-duration': `${animationDuration}s`,
        '--animation-direction': animationDirection,
      }}
    >
      {/* Background Media (Image or Video) */}
      <div className="masked-text-media">
        {videoSrc ? (
          <video
            className="masked-text-video"
            autoPlay
            loop
            muted
            playsInline
          >
            <source src={videoSrc} type="video/mp4" />
          </video>
        ) : (
          <div 
            className="masked-text-image"
            style={{ backgroundImage: `url(${imageSrc})` }}
          />
        )}
        {overlay && (
          <div 
            className="masked-text-overlay"
            style={{ background: overlayGradient }}
          />
        )}
      </div>

      {/* The Masked Text */}
      <div className="masked-text-wrapper">
        <span className="masked-text" style={textStyle}>
          {text}
        </span>
      </div>

      {/* Glow Effects */}
      <div className="masked-text-glow"></div>
    </div>
  );
};

export default MaskedText;
