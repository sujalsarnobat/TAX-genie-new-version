import React, { useState, useEffect } from "react";
import "./Carousel3D.css";
import { 
  Sparkles, 
  FileText, 
  Calculator, 
  Shield, 
  TrendingUp, 
  Zap 
} from "lucide-react";

const taxFeatures = [
  {
    id: 1,
    title: "AI Tax Genie",
    desc: "Conversational tax advice powered by advanced AI. Get instant answers to complex tax queries.",
    icon: <Sparkles size={40} />,
    gradient: "linear-gradient(135deg, #4ADE80 0%, #22c55e 100%)"
  },
  {
    id: 2,
    title: "Smart Form 16 Parser",
    desc: "Upload your Form 16 PDF and watch as we auto-fill your entire tax return in seconds.",
    icon: <FileText size={40} />,
    gradient: "linear-gradient(135deg, #8B5CF6 0%, #7c3aed 100%)"
  },
  {
    id: 3,
    title: "Regime Comparison",
    desc: "Instantly compare Old vs New tax regime. See exactly which one saves you more money.",
    icon: <Calculator size={40} />,
    gradient: "linear-gradient(135deg, #F59E0B 0%, #d97706 100%)"
  },
  {
    id: 4,
    title: "Notice Interpreter",
    desc: "Decode complex IT notices with our AI. Understand what the tax department wants from you.",
    icon: <Shield size={40} />,
    gradient: "linear-gradient(135deg, #EC4899 0%, #db2777 100%)"
  },
  {
    id: 5,
    title: "Tax Optimization",
    desc: "Get personalized recommendations to maximize your deductions and minimize tax liability.",
    icon: <TrendingUp size={40} />,
    gradient: "linear-gradient(135deg, #06B6D4 0%, #0891b2 100%)"
  },
  {
    id: 6,
    title: "Instant Filing",
    desc: "File your ITR directly with the Income Tax Department. Fast, secure, and hassle-free.",
    icon: <Zap size={40} />,
    gradient: "linear-gradient(135deg, #EF4444 0%, #dc2626 100%)"
  }
];

function Carousel3D() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % taxFeatures.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const getCardStyle = (index) => {
    const total = taxFeatures.length;
    const diff = index - activeIndex;
    
    // Normalize the difference to handle wrap-around
    let normalizedDiff = diff;
    if (diff > total / 2) normalizedDiff = diff - total;
    if (diff < -total / 2) normalizedDiff = diff + total;

    const absIdx = Math.abs(normalizedDiff);
    
    // Calculate transforms
    const rotateY = normalizedDiff * 45;
    const translateX = normalizedDiff * 280;
    const translateZ = -absIdx * 150;
    const scale = 1 - absIdx * 0.12;
    // Keep higher opacity for better text visibility
    const opacity = absIdx <= 2 ? 1 - absIdx * 0.2 : 0;
    const zIndex = total - absIdx;

    return {
      transform: `
        translateX(${translateX}px) 
        translateZ(${translateZ}px) 
        rotateY(${rotateY}deg) 
        scale(${Math.max(scale, 0.6)})
      `,
      opacity: Math.max(opacity, 0.3),
      zIndex,
      pointerEvents: absIdx === 0 ? 'auto' : 'none'
    };
  };

  const handleCardClick = (index) => {
    setActiveIndex(index);
    setIsAutoPlaying(false);
    // Resume auto-play after 10 seconds
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + taxFeatures.length) % taxFeatures.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % taxFeatures.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  return (
    <section className="carousel-section">
      <div className="carousel-header">
        <span className="carousel-badge">Why Choose Us</span>
        <h2 className="carousel-title">Powerful Features for Smart Tax Filing</h2>
        <p className="carousel-subtitle">
          Experience the future of tax filing with AI-powered tools designed for the modern taxpayer
        </p>
      </div>

      <div className="carousel-container">
        <div className="carousel-viewport">
          <div className="carousel-track">
            {taxFeatures.map((feature, index) => (
              <div
                key={feature.id}
                className={`carousel-card ${index === activeIndex ? 'active' : ''}`}
                style={getCardStyle(index)}
                onClick={() => handleCardClick(index)}
              >
                <div className="card-glow" style={{ background: feature.gradient }} />
                <div className="card-icon" style={{ background: feature.gradient }}>
                  {feature.icon}
                </div>
                <h3 className="card-title">{feature.title}</h3>
                <p className="card-desc">{feature.desc}</p>
                <div className="card-cta">
                  <span>Learn more</span>
                  <span className="cta-arrow">→</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Arrows */}
        <button className="carousel-nav prev" onClick={handlePrev}>
          <span>←</span>
        </button>
        <button className="carousel-nav next" onClick={handleNext}>
          <span>→</span>
        </button>

        {/* Dots */}
        <div className="carousel-dots">
          {taxFeatures.map((_, index) => (
            <button
              key={index}
              className={`dot ${index === activeIndex ? 'active' : ''}`}
              onClick={() => handleCardClick(index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default Carousel3D;
