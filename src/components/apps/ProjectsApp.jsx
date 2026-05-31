import styled from 'styled-components'
import { useState } from 'react'
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
`

const BgLayer = styled.div`
  position: absolute;
  inset: -8px;
  transition: background-color 280ms ease, opacity 260ms ease;
  pointer-events: none;
  z-index: 0;
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
`

function ProjectsApp() {
  const colors = ['#5A051B', '#174428', '#272E56']
  const [bgIndex, setBgIndex] = useState(0)
  const [lastFront, setLastFront] = useState(null)

  const handleFrontChange = idx => {
    console.debug('ProjectsApp.handleFrontChange called with', idx)
    if (typeof idx !== 'number') return
    // Always update bgIndex when a front-change occurs. Previously we
    // early-returned when idx === bgIndex which caused missed updates
    // during certain rotation/timing sequences.
    setLastFront({ idx, t: Date.now() })
    setBgIndex(idx % colors.length)
  }

  return (
    <Container style={{ backgroundColor: colors[bgIndex], transition: 'background-color 260ms ease' }}>
      <BgLayer style={{ backgroundColor: colors[bgIndex], opacity: 0 }} />
      <Content>
      <CardSwap
        width={450}
        height={300}
        cardDistance={28}
        verticalDistance={32}
        offsetX={-12}
        offsetY={10}
        delay={5000}
        pauseOnHover
        skewAmount={0}
        onFrontChange={handleFrontChange}
      >
          <Card className="project-card1">
            <img src="/endless-charms-jewelry.webp" alt="Endless Charms" className="card-bg" />
            <div className="card-content">
              <h4>Endless Charms Jewelry</h4>
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
      {/* debug badge removed */}
    </Container>
  )
}

export default ProjectsApp
