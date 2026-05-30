import styled from 'styled-components'
import CardSwap, { Card } from './CardSwap'

const Container = styled.div`
  position: relative;
  width: 100%;
  min-height: 520px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  overflow: hidden;
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
  return (
    <Container>
      <CardSwap
        width={420}
        height={320}
        cardDistance={30}
        verticalDistance={40}
        delay={5000}
        pauseOnHover
        skewAmount={0}
      >
        <Card customClass="project-card">
          <h3>Brand Refresh</h3>
          <p>Designed a full visual identity and responsive experience for a creative studio.</p>
        </Card>
        <Card customClass="project-card">
          <h3>Product Launch</h3>
          <p>Built a marketing landing page with animated interactions and mobile UX.
          </p>
        </Card>
        <Card customClass="project-card">
          <h3>Portfolio Experience</h3>
          <p>Created an interactive portfolio interface with polished motion design.</p>
        </Card>
      </CardSwap>
    </Container>
  )
}

export default ProjectsApp
