import styled from 'styled-components'

const TaskbarContainer = styled.div`
  height: 80px;
  width: fit-content;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px 20px;
  margin: 0 auto 30px auto;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    bottom: -10px;
    left: -10px;
    right: -10px;
    height: 80px;
    background: linear-gradient(to top, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.2));
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 20px;
    pointer-events: none;
    z-index: 0;
  }

  @media (max-width: 768px) {
    height: 68px;
    padding: 8px 14px;
    gap: 6px;
    margin-bottom: 18px;

    &::before {
      height: 68px;
      bottom: -8px;
      left: -8px;
      right: -8px;
      border-radius: 18px;
    }
  }
`

const IconWrapper = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 60px;

  @media (max-width: 768px) {
    height: 52px;
  }
`

const TaskbarIcon = styled.button`
  width: 50px;
  height: 50px;
  border: none;
  border-radius: 12px;
  background: linear-gradient(135deg, ${props => props.color || '#3498db'}, ${props => props.color || '#3498db'}dd);
  color: white;
  font-size: 24px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2);
  position: relative;
  transform-origin: bottom center;

  &:hover {
    transform: scale(1.3) translateY(-15px);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.3);
  }

  &:active {
    transform: scale(0.95) translateY(0);
  }

  @media (max-width: 768px) {
    width: 42px;
    height: 42px;
    font-size: 20px;

    &:hover {
      transform: scale(1.1) translateY(-6px);
    }
  }

  ${props => props.isActive && `
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2), 0 0 20px ${props.color || '#3498db'};
  `}

  &::after {
    ${props => props.isActive && `
      content: '';
      position: absolute;
      bottom: -15px;
      width: 4px;
      height: 4px;
      border-radius: 50%;
      background: white;
      box-shadow: 0 0 8px rgba(255, 255, 255, 0.6);
    `}
  }
`

const Label = styled.div`
  position: absolute;
  bottom: 65px;
  background: rgba(0, 0, 0, 0.9);
  color: white;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 12px;
  white-space: nowrap;
  font-weight: 500;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s ease;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);

  ${TaskbarIcon}:hover & {
    opacity: 1;
  }

  &::after {
    content: '';
    position: absolute;
    bottom: -4px;
    left: 50%;
    transform: translateX(-50%);
    width: 0;
    height: 0;
    border-left: 4px solid transparent;
    border-right: 4px solid transparent;
    border-top: 4px solid rgba(0, 0, 0, 0.9);
  }

  @media (max-width: 768px) {
    display: none;
  }
`

const colors = {
  about: '#3498db',
  projects: '#e74c3c',
  skills: '#2ecc71',
  contact: '#f39c12',
  terminal: '#9b59b6',
}

function Taskbar({ openApps, allApps, toggleApp }) {
  return (
    <TaskbarContainer>
      {allApps.map(app => (
        <IconWrapper key={app.id}>
          <TaskbarIcon
            color={colors[app.id]}
            isActive={openApps[app.id]}
            onClick={() => toggleApp(app.id, app)}
            title={app.name}
          >
            {app.icon}
          </TaskbarIcon>
          <Label>{app.name}</Label>
        </IconWrapper>
      ))}
    </TaskbarContainer>
  )
}

export default Taskbar
