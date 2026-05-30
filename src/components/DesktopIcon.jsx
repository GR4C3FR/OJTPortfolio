import React, { useState } from 'react'
import Draggable from 'react-draggable'
import styled from 'styled-components'

const IconWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  cursor: grab;
  transition: background 0.2s ease;
  padding: 10px;
  border-radius: 8px;
  user-select: none;

  &:active {
    cursor: grabbing;
  }

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
  }

  &.dragging {
    opacity: 0.8;
  }
`

const Icon = styled.div`
  font-size: 40px;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
  pointer-events: none;
`

const IconImage = styled.img`
  width: 40px;
  height: 40px;
  object-fit: contain;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
  pointer-events: none;
`

const Label = styled.span`
  font-size: 12px;
  text-align: center;
  color: white;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
  word-break: break-word;
  max-width: 70px;
  line-height: 1.2;
  pointer-events: none;
`

function DesktopIcon({ id, icon, name, onClick, color, position, onPositionChange, onDrag }) {
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState(null)

  const handleDragStart = (e, data) => {
    setIsDragging(true)
    setDragStart({ x: data.x, y: data.y })
  }

  const handleDrag = (e, data) => {
    if (onDrag) {
      onDrag({ x: data.x, y: data.y })
    }
  }

  const handleDragStop = (e, data) => {
    setIsDragging(false)
    
    // Calculate distance moved
    const distance = dragStart 
      ? Math.sqrt(Math.pow(data.x - dragStart.x, 2) + Math.pow(data.y - dragStart.y, 2))
      : 0

    // If barely moved (less than 5px), treat as click
    if (distance < 5) {
      onClick && onClick()
    } else if (onPositionChange) {
      // If actually dragged, update position
      onPositionChange({ x: data.x, y: data.y })
    }
    
    setDragStart(null)
  }

  return (
    <Draggable
      position={position || { x: 0, y: 0 }}
      onStart={handleDragStart}
      onDrag={handleDrag}
      onStop={handleDragStop}
      bounds="parent"
    >
      <IconWrapper 
        title={name}
        className={isDragging ? 'dragging' : ''}
        style={{ 
          position: 'absolute',
          zIndex: isDragging ? 9999 : 'auto'
        }}
      >
        {icon && icon.includes('/') ? (
          <IconImage src={icon} alt={name} />
        ) : (
          <Icon>{icon}</Icon>
        )}
        <Label>{name}</Label>
      </IconWrapper>
    </Draggable>
  )
}

export default DesktopIcon
