import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { gsap } from 'gsap'
import './Masonry.css'

const useMedia = (queries, values, defaultValue) => {
  const getValue = () => values[queries.findIndex(q => matchMedia(q).matches)] ?? defaultValue
  const [value, setValue] = useState(getValue)

  useEffect(() => {
    const handler = () => setValue(getValue)
    queries.forEach(q => matchMedia(q).addEventListener('change', handler))
    return () => queries.forEach(q => matchMedia(q).removeEventListener('change', handler))
  }, [queries])

  return value
}

const useMeasure = () => {
  const ref = useRef(null)
  const [size, setSize] = useState({ width: 0, height: 0 })

  useLayoutEffect(() => {
    if (!ref.current) return
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect
      setSize({ width, height })
    })
    ro.observe(ref.current)
    return () => ro.disconnect()
  }, [])

  return [ref, size]
}

const preloadImages = async (urls) => {
  await Promise.all(
    urls.map(
      (src) =>
        new Promise((resolve) => {
          const img = new Image()
          img.src = src
          img.onload = img.onerror = () => resolve()
        })
    )
  )
}

const shuffleArray = (arr) => {
  const a = arr.slice()
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

const getInitialPosition = (item, containerRef, animateFrom) => {
  const containerRect = containerRef.current?.getBoundingClientRect()
  if (!containerRect) return { x: item.x, y: item.y }

  let direction = animateFrom
  if (animateFrom === 'random') {
    const directions = ['top', 'bottom', 'left', 'right']
    direction = directions[Math.floor(Math.random() * directions.length)]
  }

  switch (direction) {
    case 'top':
      return { x: item.x, y: -200 }
    case 'bottom':
      return { x: item.x, y: window.innerHeight + 200 }
    case 'left':
      return { x: -200, y: item.y }
    case 'right':
      return { x: window.innerWidth + 200, y: item.y }
    case 'center':
      return {
        x: containerRect.width / 2 - item.w / 2,
        y: containerRect.height / 2 - item.h / 2
      }
    default:
      return { x: item.x, y: item.y + 100 }
  }
}

const Masonry = ({
  items,
  ease = 'power3.out',
  duration = 0.6,
  stagger = 0.05,
  animateFrom = 'bottom',
  scaleOnHover = true,
  hoverScale = 0.95,
  blurToFocus = true,
  colorShiftOnHover = false
}) => {
  const columns = useMedia(
    ['(min-width:1500px)', '(min-width:1000px)', '(min-width:600px)', '(min-width:400px)'],
    [5, 4, 3, 2],
    1
  )

  const [containerRef, { width }] = useMeasure()
  // Allow layout/animations to run immediately to avoid blocking UI when opening
  // the OTHERS window. Images will be preloaded in the background.
  const [imagesReady, setImagesReady] = useState(true)
  const hasMounted = useRef(false)

  // create a shuffled copy of items so gallery order is randomized
  const itemsShuffled = useMemo(() => shuffleArray(items || []), [items])

  useEffect(() => {
    // Preload but don't wait — this runs in background to warm the cache.
    preloadImages(itemsShuffled.map((item) => item.img)).catch(() => {})
  }, [itemsShuffled])

  const grid = useMemo(() => {
    if (!width) return []

    const colHeights = new Array(columns).fill(0)
    const columnWidth = width / columns

    return itemsShuffled.map((child) => {
      const col = colHeights.indexOf(Math.min(...colHeights))
      const x = columnWidth * col
      const height = child.height / 2
      const y = colHeights[col]
      colHeights[col] += height
      return { ...child, x, y, w: columnWidth, h: height }
    })
  }, [columns, items, width])

  useLayoutEffect(() => {
    // Immediately place items at their final positions without entry animation
    // so the OTHERS window opens without lag. Hover animations remain.
    if (!grid || !grid.length) return

    grid.forEach((item) => {
      const selector = `[data-key="${item.id}"]`
      gsap.set(selector, {
        opacity: 1,
        x: item.x,
        y: item.y,
        width: item.w,
        height: item.h,
        ...(blurToFocus ? { filter: 'none' } : {})
      })
    })
  }, [grid, blurToFocus])

  const handleMouseEnter = (e, item) => {
    const selector = `[data-key="${item.id}"]`
    if (scaleOnHover) {
      gsap.to(selector, {
        scale: hoverScale,
        duration: 0.3,
        ease: 'power2.out'
      })
    }

    if (colorShiftOnHover) {
      const overlay = e.currentTarget.querySelector('.color-overlay')
      if (overlay) {
        gsap.to(overlay, {
          opacity: 0.3,
          duration: 0.3
        })
      }
    }
  }

  const handleMouseLeave = (e, item) => {
    const selector = `[data-key="${item.id}"]`

    if (scaleOnHover) {
      gsap.to(selector, {
        scale: 1,
        duration: 0.3,
        ease: 'power2.out'
      })
    }

    if (colorShiftOnHover) {
      const overlay = e.currentTarget.querySelector('.color-overlay')
      if (overlay) {
        gsap.to(overlay, {
          opacity: 0,
          duration: 0.3
        })
      }
    }
  }

  return (
    <div ref={containerRef} className="list">
      {grid.map((item) => (
        <div
          key={item.id}
          data-key={item.id}
          className="item-wrapper"
          onMouseEnter={(e) => handleMouseEnter(e, item)}
          onMouseLeave={(e) => handleMouseLeave(e, item)}
        >
          <div className="item-img" style={{ backgroundImage: `url(${item.img})` }}>
            {colorShiftOnHover && (
              <div className="color-overlay" />
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

export default Masonry
