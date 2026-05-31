import React, { useState, useEffect, useMemo, useCallback } from 'react'
import styled from 'styled-components'
import Desktop from './components/Desktop'
import Dock from './components/Dock'

const AppContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: visible;
`

const allApps = [
  { id: 'davinci', name: 'DaVinci Resolve', color: '#fff', icon: '' },
  { id: 'figma', name: 'Figma', color: '#fff', icon: '' },
  { id: 'framer', name: 'Framer', color: '#fff', icon: '' },
  { id: 'illustrator', name: 'Adobe Illustrator', color: '#fff', icon: '' },
  { id: 'photoshop', name: 'Adobe Photoshop', color: '#fff', icon: '' },
  { id: 'lightroom', name: 'Adobe Lightroom Classic', color: '#fff', icon: '' },
  { id: 'certifications', name: 'Certifications', color: '#fff', icon: '' },
]

const dockApps = [
  { id: 'about', name: 'About Me', color: '#fff' },
  { id: 'projects', name: 'Works', color: '#fff' },
  { id: 'skills', name: 'Resume', color: '#fff' },
  { id: 'contact', name: 'Contact', color: '#fff' },
]

const OFFSET_STEP = 30
const MAX_OFFSET = 150

const getInitialIconPositions = () => {
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

const getInitialFolderPosition = () => {
  if (typeof window === 'undefined') return { x: 0, y: 0 }
  return { x: window.innerWidth - 150, y: 0 }
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
    }
  })
  const [windowZIndex, setWindowZIndex] = useState({})
  const [maxZIndex, setMaxZIndex] = useState(1000)
  const [iconPositions, setIconPositions] = useState(getInitialIconPositions())
  const [folderPosition, setFolderPosition] = useState(getInitialFolderPosition())

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
    const ANIM_MS = 200
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

  const bringToFront = (appId) => {
    const newZIndex = maxZIndex + 1
    setMaxZIndex(newZIndex)
    setWindowZIndex(prev => ({
      ...prev,
      [appId]: newZIndex
    }))
  }

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
      />
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
