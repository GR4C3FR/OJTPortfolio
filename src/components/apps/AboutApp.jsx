import styled from 'styled-components'

// Easily editable About section values
const HERO_IMAGE_SRC = '/about-hero.webp'
const HERO_IMAGE_POSITION = 'calc(100% - -130px) 65%'
const ABOUT_DISPLAY_SECTIONS = [
  { label: 'Hello, I am', titles: ['CHARLES', 'DANIEL', 'GARCIA'] },
  { label: 'An aspiring', titles: ['UI/UX &', 'Graphic Designer'] }
]
const RIGHT_PANEL_GAP = 105
const SECTION_GAP = 0
const TITLE_SIZE = 67

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: calc(100% + 40px);
  width: calc(100% + 40px);
  margin: -20px;
  overflow: auto;
  font-family: 'JetBrains Mono', monospace;
  gap: 20px;
`

const ContentLayout = styled.div`
  display: flex;
  flex: 0 0 auto;
  height: 65vh;
  min-height: 0;
  gap: 0;
  margin: 0;

  @media (max-width: 1200px) {
    flex-direction: column;
    height: auto;
  }
`

const LeftPanel = styled.div`
  flex: 1;
  min-width: 0;
  overflow: hidden;
  display: flex;
  align-items: stretch;
  justify-content: stretch;
`

const HeroImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: ${HERO_IMAGE_POSITION};
  display: block;
  max-height: 90.3%;
`

const RightPanel = styled.div`
  flex: 0.85;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: ${RIGHT_PANEL_GAP}px;
  justify-content: flex-start;
  overflow: hidden;
  padding-right: 20px;
`

const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${SECTION_GAP}px;
  min-height: 0;
`

const Title = styled.h2`
  color: #111827;
  font-size: ${TITLE_SIZE}px;
  line-height: 1;
  margin: 0;
  letter-spacing: -2px;
  text-transform: uppercase;
`

const Subtitle = styled.h3`
  color: #6b7280;
  font-size: 14px;
  font-weight: 600;
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.2em;
`

const Placeholder = styled.div`
  width: 100%;
  min-height: 220px;
  background: #eef2f7;
  border-radius: 20px;
`

const TemporaryText = styled.div`
  padding: 20px;
  color: #4b5563;
  font-size: 14px;
  line-height: 1.6;
  border-radius: 8px;
  margin: -40px 20px 30px 20px;
  flex: 0 0 auto;
  
  p {
    margin: 0 0 16px 0;
    
    &:last-child {
      margin-bottom: 0;
    }
    
    strong {
      font-weight: 600;
      color: #111827;
    }
    
    em {
      font-style: italic;
    }
  }
`

function AboutApp() {
  return (
    <Container>
      <ContentLayout>
        <LeftPanel>
          <HeroImage src={HERO_IMAGE_SRC} alt="About hero" />
        </LeftPanel>

        <RightPanel>
          {ABOUT_DISPLAY_SECTIONS.map((section) => (
            <Section key={section.label}>
              <Subtitle>{section.label}</Subtitle>
              {section.titles.map((line, index) => (
                <Title key={`${section.label}-${index}`}>{line}</Title>
              ))}
            </Section>
          ))}
        </RightPanel>
      </ContentLayout>
      
      <TemporaryText>
        <p>
          I'm all about building <strong>clean, beautiful digital experiences</strong> that just work on any screen. My favorite part of the job is taking messy ideas and turning them into polished, easy-to-use interfaces and layouts that are simple, purposeful, and intuitive to navigate.
        </p>
        <p>
          I'm constantly working to sharpen my design eye. Right now, that means messing around with new tools, figuring out how to make things as smooth as possible for the user, and obsessing over the little things, like getting the spacing exactly right, making sure fonts look great, and picking the perfect vibe for the visuals. Plus, since I have a <strong>background in front-end development</strong>, I actually understand how things get built under the hood. That helps me design stuff that isn't just pretty, but is actually <strong>practical to develop</strong>.
        </p>
        <p>
          I really thrive in collaborative spaces where I can bounce ideas around, take constructive feedback, and iterate fast to make something awesome. Right now, I'm looking to <strong>jump into real-world projects</strong>, whether that's freelance gigs, internships, or teaming up with a crew, where I can pitch in, grow my skills, and help build things people actually enjoy using.
        </p>
      </TemporaryText>
    </Container>
  )
}

export default AboutApp

