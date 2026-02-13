import React, { useState } from "react";
import "./header.css";
import { useNavigate } from "react-router-dom";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import ThemeToggle from "../ThemeToggle/ThemeToggle";
import WavyNavLink from "../mis/WavyNavLink/WavyNavLink";
import { FiChevronDown } from "react-icons/fi";

// Custom dropdown component with wavy nav link
const WavyDropdown = ({ label, items, navigate }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div 
      className="wavy-dropdown"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <div className="wavy-dropdown-trigger">
        <WavyNavLink
          label={label}
          textColor="#888888"
          hoverColor="#ffffff"
          underlineColor="#ffffff"
          fontSize="0.85rem"
          showUnderline={false}
        />
        <FiChevronDown 
          className={`dropdown-chevron ${isOpen ? "rotated" : ""}`}
          size={14}
        />
      </div>
      <div className={`wavy-dropdown-menu ${isOpen ? "open" : ""}`}>
        {items.map((item, index) => (
          <div 
            key={index}
            className="wavy-dropdown-item"
            onClick={() => navigate(item.path)}
          >
            {item.label}
          </div>
        ))}
      </div>
    </div>
  );
};

function Header() {
  const [expanded, setExpanded] = useState(false);

  const handleToggle = () => {
    setExpanded(!expanded);
  };
  const navigate = useNavigate();

  const navItems = [
    {
      label: "Calculator",
      items: [
        { label: "Tax Calculator", path: "/tax-calculator" },
        { label: "Old vs New Regime", path: "/tax-calculator" },
      ]
    },
    {
      label: "Taxes",
      items: [
        { label: "Getting Started", path: "/taxes/about-taxes" },
        { label: "Types Of Taxes", path: "/taxes/types-of-taxes" },
        { label: "What Are Taxes", path: "/taxes/what-are-taxes" },
      ]
    },
    {
      label: "Savings",
      items: [
        { label: "Smart Savings", path: "/taxes/save-taxes" },
        { label: "Tax Planning", path: "/taxes/tax-planning" },
      ]
    },
    {
      label: "Filing",
      items: [
        { label: "File Your Taxes", path: "/taxes/itr-filing" },
        { label: "Tax Notice", path: "/taxes/tax-notice" },
      ]
    },
    {
      label: "FAQs",
      items: [
        { label: "General FAQs", path: "/taxes/faqs" },
        { label: "Section 139(9)", path: "/taxes/section-139-9" },
        { label: "Section 142(1)", path: "/taxes/section-142-1" },
      ]
    },
  ];

  return (
    <Navbar collapseOnSelect expand="lg" className="header" expanded={expanded}>
      <div className="container">
        <Navbar.Brand
          onClick={() => {
            navigate("/");
          }}
        >
          <span className="navbar-brand-text">TaxSarthi</span>
        </Navbar.Brand>
        <Navbar.Toggle
          aria-controls="responsive-navbar-nav"
          onClick={handleToggle}
        />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="ml-auto nav-links-container">
            {navItems.map((navItem, index) => (
              <WavyDropdown
                key={index}
                label={navItem.label}
                items={navItem.items}
                navigate={navigate}
              />
            ))}
            <ThemeToggle />
          </Nav>
        </Navbar.Collapse>
      </div>
    </Navbar>
  );
}

export default Header;
