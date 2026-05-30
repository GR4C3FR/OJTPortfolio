import React, { useState, useRef } from 'react'
import Draggable from 'react-draggable'
import styled from 'styled-components'

const DraggableWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  z-index: ${props => props.zIndex || 1000};
`

const WindowWrapper = styled.div`
  width: ${props => props.width}px;
  height: ${props => props.height}px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  touch-action: manipulation;
  position: relative;
  user-select: none;

  @media (max-width: 768px) {
    min-width: 90vw;
    max-width: 95vw;
  }
`

const TitleBar = styled.div`
  background: white;
  color: #1f2937;
  padding: 12px 18px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  user-select: none;
  border-radius: 8px 8px 0 0;
  border-bottom: 1px solid #e5e7eb;
  flex-shrink: 0;
`

const TitleContent = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 600;
  font-size: 14px;
  flex: 1;
`

const Icon = styled.span`
  font-size: 18px;
`

const Controls = styled.div`
  display: flex;
  gap: 8px;
`

const Button = styled.button`
  width: 24px;
  height: 24px;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  font-size: 10px;
  line-height: 0;
  font-weight: bold;
  letter-spacing: -0.2px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #ef4444;
  color: white;
  transition: all 0.2s ease;

  &:hover {
    background: #dc2626;
  }

  &:active {
    background: #b91c1c;
  }
`

const Content = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  background: white;
  pointer-events: auto;
  user-select: text;

  img, a, button {
    pointer-events: auto;
    user-select: none;
    -webkit-user-drag: none;
  }

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
  }

  &::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 4px;

    &:hover {
      background: #555;
    }
  }
`

const ResizeHandle = styled.div`
  position: absolute;
  bottom: 0;
  right: 0;
  width: 20px;
  height: 20px;
  cursor: se-resize;
  background: linear-gradient(135deg, transparent 50%, rgba(0, 0, 0, 0.1) 50%);
  border-radius: 0 0 8px 0;
  transition: background 0.2s ease;

  &:hover {
    background: linear-gradient(135deg, transparent 50%, rgba(0, 0, 0, 0.2) 50%);
  }

  &:active {
    background: linear-gradient(135deg, transparent 50%, rgba(0, 0, 0, 0.3) 50%);
  }
`

function Window({ id, title, icon, color, children, onClose, position, onPositionChange, size, onSizeChange, zIndex, onMouseDown }) {
  const [isResizing, setIsResizing] = useState(false)
  const resizeStartPos = useRef({ x: 0, y: 0 })
  const resizeStartSize = useRef({ width: 0, height: 0 })
  const dragStartPos = useRef({ x: 0, y: 0 })
  const wasDragged = useRef(false)
  const wrapperRef = useRef(null)

  const handleDrag = (e, data) => {
    // Calculate if we've moved significantly
    const distance = Math.hypot(data.x - dragStartPos.current.x, data.y - dragStartPos.current.y)
    if (distance > 5) {
      wasDragged.current = true
    }
    if (onPositionChange && !isResizing) {
      onPositionChange({ x: data.x, y: data.y })
    }
  }

  const handleDragStop = (e, data) => {
    if (onPositionChange && !isResizing) {
      onPositionChange({ x: data.x, y: data.y })
    }
    // Reset drag flag after a short delay
    setTimeout(() => {
      wasDragged.current = false
    }, 50)
  }

  const handleMouseDown = (e) => {
    dragStartPos.current = { x: e.clientX, y: e.clientY }
    wasDragged.current = false
  }

  const handleDragStart = (e) => {
    // Prevent default drag behavior on images, links, buttons
    if (e.target.tagName === 'IMG' || e.target.tagName === 'A' || e.target.tagName === 'BUTTON') {
      e.preventDefault()
    }
  }

  const handleClickCapture = (e) => {
    // Prevent clicks on buttons/links if the window was just dragged
    if (wasDragged.current) {
      // Check if target or any parent is a button or link
      let current = e.target
      while (current && current !== wrapperRef.current) {
        if (current.tagName === 'BUTTON' || current.tagName === 'A') {
          e.stopPropagation()
          e.preventDefault()
          break
        }
        current = current.parentElement
      }
    }
  }

  const currentWidth = size?.width || 400
  const currentHeight = size?.height || 300

  // Calculate bounds to allow partial off-screen dragging
  // Keep at least 250px horizontally and 50px (title bar) vertically visible
  const bounds = {
    left: -currentWidth + 250,
    top: -currentHeight + 150,
    right: window.innerWidth - 250,
    bottom: window.innerHeight - 150,
  }

  return (
    <Draggable 
      handle=".title-bar"
      onDrag={handleDrag}
      onStop={handleDragStop}
      position={position}
      bounds={bounds}
      defaultPosition={position || { x: 50 + Math.random() * 30, y: 50 + Math.random() * 30 }}
    >
      <DraggableWrapper ref={wrapperRef} zIndex={zIndex} onMouseDown={(e) => {
        handleMouseDown(e)
        onMouseDown && onMouseDown(e)
      }} onDragStart={handleDragStart} onClickCapture={handleClickCapture}>
        <WindowWrapper width={currentWidth} height={currentHeight} onDragStart={handleDragStart} onMouseDown={(e) => {
          // Bring window to front on any click within it
          onMouseDown && onMouseDown(e)
        }}>
          <TitleBar className="title-bar" color={color} onMouseDown={onMouseDown}>
            <TitleContent>
              <Icon>{icon}</Icon>
              <span>{title}</span>
            </TitleContent>
            <Controls>
              <Button onClick={onClose} title="Close">
                ✕
              </Button>
            </Controls>
          </TitleBar>
          <Content onMouseDown={(e) => {
            // Bring window to front when clicking on content
            onMouseDown && onMouseDown(e)
          }}>{children}</Content>
        </WindowWrapper>
      </DraggableWrapper>
    </Draggable>
  )
}

export default Window
