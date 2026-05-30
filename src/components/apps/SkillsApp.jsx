import styled from 'styled-components'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`

const SkillCategory = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`

const CategoryTitle = styled.h3`
  color: #2c3e50;
  font-size: 16px;
  font-weight: 600;
  border-bottom: 2px solid #2ecc71;
  padding-bottom: 5px;
`

const SkillItem = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`

const SkillName = styled.span`
  color: #555;
  font-size: 14px;
  min-width: 120px;
`

const ProgressBar = styled.div`
  flex: 1;
  height: 6px;
  background: #ecf0f1;
  border-radius: 3px;
  overflow: hidden;
`

const ProgressFill = styled.div`
  height: 100%;
  background: linear-gradient(to right, #2ecc71, #27ae60);
  width: ${props => props.percentage}%;
  transition: width 0.3s ease;
`

function SkillsApp() {
  const skills = {
    'Frontend': [
      { name: 'React', level: 95 },
      { name: 'JavaScript/ES6+', level: 90 },
      { name: 'TypeScript', level: 85 },
      { name: 'CSS/SCSS', level: 88 },
      { name: 'HTML5', level: 92 },
    ],
    'Backend': [
      { name: 'Node.js', level: 88 },
      { name: 'Express.js', level: 87 },
      { name: 'Python', level: 80 },
      { name: 'SQL', level: 85 },
      { name: 'REST APIs', level: 90 },
    ],
    'Tools & Others': [
      { name: 'Git/GitHub', level: 92 },
      { name: 'Docker', level: 75 },
      { name: 'AWS', level: 70 },
      { name: 'Webpack/Vite', level: 85 },
      { name: 'Testing (Jest)', level: 80 },
    ],
  }

  return (
    <Container>
      {Object.entries(skills).map(([category, skillList]) => (
        <SkillCategory key={category}>
          <CategoryTitle>{category}</CategoryTitle>
          {skillList.map((skill, idx) => (
            <SkillItem key={idx}>
              <SkillName>{skill.name}</SkillName>
              <ProgressBar>
                <ProgressFill percentage={skill.level} />
              </ProgressBar>
              <span style={{ color: '#95a5a6', fontSize: '12px', minWidth: '30px' }}>
                {skill.level}%
              </span>
            </SkillItem>
          ))}
        </SkillCategory>
      ))}
    </Container>
  )
}

export default SkillsApp
