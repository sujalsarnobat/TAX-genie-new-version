import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CardShowcase.css";
import { Calculator, FileText, PiggyBank, HelpCircle, ArrowRight } from "lucide-react";

const guides = [
  {
    id: 1,
    title: "Tax Calculator",
    description: "Compare Old vs New tax regime and find which saves you more money instantly.",
    icon: <Calculator size={32} />,
    color: "#4ADE80",
    progress: 100,
    link: "/tax-calculator"
  },
  {
    id: 2,
    title: "Types of Taxes",
    description: "Understand different tax categories - Income Tax, GST, Capital Gains, and more.",
    icon: <FileText size={32} />,
    color: "#8B5CF6",
    progress: 85,
    link: "/taxes/types-of-taxes"
  },
  {
    id: 3,
    title: "Smart Savings",
    description: "Maximize your deductions under 80C, 80D, HRA, and other sections legally.",
    icon: <PiggyBank size={32} />,
    color: "#F59E0B",
    progress: 70,
    link: "/taxes/save-taxes"
  },
  {
    id: 4,
    title: "Common Questions",
    description: "Get answers to frequently asked tax queries from our expert database.",
    icon: <HelpCircle size={32} />,
    color: "#EC4899",
    progress: 55,
    link: "/taxes/FAQs"
  }
];

function CardShowcase() {
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(0); // First card active by default

  const handleCardClick = (index) => {
    setActiveIndex(index);
  };

  const handleNavigate = (link, e) => {
    e.stopPropagation();
    navigate(link);
  };

  return (
    <section className="card-showcase-section">
      <div className="card-showcase-header">
        <span className="showcase-badge">Resources</span>
        <h2 className="showcase-title">Explore Our Guides</h2>
        <p className="showcase-subtitle">
          Everything you need to master your taxes
        </p>
      </div>

      <div className="cards-accordion-container">
        {guides.map((guide, index) => (
          <div
            key={guide.id}
            className={`accordion-card ${activeIndex === index ? 'active' : 'inactive'}`}
            onClick={() => handleCardClick(index)}
            style={{ '--card-color': guide.color }}
          >
            {/* Card Glow */}
            <div 
              className="accordion-card-glow" 
              style={{ background: guide.color }}
            />

            {/* Progress Ring */}
            <div className="accordion-progress-ring">
              <svg className="progress-ring-svg" viewBox="0 0 100 100">
                <circle
                  className="progress-ring-bg"
                  cx="50"
                  cy="50"
                  r="42"
                />
                <circle
                  className="progress-ring-fill"
                  cx="50"
                  cy="50"
                  r="42"
                  style={{
                    stroke: guide.color,
                    strokeDasharray: `${guide.progress * 2.64} 264`,
                  }}
                />
              </svg>
              <div 
                className="progress-icon"
                style={{ color: guide.color }}
              >
                {guide.icon}
              </div>
            </div>

            {/* Card Content */}
            <div className="accordion-card-content">
              <h3 className="accordion-card-title">{guide.title}</h3>
              <p className="accordion-card-desc">{guide.description}</p>
              
              {/* Progress Bar */}
              <div className="accordion-progress-bar">
                <div className="progress-bar-bg">
                  <div 
                    className="progress-bar-fill"
                    style={{ 
                      width: `${guide.progress}%`,
                      background: guide.color 
                    }}
                  />
                </div>
                <span className="progress-percent">{guide.progress}%</span>
              </div>

              <button 
                className="accordion-card-btn"
                onClick={(e) => handleNavigate(guide.link, e)}
              >
                <span>Read More</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default CardShowcase;
