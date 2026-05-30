import styled from 'styled-components'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`

const ProjectCard = styled.div`
  border-left: 4px solid #e74c3c;
  background: #f8f9fa;
  padding: 15px;
  border-radius: 4px;
  transition: all 0.3s ease;

  &:hover {
    background: #ecf0f1;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
`

const ProjectTitle = styled.h3`
  color: #2c3e50;
  font-size: 16px;
  margin-bottom: 5px;
`

const ProjectDesc = styled.p`
  color: #555;
  font-size: 13px;
  line-height: 1.5;
  margin-bottom: 10px;
`

const Tags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
`

const Tag = styled.span`
  background: #e74c3c;
  color: white;
  padding: 3px 8px;
  border-radius: 3px;
  font-size: 11px;
  font-weight: 600;
`

function ProjectsApp() {
  const projects = []

  return (
    <Container>
      {projects.map(project => (
        <ProjectCard key={project.id}>
          <ProjectTitle>{project.title}</ProjectTitle>
          <ProjectDesc>{project.desc}</ProjectDesc>
          <Tags>
            {project.tags.map((tag, idx) => (
              <Tag key={idx}>{tag}</Tag>
            ))}
          </Tags>
        </ProjectCard>
      ))}
    </Container>
  )
}

export default ProjectsApp
