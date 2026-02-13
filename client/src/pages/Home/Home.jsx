/* eslint-disable jsx-a11y/img-redundant-alt */
import React, { useState } from "react";
import "./Home.css";
import { useNavigate } from "react-router-dom";
import Carousel from "../../components/mis/Carousel/Carousel";
import Marquee from "react-fast-marquee";
import FaqSec from "../../components/mis/FaqSec";
import Form from "react-bootstrap/Form";
import Card from "../../components/mis/Card/Card";
import { FaPlay } from "react-icons/fa";
import SwipeLettersButton from "../../components/mis/SwipeLettersButton/SwipeLettersButton";
import RadiusOnScroll from "../../components/mis/RadiusOnScroll/RadiusOnScroll";
import CircleExpandButton from "../../components/mis/CircleExpandButton/CircleExpandButton";
import heroBgVideo from "../../assets/hero-bg.mp4";
import Carousel3D from "../../components/Carousel3D/Carousel3D";
import CardShowcase from "../../components/CardShowcase/CardShowcase";

// Video Card Component with click-to-play functionality and scroll animation
const VideoCard = ({ videoId, title, description }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

  return (
    <div className="video-card">
      <RadiusOnScroll
        startRadius={0}
        endRadius={20}
        startTrigger="enter-bottom"
        endTrigger="enter-top"
        transformDistance={80}
        className="video-radius-wrapper"
      >
        <div className="iframe-container">
          {!isPlaying ? (
            <div 
              className="video-thumbnail" 
              onClick={() => setIsPlaying(true)}
              style={{ backgroundImage: `url(${thumbnailUrl})` }}
            >
              <div className="play-button">
                <FaPlay />
              </div>
            </div>
          ) : (
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
              title={title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            ></iframe>
          )}
        </div>
      </RadiusOnScroll>
      <h4 className="video-title">{title}</h4>
      <p className="video-description">{description}</p>
    </div>
  );
};

function Home() {
  const navigate = useNavigate();
  return (
    <>
      <section id="home" style={{ margin: "0" }}>
        {/* CRED-style Background Video */}
        <div className="hero-video-container">
          <video
            className="hero-video"
            autoPlay
            loop
            muted
            playsInline
          >
            <source src={heroBgVideo} type="video/mp4" />
          </video>
          <div className="hero-video-overlay"></div>
        </div>
        <div className="welcome-content">
          <div className="welcome-heading">
            crafted for the <span>taxworthy</span>
          </div>
          <div className="welcome-description">
            experience a new standard in tax filing. intelligent. secure. effortless.
          </div>
          <div className="steps">
            <div className="vr"></div>
            <div className="step step1">
              <div className="step-count">1</div>
              <div className="step-content">
                <div className="step-title">Create Account</div>
                <div className="step-description">
                  quick & secure signup
                </div>
              </div>
            </div>
            <div className="step step1">
              <div className="step-count">2</div>
              <div className="step-content">
                <div className="step-title">Connect Data</div>
                <div className="step-description">
                  automatic document import
                </div>
              </div>
            </div>
            <div className="step step1">
              <div className="step-count">3</div>
              <div className="step-content">
                <div className="step-title">File & Done</div>
                <div className="step-description">
                  one-click submission
                </div>
              </div>
            </div>
          </div>
          <SwipeLettersButton
            label="get started"
            onClick={() => navigate("/login")}
            className="get-started"
            defaultState={{
              bgColor: "transparent",
              borderColor: "#ffffff",
              textColor: "#ffffff",
            }}
            hoverState={{
              bgColor: "rgba(255, 255, 255, 0.08)",
              borderColor: "#ffffff",
              textColor: "#ffffff",
            }}
            radius={50}
            paddingX={48}
            paddingY={18}
            fontSize="0.85rem"
            fontWeight={500}
            letterSpacing="0.2em"
            duration={350}
            stagger={20}
            direction="alternate"
          />
        </div>
        <div className="welcome-image">
          <img
            src="https://images.unsplash.com/photo-1605170439002-90845e8c0137?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1932&q=80"
            alt="image.png"
          />
        </div>
      </section>

      {/* 3D Features Carousel */}
      <Carousel3D />

      <div className="home-div">
        <section id="home-tutorial">
          <p className="home-tutorial-text">
            understand your taxes
          </p>
          <p className="section-subtitle">
            curated guides to help you navigate Indian taxation
          </p>
          <div className="videos-grid">
            {/* Video 1: Tax Planning Guide */}
            <VideoCard
              videoId="MQpbxF_RngI"
              title="tax planning guide"
              description="essential strategies for smart tax planning"
            />

            {/* Video 2: Tax Saving Tips */}
            <VideoCard
              videoId="mT1mH8PVnDI"
              title="tax saving tips"
              description="maximize your savings with expert advice"
            />

            {/* Video 3: Income Tax Explained */}
            <VideoCard
              videoId="A9Xq3FGjpZA"
              title="income tax explained"
              description="understand income tax basics in simple terms"
            />

            {/* Video 4: ITR Filing Guide */}
            <VideoCard
              videoId="ISRY0MHxKuA"
              title="itr filing guide"
              description="step-by-step guide to file your returns"
            />
          </div>
        </section>
        
        {/* Card Showcase - Explore Our Guides */}
        <CardShowcase />
        
        <section id="home-stats">
          <div className="stats-title">trusted by millions</div>
          <div className="main-stats">
            <div className="stats-group">
              <div className="stats-amount">₹20Cr+</div>
              <div className="stats-heading">assets managed</div>
            </div>
            <div className="stats-group">
              <div className="stats-amount">₹50Cr+</div>
              <div className="stats-heading">taxes filed</div>
            </div>
            <div className="stats-group">
              <div className="stats-amount">₹30Cr+</div>
              <div className="stats-heading">taxes saved</div>
            </div>
          </div>
        </section>
        <section id="carousel">
          <Marquee speed={25} pauseOnHover={true} gradient gradientWidth={50}>
            <Carousel />
          </Marquee>
        </section>
        <section className="faq">
          <FaqSec />
        </section>
        <section id="queries">
          <div className="query-title">
            have questions?
          </div>
          <div className="query-box">
            <Form>
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label className="form-field-title">
                  email address
                </Form.Label>
                <Form.Control type="email" placeholder="your email" />
                <Form.Text className="text-muted" style={{ color: 'rgba(255,255,255,0.25)' }}>
                  we respect your privacy
                </Form.Text>
              </Form.Group>
              <Form.Group className="mb-4" controlId="querySubject">
                <Form.Label className="form-field-title">subject</Form.Label>
                <Form.Control type="text" placeholder="what's this about?" />
              </Form.Group>
              <Form.Group className="mb-3" controlId="queryDescription">
                <Form.Label className="form-field-title">
                  message
                </Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="tell us more..."
                />
              </Form.Group>
              <CircleExpandButton
                text="send message"
                bgColor="transparent"
                hoverBgColor="#ffffff"
                textColor="#ffffff"
                hoverTextColor="#0e0e0e"
                borderColor="#ffffff"
                showArrow={true}
                onClick={(e) => {
                  e.preventDefault();
                }}
              />
            </Form>
          </div>
        </section>
      </div>
    </>
  );
}

export default Home;
