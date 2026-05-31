import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import Draggable from 'react-draggable'
import Window from './Window'
import DesktopIcon from './DesktopIcon'
import Folder from './Folder'
import AboutApp from './apps/AboutApp'
import ProjectsApp from './apps/ProjectsApp'
import SkillsApp from './apps/SkillsApp'
import ContactApp from './apps/ContactApp'
import DaVinciApp from './apps/DaVinciApp'
import IllustratorApp from './apps/IllustratorApp'
import PhotoshopApp from './apps/PhotoshopApp'
import LightroomApp from './apps/LightroomApp'
import CertificationsApp from './apps/CertificationsApp'
import OthersApp from './apps/OthersApp'
import FigmaApp from './apps/FigmaApp'
import FramerApp from './apps/FramerApp'

const EmptyApp = () => null

const DesktopContainer = styled.div`
  flex: 1;
  padding: 20px;
  overflow: visible;
  position: relative;
  background: transparent;
  min-height: calc(100vh - 100px);

  @media (max-width: 768px) {
    padding: 10px;
  }
`

const FolderWrapper = styled.div`
  position: absolute;
  z-index: 10;
  cursor: grab;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0px;
  padding: 8px 5px;
  width: 100px;
  height: 120px;
  border-radius: 8px;
  transition: background 0.2s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
  }
  
  &:active {
    cursor: grabbing;
  }
`

const FolderLabel = styled.div`
  font-size: 11px;
  color: white;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
  white-space: nowrap;
  font-weight: 400;
  letter-spacing: 0.5px;
  font-family: 'Manrope', sans-serif;
`

const ContextMenu = styled.div`
  position: fixed;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 8px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
  z-index: 10000;
  min-width: 200px;
  padding: 8px 0;
`

const ContextMenuItem = styled.div`
  padding: 12px 16px;
  color: white;
  cursor: pointer;
  transition: background 0.2s ease;
  font-size: 14px;
  user-select: none;

  &:hover {
    background: rgba(255, 255, 255, 0.15);
  }

  &:active {
    background: rgba(255, 255, 255, 0.25);
  }
`

const ContextMenuSeparator = styled.div`
  height: 1px;
  background: rgba(255, 255, 255, 0.15);
  margin: 4px 0;
`

const desktopIcons = [
  { id: 'davinci', name: 'DaVinci Resolve', icon: '/davinci.svg', color: '#222222' },
  { id: 'figma', name: 'Figma', icon: '/figma.svg', color: '#000' },
  { id: 'framer', name: 'Framer', icon: '/framer.svg', color: '#000' },
  { id: 'illustrator', name: 'Adobe Illustrator', icon: '/illustrator.svg', color: '#FF9500' },
  { id: 'photoshop', name: 'Adobe Photoshop', icon: '/photoshop.svg', color: '#31A8FF' },
  { id: 'lightroom', name: 'Adobe Lightroom Classic', icon: '/lightroom.svg', color: '#31A8FF' },
]

const appComponents = {
  about: AboutApp,
  projects: ProjectsApp,
  skills: SkillsApp,
  contact: ContactApp,
  davinci: DaVinciApp,
  figma: FigmaApp,
  framer: FramerApp,
  illustrator: IllustratorApp,
  photoshop: PhotoshopApp,
  lightroom: LightroomApp,
  certifications: CertificationsApp,
  others: OthersApp,
}

function Desktop({ openApps, toggleApp, closeApp, closingApps = {}, allApps, windowPositions, updateWindowPosition, windowSizes, updateWindowSize, getNextPosition, windowZIndex, bringToFront, iconPositions, updateIconPosition, updateIconPositionDrag, folderPosition, updateFolderPosition, othersFolderPosition, updateOthersFolderPosition, onOpenPreview }) {
  const [dragStart, setDragStart] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isFolderOpen, setIsFolderOpen] = useState(false);
  const [isOthersFolderOpen, setIsOthersFolderOpen] = useState(false);
  const [contextMenu, setContextMenu] = useState(null);
  const folderRef = React.useRef(null)
  const othersFolderRef = React.useRef(null)

  // Close folder when certifications or others window is closed or begins closing
  useEffect(() => {
    if (!openApps['certifications'] || closingApps['certifications']) {
      setIsFolderOpen(false);
    }
    if (!openApps['others'] || closingApps['others']) {
      setIsOthersFolderOpen(false);
    }
  }, [openApps['certifications'], closingApps['certifications'], openApps['others'], closingApps['others']]);

  const handleDragStart = (e, d) => {
    setDragStart({ x: d.x, y: d.y });
  };

  const handleDragStop = (e, d) => {
    if (dragStart) {
      const distance = Math.hypot(d.x - dragStart.x, d.y - dragStart.y);
      if (distance > 5) {
        setIsDragging(true);
        setTimeout(() => setIsDragging(false), 100);
      }
    }
    updateFolderPosition({ x: d.x, y: d.y });
    setDragStart(null);
  };

  const handleContextMenu = (e) => {
    e.preventDefault();
    const menuOrder = [
      'about',
      'projects',
      'skills',
      'contact',
      'separator',
      'certifications',
      'others',
      'separator',
      'photoshop',
      'illustrator',
      'lightroom',
      'davinci',
      'figma',
      'framer',
      'separator',
      'download'
    ];
    
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      items: menuOrder
    });
  };

  const handleContextMenuClick = (appId) => {
    const app = allApps.find(a => a.id === appId);
    if (appId === 'certifications') {
      setIsFolderOpen(true);
    }
    if (appId === 'others') {
      setIsOthersFolderOpen(true);
    }
    if (openApps[appId]) {
      // If already open, just bring to front
      bringToFront(appId);
    } else {
      // If closed, open it (which also brings to front)
      toggleApp(appId, app);
    }
    setContextMenu(null);
  };

  const closeContextMenu = () => {
    setContextMenu(null);
  };

  const folderItems = allApps.map((app, idx) => (
    <div
      key={app.id}
      onClick={() => toggleApp(app.id, app)}
      style={{
        cursor: 'pointer',
        padding: '8px 12px',
        background: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '6px',
        fontSize: '12px',
        color: 'white',
        textAlign: 'center',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        transition: 'all 0.2s ease'
      }}
      onMouseEnter={e => {
        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
        e.currentTarget.style.transform = 'scale(1.05)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
        e.currentTarget.style.transform = 'scale(1)';
      }}
    >
      {app.icon} {app.name}
    </div>
  ));

  return (
    <DesktopContainer onContextMenu={handleContextMenu} onClick={closeContextMenu}>
      <Draggable
        nodeRef={folderRef}
        position={folderPosition}
        onStart={handleDragStart}
        onDrag={(e, d) => updateFolderPosition({ x: d.x, y: d.y })}
        onStop={handleDragStop}
        bounds="parent"
      >
        <FolderWrapper ref={folderRef} onClick={() => {
          if (!isDragging) {
            setIsFolderOpen(!isFolderOpen);
            toggleApp('certifications', { id: 'certifications', name: 'Certifications', color: '#fff' });
          }
        }}>
          <Folder 
            color="#F8D775" 
            size={0.4} 
            items={[]} 
            isDragging={isDragging}
            isOpen={isFolderOpen}
            onOpenChange={setIsFolderOpen}
            onPaperClick={() => {
              setIsFolderOpen(false);
              toggleApp('certifications', { id: 'certifications', name: 'Certifications', color: '#fff' });
            }}
          />
          <FolderLabel>Certifications</FolderLabel>
        </FolderWrapper>
      </Draggable>
      <Draggable
        nodeRef={othersFolderRef}
        position={othersFolderPosition}
        onStart={(e, d) => {
          setDragStart({ x: d.x, y: d.y });
        }}
        onDrag={(e, d) => updateOthersFolderPosition({ x: d.x, y: d.y })}
        onStop={(e, d) => {
          if (dragStart) {
            const distance = Math.hypot(d.x - dragStart.x, d.y - dragStart.y);
            if (distance > 5) {
              setIsDragging(true);
              setTimeout(() => setIsDragging(false), 100);
            }
          }
          updateOthersFolderPosition({ x: d.x, y: d.y });
          setDragStart(null);
        }}
        bounds="parent"
      >
        <FolderWrapper ref={othersFolderRef} onClick={() => {
          if (!isDragging) {
            setIsOthersFolderOpen(!isOthersFolderOpen);
            toggleApp('others', { id: 'others', name: 'OTHERS', color: '#fff' });
          }
        }}>
          <Folder 
            color="#F8D775" 
            size={0.4} 
            items={[]} 
            isDragging={isDragging}
            isOpen={isOthersFolderOpen}
            onOpenChange={setIsOthersFolderOpen}
            onPaperClick={() => {
              setIsOthersFolderOpen(false);
              toggleApp('others', { id: 'others', name: 'OTHERS', color: '#fff' });
            }}
          />
          <FolderLabel>OTHERS</FolderLabel>
        </FolderWrapper>
      </Draggable>
      {desktopIcons.map((app) => (
        <DesktopIcon
          key={app.id}
          id={app.id}
          icon={app.icon}
          name={app.name}
          color={app.color}
          position={iconPositions[app.id] || { x: 0, y: 0 }}
          onClick={() => toggleApp(app.id, app)}
          onDrag={(newPosition) => updateIconPositionDrag(app.id, newPosition)}
          onPositionChange={(newPosition) => updateIconPosition(app.id, newPosition)}
        />
      ))}
      {Object.entries(openApps).map(([appId, isOpen]) =>
        isOpen && (
          <Window
            key={`window-${appId}`}
            id={appId}
            title={allApps.find(i => i.id === appId).name}
            icon={allApps.find(i => i.id === appId).icon}
            color={allApps.find(i => i.id === appId)?.color || '#fff'}
            dragHandleSelector=".window-drag-surface"
            onClose={() => closeApp(appId)}
            onCloseStart={appId === 'certifications' ? () => setIsFolderOpen(false) : appId === 'others' ? () => setIsOthersFolderOpen(false) : undefined}
            closing={!!closingApps[appId]}
            position={windowPositions[appId] || getNextPosition(appId)}
            onPositionChange={(pos) => updateWindowPosition(appId, pos)}
            size={windowSizes[appId]}
            onSizeChange={(size) => updateWindowSize(appId, size)}
            zIndex={windowZIndex[appId] || 1000}
            onMouseDown={() => bringToFront(appId)}
          >
            {React.createElement(appComponents[appId], { onOpenPreview })}
          </Window>
        )
      )}
      {contextMenu && (
        <ContextMenu style={{ top: `${contextMenu.y}px`, left: `${contextMenu.x}px` }} onClick={(e) => e.stopPropagation()}>
          {contextMenu.items.map((item, idx) => {
            if (item === 'separator') {
              return <ContextMenuSeparator key={`sep-${idx}`} />;
            }
            
            if (item === 'download') {
              return (
                <ContextMenuItem 
                  key="download" 
                  onClick={() => {
                    const link = document.createElement('a');
                    link.href = '/resume.pdf';
                    link.download = 'resume.pdf';
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    setContextMenu(null);
                  }}
                  style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  <img src="/download.svg" alt="Download" style={{ width: '16px', height: '16px', objectFit: 'contain' }} />
                  Resume
                </ContextMenuItem>
              );
            }
            
            // Map short IDs to full app IDs
            const appIdMap = {
              'photoshop': 'photoshop',
              'illustrator': 'illustrator',
              'lightroom': 'lightroom',
              'davinci': 'davinci',
              'figma': 'figma',
              'framer': 'framer'
            };
            
            const appId = appIdMap[item] || item;
            const app = allApps.find(a => a.id === appId);
            
            return (
              <ContextMenuItem 
                key={appId} 
                onClick={() => handleContextMenuClick(appId)}
              >
                {app?.name || appId}
              </ContextMenuItem>
            );
          })}
        </ContextMenu>
      )}
    </DesktopContainer>
  )
}

export default Desktop
