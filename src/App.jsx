import React, { useState, useEffect, useMemo, useCallback } from 'react'
import styled from 'styled-components'
import Desktop from './components/Desktop'
import Dock from './components/Dock'
import Window from './components/Window'

const AppContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: visible;
`

const PreviewFrame = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #ffffff;
  padding: 16px;
  box-sizing: border-box;
`

const PreviewImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
  display: block;
`

const VerifyButton = styled.button`
  padding: 8px 12px;
  border: none;
  border-radius: 999px;
  background: #111827;
  color: #fff;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.74rem;
  font-weight: 700;
  cursor: pointer;
  transition: transform 180ms ease, opacity 180ms ease;
  margin-top: 6px;
  align-self: center;

  &:hover {
    transform: translateY(-1px);
    opacity: 0.92;
  }

  &:disabled {
    cursor: progress;
    opacity: 0.7;
  }
`

const allApps = [
  { id: 'davinci', name: 'DaVinci Resolve', color: '#303030', icon: '' },
  { id: 'figma', name: 'Figma', color: '#303030', icon: '' },
  { id: 'framer', name: 'Framer', color: '#303030', icon: '' },
  { id: 'illustrator', name: 'Adobe Illustrator', color: '#303030', icon: '' },
  { id: 'photoshop', name: 'Adobe Photoshop', color: '#303030', icon: '' },
  { id: 'lightroom', name: 'Adobe Lightroom Classic', color: '#303030', icon: '' },
  { id: 'certifications', name: 'Certifications', color: '#fff', icon: '' },
  { id: 'others', name: 'OTHERS', color: '#fff', icon: '' },
]

const CERTIFICATION_VERIFY_URLS = {
  'Basics of UI UX': 'https://simpli-web.app.link/e/TKw01bVm10b',
  'Introduction to Figma': 'https://simpli-web.app.link/e/U5Bwmgcn10b',
  'Introduction to PHP': 'https://simpli-web.app.link/e/W9orMjen10b',
  'JavaScript Essentials 1': 'https://www.credly.com/badges/21f0fb1b-894b-4b23-bb7a-818bad20f089/print',
  'Legacy JavaScript': 'https://www.freecodecamp.org/certification/charlesgarcia/javascript-algorithms-and-data-structures',
  'Responsive Web Design': 'https://www.freecodecamp.org/certification/charlesgarcia/responsive-web-design'
}

const dockApps = [
  { id: 'about', name: 'About Me', color: '#fff' },
  { id: 'projects', name: 'Works', color: '#fff' },
  { id: 'skills', name: 'Resume', color: '#fff' },
  { id: 'contact', name: 'Contact', color: '#fff' },
]

const OFFSET_STEP = 30
const MAX_OFFSET = 150

const getDefaultIconPositions = () => {
  const positions = {}

  // Desktop icons in a vertical stack on the left
  positions['photoshop'] = { x: 0, y: 0 }
  positions['illustrator'] = { x: 0, y: 100 }
  positions['lightroom'] = { x: 0, y: 200 }
  positions['davinci'] = { x: 0, y: 300 }
  positions['figma'] = { x: 0, y: 400 }
  positions['framer'] = { x: 0, y: 500 }

  // Other apps spread out (these won't show on desktop icons, but maintain positions)
  const ICON_SIZE = 80
  const PADDING = 120
  const ICONS_PER_ROW = 4

  allApps.forEach((app, index) => {
    if (!positions[app.id]) {
      const row = Math.floor(index / ICONS_PER_ROW)
      const col = index % ICONS_PER_ROW
      positions[app.id] = {
        x: col * (ICON_SIZE + PADDING) + PADDING,
        y: row * (ICON_SIZE + PADDING) + PADDING
      }
    }
  })

  return positions
}

const getTabletGridPositions = (width, height) => {
  const positions = {}
  const columns = 6
  const rows = 5
  const marginX = 18
  const marginY = 18
  const usableWidth = Math.max(320, width - marginX * 2)
  const usableHeight = Math.max(320, height - marginY * 2 - 120)
  const cellWidth = usableWidth / columns
  const cellHeight = usableHeight / rows
  const iconWidth = 96
  const iconHeight = 116

  const place = (id, col, row) => {
    positions[id] = {
      x: Math.max(marginX, marginX + col * cellWidth + (cellWidth - iconWidth) / 2),
      y: Math.max(marginY, marginY + row * cellHeight + (cellHeight - iconHeight) / 2),
    }
  }

  place('photoshop', 0, 0)
  place('illustrator', 1, 0)
  place('lightroom', 2, 0)
  place('davinci', 3, 0)
  place('figma', 4, 0)
  place('framer', 5, 0)
  place('certifications', 0, 1)
  place('others', 1, 1)

  return positions
}

const getInitialIconPositions = () => {
  if (typeof window === 'undefined') return getDefaultIconPositions()

  const isTabletViewport = window.innerWidth > 480 && window.innerWidth <= 1024
  if (isTabletViewport) {
    return getTabletGridPositions(window.innerWidth, window.innerHeight)
  }

  return getDefaultIconPositions()
}

const getFolderPositionsForViewport = (width, height) => {
  if (width > 480 && width <= 1024) {
    const tabletGrid = getTabletGridPositions(width, height)

    return {
      folderPosition: tabletGrid.certifications,
      othersFolderPosition: tabletGrid.others,
    }
  }

  if (width <= 480) {
    return {
      folderPosition: { x: Math.max(10, width - 96), y: 16 },
      othersFolderPosition: { x: Math.max(10, width - 96), y: 124 }
    }
  }

  if (width <= 1024) {
    const isPortrait = height > width

    return {
      folderPosition: {
        x: Math.max(16, width - (isPortrait ? 136 : 156)),
        y: isPortrait ? 18 : 10,
      },
      othersFolderPosition: {
        x: Math.max(16, width - (isPortrait ? 136 : 156)),
        y: isPortrait ? 138 : 130,
      }
    }
  }

  return {
    folderPosition: { x: Math.max(20, width - 140), y: 0 },
    othersFolderPosition: { x: Math.max(20, width - 140), y: 120 }
  }
}

const getInitialFolderPosition = () => {
  if (typeof window === 'undefined') return { x: 0, y: 0 }
  return getFolderPositionsForViewport(window.innerWidth, window.innerHeight).folderPosition
}

const getInitialOthersFolderPosition = () => {
  if (typeof window === 'undefined') return { x: 0, y: 120 }
  return getFolderPositionsForViewport(window.innerWidth, window.innerHeight).othersFolderPosition
}

const getRightAnchoredFolderPositions = () => {
  if (typeof window === 'undefined') {
    return {
      folderPosition: { x: 0, y: 0 },
      othersFolderPosition: { x: 0, y: 120 }
    }
  }

  return getFolderPositionsForViewport(window.innerWidth, window.innerHeight)
}

const getSavedState = (key, fallback) => {
  if (typeof window === 'undefined') return fallback
  try {
    const saved = localStorage.getItem(key)
    return saved ? JSON.parse(saved) : fallback
  } catch (e) {
    console.error(`Failed to load ${key} from localStorage`, e)
    return fallback
  }
}

function App() {
  const [openApps, setOpenApps] = useState({})
  const [closingApps, setClosingApps] = useState({})
  const [windowPositions, setWindowPositions] = useState(() => getSavedState('windowPositions', {}))
  const [windowSizes, setWindowSizes] = useState(() => {
    const saved = getSavedState('windowSizes', {})
    return {
      ...saved,
      about: { width: 700, height: 584 },
      ...saved,
      projects: { width: 600, height: 500 },
      ...saved,
      skills: { width: 600, height: 640 },
      ...saved,
      contact: { width: 600, height: 500 },
      ...saved,
      photoshop: { width: 400, height: 200 },
      ...saved,
      illustrator: { width: 400, height: 200 },
      ...saved,
      lightroom: { width: 400, height: 200 },
      ...saved,
      davinci: { width: 400, height: 200 },
      ...saved,
      figma: { width: 400, height: 200 },
      ...saved,
      framer: { width: 400, height: 200 },
      ...saved,
      certifications: { width: 800, height: 400 },
      ...saved,
      others: { width: 1000, height: 700 },
    }
  })
  const [windowZIndex, setWindowZIndex] = useState({})
  const [maxZIndex, setMaxZIndex] = useState(1000)
  const [previewWindow, setPreviewWindow] = useState(null)
  const [iconPositions, setIconPositions] = useState(getInitialIconPositions())
  const [folderPosition, setFolderPosition] = useState(getInitialFolderPosition())
  const [othersFolderPosition, setOthersFolderPosition] = useState(getInitialOthersFolderPosition)

  useEffect(() => {
    const syncResponsiveLayout = () => {
      const width = window.innerWidth
      const height = window.innerHeight
      const iconLayout = getInitialIconPositions()
      const folderLayout = getRightAnchoredFolderPositions()

      setIconPositions(iconLayout)
      setFolderPosition(folderLayout.folderPosition)
      setOthersFolderPosition(folderLayout.othersFolderPosition)
    }

    syncResponsiveLayout()
    window.addEventListener('resize', syncResponsiveLayout)
    return () => window.removeEventListener('resize', syncResponsiveLayout)
  }, [])

  // Save to localStorage when positions or sizes change
  useEffect(() => {
    try {
      localStorage.setItem('windowPositions', JSON.stringify(windowPositions))
    } catch (e) {
      console.error('Failed to save positions to localStorage', e)
    }
  }, [windowPositions])

  useEffect(() => {
    try {
      localStorage.setItem('windowSizes', JSON.stringify(windowSizes))
    } catch (e) {
      console.error('Failed to save sizes to localStorage', e)
    }
  }, [windowSizes])

  const getNextPosition = (appId) => {
    // If window was previously positioned, return that position
    if (windowPositions[appId]) {
      return windowPositions[appId]
    }

    const WINDOW_WIDTH = 400
    const WINDOW_HEIGHT = 300
    const PADDING = 20

    // Get viewport dimensions
    const viewport = {
      width: window.innerWidth,
      height: window.innerHeight
    }

    // Calculate centered position
    let x = Math.max(PADDING, (viewport.width - WINDOW_WIDTH) / 2)
    let y = Math.max(PADDING, (viewport.height - WINDOW_HEIGHT) / 2 - 40)

    // Ensure window stays within viewport bounds
    if (x + WINDOW_WIDTH > viewport.width - PADDING) {
      x = Math.max(PADDING, viewport.width - WINDOW_WIDTH - PADDING)
    }

    if (y + WINDOW_HEIGHT > viewport.height - PADDING - 80) {
      y = Math.max(PADDING, viewport.height - WINDOW_HEIGHT - PADDING - 80)
    }

    return { x, y }
  }

  const closeApp = useCallback((appId) => {
    // mark as closing so Window can play its animation
    setClosingApps(prev => ({ ...prev, [appId]: true }))
    // after animation duration, actually close
    const ANIM_MS = 120
    setTimeout(() => {
      setOpenApps(prev => ({ ...prev, [appId]: false }))
      setClosingApps(prev => {
        const copy = { ...prev }
        delete copy[appId]
        return copy
      })
    }, ANIM_MS)
  }, [])

  const toggleApp = useCallback((appId, appData) => {
    setOpenApps(prev => {
      const wasOpen = !!prev[appId]
      // If it was open, trigger animated close
      if (wasOpen) {
        closeApp(appId)
        return prev
      }

      const newState = { ...prev, [appId]: true }

      // When opening a new app, bring it to front and save initial position
      if (newState[appId] && !wasOpen) {
        setMaxZIndex(prevMax => {
          const next = prevMax + 1
          setWindowZIndex(prevZ => ({ ...prevZ, [appId]: next }))
          return next
        })

        if (!windowPositions[appId]) {
          const initialPos = getNextPosition(appId)
          setWindowPositions(prevPos => ({
            ...prevPos,
            [appId]: initialPos
          }))
        }
      }

      return newState
    })
  }, [closeApp, windowPositions, getNextPosition])
 

  const updateWindowPosition = (appId, position) => {
    setWindowPositions(prev => ({
      ...prev,
      [appId]: position
    }))
  }

  const updateWindowSize = (appId, size) => {
    setWindowSizes(prev => ({
      ...prev,
      [appId]: size
    }))
  }

  const updateOthersFolderPosition = (newPosition) => {
    const FOLDER_SIZE = 80
    const ICON_SIZE = 80

    const checkOverlap = (rect1, rect2) => {
      const padding = 10
      return !(
        rect1.x + rect1.width + padding < rect2.x ||
        rect2.x + rect2.width + padding < rect1.x ||
        rect1.y + rect1.height + padding < rect2.y ||
        rect2.y + rect2.height + padding < rect1.y
      )
    }

    const hasIconOverlap = (x, y) => {
      return Object.entries(iconPositions).some(([id, pos]) => {
        const rect1 = { x, y, width: FOLDER_SIZE, height: FOLDER_SIZE }
        const rect2 = { x: pos.x, y: pos.y, width: ICON_SIZE, height: ICON_SIZE }
        return checkOverlap(rect1, rect2)
      })
    }

    const hasCertificationsFolderOverlap = (x, y) => {
      const rect1 = { x, y, width: FOLDER_SIZE, height: FOLDER_SIZE }
      const rect2 = { x: folderPosition.x, y: folderPosition.y, width: FOLDER_SIZE, height: FOLDER_SIZE }
      return checkOverlap(rect1, rect2)
    }

    if (!hasIconOverlap(newPosition.x, newPosition.y) && !hasCertificationsFolderOverlap(newPosition.x, newPosition.y)) {
      setOthersFolderPosition(prev => ({
        ...prev,
        ...newPosition
      }))
    }
  }

  const bringToFront = (appId) => {
    const newZIndex = maxZIndex + 1
    setMaxZIndex(newZIndex)
    setWindowZIndex(prev => ({
      ...prev,
      [appId]: newZIndex
    }))
  }

  const openPreviewWindow = useCallback(({ image, text }) => {
    const width = 820
    const height = 680
    const x = Math.max(20, (window.innerWidth - width) / 2)
    const y = Math.max(20, (window.innerHeight - height) / 2 - 30)

    setMaxZIndex(prevMax => {
      const next = prevMax + 1
      setPreviewWindow({
        image,
        text,
        url: CERTIFICATION_VERIFY_URLS[text],
        position: { x, y },
        size: { width, height },
        zIndex: next
      })
      return next
    })
  }, [])

  const bringPreviewToFront = useCallback(() => {
    setMaxZIndex(prevMax => {
      const next = prevMax + 1
      setPreviewWindow(prev => prev ? { ...prev, zIndex: next } : prev)
      return next
    })
  }, [])

  const updateIconPosition = (iconId, newPosition) => {
    const ICON_SIZE = 80
    const FOLDER_SIZE = 80
    
    // Check if rectangles overlap
    const checkOverlap = (rect1, rect2) => {
      const padding = 10
      return !(
        rect1.x + rect1.width + padding < rect2.x ||
        rect2.x + rect2.width + padding < rect1.x ||
        rect1.y + rect1.height + padding < rect2.y ||
        rect2.y + rect2.height + padding < rect1.y
      )
    }
    
    // Check for overlaps with other icons
    const hasIconOverlap = (x, y) => {
      return Object.entries(iconPositions).some(([id, pos]) => {
        if (id === iconId) return false
        
        const rect1 = { x, y, width: ICON_SIZE, height: ICON_SIZE }
        const rect2 = { x: pos.x, y: pos.y, width: ICON_SIZE, height: ICON_SIZE }
        
        return checkOverlap(rect1, rect2)
      })
    }
    
    // Check for overlap with folder
    const hasFolderOverlap = (x, y) => {
      const rect1 = { x, y, width: ICON_SIZE, height: ICON_SIZE }
      const rect2 = { x: folderPosition.x, y: folderPosition.y, width: FOLDER_SIZE, height: FOLDER_SIZE }
      
      return checkOverlap(rect1, rect2)
    }
    
    // Only update position if it doesn't overlap with icons or folder
    if (!hasIconOverlap(newPosition.x, newPosition.y) && !hasFolderOverlap(newPosition.x, newPosition.y)) {
      setIconPositions(prev => ({
        ...prev,
        [iconId]: newPosition
      }))
    }
  }

  const updateIconPositionDrag = (iconId, newPosition) => {
    const ICON_SIZE = 80
    const FOLDER_SIZE = 80
    
    // Check if rectangles overlap
    const checkOverlap = (rect1, rect2) => {
      const padding = 10
      return !(
        rect1.x + rect1.width + padding < rect2.x ||
        rect2.x + rect2.width + padding < rect1.x ||
        rect1.y + rect1.height + padding < rect2.y ||
        rect2.y + rect2.height + padding < rect1.y
      )
    }
    
    // Check for overlaps with other icons
    const hasIconOverlap = (x, y) => {
      return Object.entries(iconPositions).some(([id, pos]) => {
        if (id === iconId) return false
        
        const rect1 = { x, y, width: ICON_SIZE, height: ICON_SIZE }
        const rect2 = { x: pos.x, y: pos.y, width: ICON_SIZE, height: ICON_SIZE }
        
        return checkOverlap(rect1, rect2)
      })
    }
    
    // Check for overlap with folder
    const hasFolderOverlap = (x, y) => {
      const rect1 = { x, y, width: ICON_SIZE, height: ICON_SIZE }
      const rect2 = { x: folderPosition.x, y: folderPosition.y, width: FOLDER_SIZE, height: FOLDER_SIZE }
      
      return checkOverlap(rect1, rect2)
    }
    
    // Only update position during drag if it doesn't overlap with icons or folder
    if (!hasIconOverlap(newPosition.x, newPosition.y) && !hasFolderOverlap(newPosition.x, newPosition.y)) {
      setIconPositions(prev => ({
        ...prev,
        [iconId]: newPosition
      }))
    }
  }

  const updateFolderPosition = (newPosition) => {
    const FOLDER_SIZE = 80
    const ICON_SIZE = 80
    
    // Check if rectangles overlap
    const checkOverlap = (rect1, rect2) => {
      const padding = 10
      return !(
        rect1.x + rect1.width + padding < rect2.x ||
        rect2.x + rect2.width + padding < rect1.x ||
        rect1.y + rect1.height + padding < rect2.y ||
        rect2.y + rect2.height + padding < rect1.y
      )
    }
    
    // Check for overlap with any app icons
    const hasIconOverlap = (x, y) => {
      return Object.entries(iconPositions).some(([id, pos]) => {
        const rect1 = { x, y, width: FOLDER_SIZE, height: FOLDER_SIZE }
        const rect2 = { x: pos.x, y: pos.y, width: ICON_SIZE, height: ICON_SIZE }
        
        return checkOverlap(rect1, rect2)
      })
    }
    
    // Only update position if it doesn't overlap with any icons
    if (!hasIconOverlap(newPosition.x, newPosition.y)) {
      setFolderPosition(newPosition)
    }
  }

  // Map app IDs to SVG file names and define dock order
  const svgIcons = useMemo(() => ({
    about: '/about.svg',
    projects: '/works.svg',
    skills: '/resume.svg',
    contact: '/contact.svg'
  }), [])

  const dockOrder = useMemo(() => ['about', 'projects', 'skills', 'contact'], [])
  
  const labelMap = useMemo(() => ({
    about: 'About Me',
    projects: 'Works',
    skills: 'Resume',
    contact: 'Contact'
  }), [])

  const downloadResume = useCallback(() => {
    const link = document.createElement('a')
    link.href = '/resume.pdf'
    link.download = 'resume.pdf'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }, [])

  const downloadIcon = useMemo(() => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'white' }}>
      <img src="/download.svg" alt="Download resume" style={{ width: '22px', height: '22px', objectFit: 'contain' }} />
      <span style={{ fontSize: '0.75rem', fontWeight: 400, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'white', fontFamily: 'Manrope, sans-serif' }}>Resume</span>
    </div>
  ), [])
  
  const dockItems = useMemo(() => {
    const items = dockOrder.map(appId => {
      const app = dockApps.find(a => a.id === appId)
      if (!app) return null
      
      return {
        icon: <img key={`${appId}-icon`} src={svgIcons[appId]} alt={app.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />,
        label: labelMap[appId],
        onClick: () => toggleApp(app.id, app),
        appId: app.id
      }
    }).filter(Boolean)

    items.push({
      icon: downloadIcon,
      label: 'Download Resume',
      onClick: downloadResume,
      className: 'download-item',
      width: 140
      ,
      style: {
        '--download-separator-left': '-11px',
        '--download-separator-top': '-2px'
      }
    })

    return items
  }, [dockOrder, svgIcons, labelMap, downloadIcon, downloadResume])

  return (
    <AppContainer>
      <Desktop 
        openApps={openApps} 
        toggleApp={toggleApp} 
        closeApp={closeApp} 
        closingApps={closingApps}
        allApps={[...allApps, ...dockApps]} 
        windowPositions={windowPositions} 
        updateWindowPosition={updateWindowPosition} 
        windowSizes={windowSizes} 
        updateWindowSize={updateWindowSize}
        getNextPosition={getNextPosition}
        windowZIndex={windowZIndex}
        bringToFront={bringToFront}
        iconPositions={iconPositions}
        updateIconPosition={updateIconPosition}
        updateIconPositionDrag={updateIconPositionDrag}
        folderPosition={folderPosition}
        updateFolderPosition={updateFolderPosition}
        othersFolderPosition={othersFolderPosition}
        updateOthersFolderPosition={updateOthersFolderPosition}
        onOpenPreview={openPreviewWindow}
      />
      {previewWindow && (
        <Window
          key="certification-preview-window"
          id="certification-preview"
          title={previewWindow.text}
          icon=""
          color="#fff"
          position={previewWindow.position}
          onPositionChange={(pos) => setPreviewWindow(prev => prev ? { ...prev, position: pos } : prev)}
          size={previewWindow.size}
          onSizeChange={(size) => setPreviewWindow(prev => prev ? { ...prev, size } : prev)}
          zIndex={previewWindow.zIndex}
          onMouseDown={bringPreviewToFront}
          onClose={() => setPreviewWindow(null)}
          tabletWindowType="folder"
        >
          <PreviewFrame>
            <PreviewImage
              src={previewWindow.image}
              alt={previewWindow.text}
              style={previewWindow.text === 'JavaScript Essentials 1' ? { width: '92%', height: 'auto' } : {}}
            />
            {previewWindow.url && (
              <VerifyButton
                type="button"
                onClick={() => window.open(previewWindow.url, '_blank', 'noopener,noreferrer')}
              >
                Verify
              </VerifyButton>
            )}
          </PreviewFrame>
        </Window>
      )}
      <Dock 
        items={dockItems}
        baseItemSize={50}
        magnification={70}
        distance={200}
        panelHeight={68}
        spring={{ mass: 0.01, stiffness: 600, damping: 4 }}
      />
    </AppContainer>
  )
}

export default App
