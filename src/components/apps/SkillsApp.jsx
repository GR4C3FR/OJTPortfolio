import styled from 'styled-components'

const Notepad = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 0px;
  box-sizing: border-box;
  font-family: 'Jetbrains', monospace;
`

const Container = styled.div`
  width: 96%;
  max-width: 1000px;
  box-sizing: border-box;
  padding: 6px 12px;
`

const Header = styled.div`
  text-align: center;
  margin-bottom: 12px;
`

const Title = styled.h2`
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: #222;
`

const Columns = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  align-items: start;
  @media (max-width: 760px) {
    grid-template-columns: 1fr;
  }
`

const Column = styled.div``

const Section = styled.section`
  margin-bottom: 18px;
  padding-top: 6px;
`

const SectionTitle = styled.h3`
  margin: 0 0 8px 0;
  font-size: 14px;
  color: black;
  font-weight: 600;
`

const Bullet = styled.li`
  margin-bottom: 6px;
  color: #4b5563;
  font-size: 13px;
  line-height: 1.2;
`
const DateText = styled.span`
  display: block;
  margin-top: 6px;
  font-size: 12px;
  color: #666;
  font-weight: 500;
`

const List = styled.ul`
  margin: 0 0 0 12px;
  padding: 0;
`

function SkillsApp() {
  // Sample resume content laid out in two responsive columns
  return (
    <Notepad>
      <Container>
        <Columns>
          <Column>
            <Section>
              <SectionTitle>EXPERIENCE</SectionTitle>
              <List>
                  <Bullet>
                    <div><strong>Code Geeks, HAU</strong> — Multimedia and Creatives Officer</div>
                    <DateText><i>Jun 2024 - Mar 2026</i></DateText>
                  </Bullet>
                  <Bullet>
                    <div><strong>Flower Market, Jungle Base</strong> — Creatives/Event Staff</div>
                    <DateText><i>Feb 2026</i></DateText>
                  </Bullet>
                  <Bullet>
                    <div><strong>Ryan Diamonds Inc.</strong> — Marketing Video Editor</div>
                    <DateText><i>Oct 2025 - Dec 2025</i></DateText>
                  </Bullet>
                  <Bullet>
                    <div><strong>Google Developer Groups, HAU</strong> — Creative Staff</div>
                    <DateText><i>Jun 2024 - Mar 2025</i></DateText>
                  </Bullet>
              </List>
            </Section>

            <Section>
              <SectionTitle>TOOLS</SectionTitle>
              <List>
                <Bullet>Git, GitHub</Bullet>
                <Bullet>Figma</Bullet>
                <Bullet>Adobe Photoshop</Bullet>
                <Bullet>Adobe Illustrator</Bullet>
                <Bullet>DaVinci Resolve</Bullet>
              </List>
            </Section>

            <Section>
              <SectionTitle>EDUCATION</SectionTitle>
              <List>
                 <Bullet>
                  <div><strong>Bachelor of Science in Information Technology</strong> — Web Development, Holy Angel University</div>
                  <DateText><i>2023 — 2027</i></DateText>
                 </Bullet>
              </List>
            </Section>
            
          </Column>

          <Column>
            <Section>
              <SectionTitle>TECHNICAL SKILLS</SectionTitle>
              <List>
                <Bullet>HTML, CSS, JavaScript</Bullet>
                <Bullet>MongoDB</Bullet>
                <Bullet>Responsive Design</Bullet>
                <Bullet>Graphic Design</Bullet>
                <Bullet>Video Editing</Bullet>
              </List>
            </Section>

            <Section>
              <SectionTitle>SOFT SKILLS</SectionTitle>
              <List>
                <Bullet>UI/UX design awareness</Bullet>
                <Bullet>Team collaboration</Bullet>
                <Bullet>Leadership</Bullet>
                <Bullet>Time management</Bullet>
                <Bullet>Adaptability</Bullet>
                <Bullet>Attention to detail</Bullet>
                <Bullet>Initiative and eagerness to learn</Bullet>
              </List>
            </Section>

          </Column>
        </Columns>
      </Container>
    </Notepad>
  )
}

export default SkillsApp
