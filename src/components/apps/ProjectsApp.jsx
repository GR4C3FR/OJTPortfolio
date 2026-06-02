import styled from 'styled-components'
import { useEffect, useState } from 'react'
import CardSwap, { Card } from './CardSwap'

const Container = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0;
  overflow: hidden;

  @media (max-width: 900px) {
    align-items: flex-start;
  }
`

const BgLayer = styled.div`
  position: absolute;
  inset: -8px;
  transition: background-color 280ms ease, opacity 260ms ease;
  pointer-events: none;
  z-index: 0;
`

const GridLayer = styled.div`
  position: absolute;
  inset: -8px;
  pointer-events: none;
  z-index: 1;
  opacity: 0.5;
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.28) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.28) 1px, transparent 1px);
  background-size: 30px 30px;
  mask-image: linear-gradient(180deg, rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.55));
`

const Content = styled.div`
  position: relative;
  z-index: 2;
`

const Header = styled.div`
  position: absolute;
  top: 20px;
  left: 20px;
  max-width: 280px;
  color: #1f2937;

  @media (max-width: 900px) {
    top: 14px;
    left: 14px;
    max-width: calc(100% - 28px);
  }
`

const Title = styled.h2`
  margin: 0 0 8px;
  font-size: 1.3rem;
  letter-spacing: -0.02em;
`

const Description = styled.p`
  margin: 0;
  color: #475569;
  line-height: 1.6;

  @media (max-width: 600px) {
    line-height: 1.45;
    font-size: 0.9rem;
  }
`

function ProjectsApp() {
  const colors = ['#b60b39', '#40bd70', '#334acd']
  const [bgIndex, setBgIndex] = useState(0)
  const [viewport, setViewport] = useState(() => ({
    width: typeof window !== 'undefined' ? window.innerWidth : 1280,
    height: typeof window !== 'undefined' ? window.innerHeight : 800,
  }))

  useEffect(() => {
    const updateViewport = () => setViewport({ width: window.innerWidth, height: window.innerHeight })
    updateViewport()
    window.addEventListener('resize', updateViewport)
    return () => window.removeEventListener('resize', updateViewport)
  }, [])

  const cardWidth = viewport.width <= 480 ? 260 : viewport.width <= 768 ? 320 : 450
  const cardHeight = viewport.width <= 480 ? 188 : viewport.width <= 768 ? 232 : 300
  const cardDistance = viewport.width <= 480 ? 20 : 28
  const verticalDistance = viewport.width <= 480 ? 22 : 32
  const offsetX = viewport.width <= 768 ? 0 : -12
  const offsetY = viewport.width <= 768 ? 0 : 10

  const handleFrontChange = idx => {
    console.debug('ProjectsApp.handleFrontChange called with', idx)
    if (typeof idx !== 'number') return 
    // Always update bgIndex when a front-change occurs. Previously we
    // early-returned when idx === bgIndex which caused missed updates
    // during certain rotation/timing sequences.
    setBgIndex(idx % colors.length)
  }

  return (
    <Container style={{ backgroundColor: colors[bgIndex], transition: 'background-color 260ms ease' }}>
      <BgLayer style={{ backgroundColor: colors[bgIndex], opacity: 0 }} />
      <GridLayer />
      <Header>
        <Title>Selected Work</Title>
        <Description>Swipe through a few projects I’ve built and designed, with each card opening a closer look at the work.</Description>
      </Header>
      <Content>
      <CardSwap
        width={cardWidth}
        height={cardHeight}
        cardDistance={cardDistance}
        verticalDistance={verticalDistance}
        offsetX={offsetX}
        offsetY={offsetY}
        delay={5000}
        pauseOnHover
        skewAmount={0}
        onFrontChange={handleFrontChange}
      >
          <Card className="project-card1">
            <img src="/endless-charms-jewelry.webp" alt="Endless Charms" className="card-bg" />
            <div className="card-content">
              <h4>Endless Charms</h4>
              <h6>Academic Project | Full-Stack Developer</h6>
              <div className="card-pills">
                <span className="pill pill-ecj">MongoDB</span>
                <span className="pill pill-ecj">Express.js</span>
                <span className="pill pill-ecj">EJS</span>
                <span className="pill pill-ecj">Node.js</span>
              </div>
              <p>A sleek digital showroom for Endless Charms that showcases premium, ethically sourced custom jewelry in the Philippines while driving leads for bespoke consultations.</p>
              <div className="card-actions">
                <a className="card-button button-ecj" href="https://endlesscharms.store/" target="_blank" rel="noreferrer" onClick={e => e.stopPropagation()}>Live Demo</a>
                <a className="card-button button-ecj" href="https://github.com/GR4C3FR/Endless-Charms-Jewelries.git" target="_blank" rel="noreferrer" onClick={e => e.stopPropagation()}>Code</a>
              </div>
            </div>
          </Card>
          <Card className="project-card2">
            <img src="/immfi.webp" alt="IMMFI" className="card-bg" />
            <div className="card-content">
              <h4 className="immfi">Inocencio Magtoto Memorial Foundation, Inc. (IMMFI)</h4>
              <h6 className="immfi">UI/UX Designer | Organizational Project</h6>
              <div className="card-pills">
                <span className="pill pill-immfi">MongoDB</span>
                <span className="pill pill-immfi">Express.js</span>
                <span className="pill pill-immfi">React</span>
                <span className="pill pill-immfi">Node.js</span>
              </div>
              <p>Build and launch IMMFI’s official website with real-time features and interactive tools to boost engagement and streamline volunteer sign-ups and donations.</p>
              <div className="card-actions">
                <a className="card-button button-immfi" href="https://immfi.org/" target="_blank" rel="noreferrer" onClick={e => e.stopPropagation()}>Live Demo</a>
                <a className="card-button button-immfi" href="https://github.com/eishley15/immfi.git" target="_blank" rel="noreferrer" onClick={e => e.stopPropagation()}>Code</a>
              </div>
            </div>
          </Card>
          <Card className="project-card3">
            <img src="/sharesource.webp" alt="Sharesource" className="card-bg" />
            <div className="card-content">
              <h4 className="sharesource">Sharesource</h4>
              <h6 className="sharesource">Full-Stack Developer | Academic Project</h6>
              <div className="card-pills">
                <span className="pill pill-ss">MongoDB</span>
                <span className="pill pill-ss">Express.js</span>
                <span className="pill pill-ss">React</span>
                <span className="pill pill-ss">Node.js</span>
              </div>
              <p>A student-driven web app for sharing categorized academic materials, featuring secure authentication, admin moderation, quick search, and collaborative discussion tools.</p>
              <div className="card-actions">
                <a className="card-button button-ss" href="https://github.com/GR4C3FR/Sharesource.git" target="_blank" rel="noreferrer" onClick={e => e.stopPropagation()}>Code</a>
              </div>
            </div>
          </Card>
      </CardSwap>
      </Content>
    </Container>
  )
}

export default ProjectsApp
