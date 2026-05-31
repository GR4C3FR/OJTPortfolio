import React, { Children, cloneElement, createRef, forwardRef, isValidElement, useCallback, useEffect, useMemo, useRef } from 'react'
import gsap from 'gsap'
import './CardSwap.css'

export const Card = forwardRef(({ className, style, onClick, children, ...rest }, ref) => (
  <div ref={ref} {...rest} className={`card ${className ?? ''}`.trim()} style={style} onClick={onClick}>
    {children}
  </div>
))
Card.displayName = 'Card'

const makeSlot = (i, distX, distY, total) => ({
  x: i * distX,
  y: -i * distY,
  z: -i * distX * 1.5,
  zIndex: total - i
})

const placeNow = (el, slot, skew) =>
  gsap.set(el, {
    x: slot.x,
    y: slot.y,
    z: slot.z,
    xPercent: -50,
    yPercent: -50,
    skewY: skew,
    transformOrigin: 'center center',
    zIndex: slot.zIndex,
    force3D: true
  })

const CardSwap = ({
  width = 500,
  height = 400,
  cardDistance = 60,
  verticalDistance = 70,
  offsetX = 0,
  offsetY = 0,
  delay = 5000,
  pauseOnHover = false,
  onCardClick,
  onFrontChange,
  skewAmount = 6,
  easing = 'elastic',
  children
}) => {
  const childArr = useMemo(() => Children.toArray(children), [children])
  const refs = useMemo(() => childArr.map(() => createRef()), [childArr.length])
  const order = useRef(Array.from({ length: childArr.length }, (_, i) => i))
  const tlRef = useRef(null)
  const container = useRef(null)
  const pressStartRef = useRef(null)
  const dragThreshold = 6

  const config = useMemo(() => {
    if (easing === 'elastic') {
      return {
        ease: 'elastic.out(0.6,0.9)',
        durDrop: 0.9,
        durMove: 0.9,
        durReturn: 0.9,
        promoteOverlap: 0.9,
        returnDelay: 0
      }
    }

    return {
      ease: 'none',
      durDrop: 0.6,
      durMove: 0.6,
      durReturn: 0.6,
      promoteOverlap: 0.45,
      returnDelay: 0
    }
  }, [easing])

  const swap = useCallback(() => {
    if (order.current.length < 2) return

    // Ensure DOM refs exist for the current ordering before animating
    const [front, ...rest] = order.current
    const elFront = refs[front]?.current
    const restEls = rest.map(i => refs[i]?.current)

    const missing = []
    if (!elFront) missing.push(front)
    restEls.forEach((el, idx) => {
      if (!el) missing.push(rest[idx])
    })
    if (missing.length > 0) {
      console.error('swap aborted: missing DOM refs for indices', missing, 'order', order.current, 'refsReady', refs.map(r=>!!r.current))
      return
    }

    if (tlRef.current) {
      tlRef.current.kill()
      tlRef.current = null
    }

    order.current = [...rest, front]

    // Debug: log refs and order before creating timeline
    try {
      console.debug('CardSwap.swap preparing', { order: order.current, refsReady: refs.map(r => !!r.current) })
    } catch (e) {}

    let tl
    try {
      tl = gsap.timeline()
      tlRef.current = tl
    } catch (err) {
      console.error('GSAP timeline creation failed', { err, order: order.current })
      return
    }

    try {
      tl.to(elFront, {
        y: '+=500',
        duration: config.durDrop,
        ease: config.ease
      })
    } catch (err) {
      console.error('GSAP tl.to failed on elFront', { err, elFront, order: order.current, refsReady: refs.map(r=>!!r.current) })
      try { tl.kill() } catch (e) {}
      tlRef.current = null
      return
    }

    tl.addLabel('promote', `-=${config.durDrop * config.promoteOverlap}`)
    // notify parent when the next card begins promoting (arriving to front)
    // NOTE: second argument to tl.call is params (array); pass undefined so the
    // string label is treated as the position. Passing a string as params
    // caused GSAP to try iterating the string and throw CreateListFromArrayLike.
    tl.call(() => onFrontChange?.(order.current[0]), undefined, 'promote')
    rest.forEach((idx, i) => {
      const el = refs[idx]?.current
      if (!el) {
        console.warn('CardSwap.swap: skipping missing element for idx', idx)
        return
      }
      const slot = makeSlot(i, cardDistance, verticalDistance, refs.length)
      try {
        tl.set(el, { zIndex: slot.zIndex }, 'promote')
        tl.to(
          el,
          {
            x: slot.x,
            y: slot.y,
            z: slot.z,
            duration: config.durMove,
            ease: config.ease
          },
          `promote+=${i * 0.15}`
        )
      } catch (err) {
        console.error('CardSwap.swap: gsap failed for rest element', { err, idx, el })
      }
    })

    const backSlot = makeSlot(refs.length - 1, cardDistance, verticalDistance, refs.length)
    tl.addLabel('return', `promote+=${config.durMove * config.returnDelay}`)
    tl.call(() => {
      try {
        if (elFront) gsap.set(elFront, { zIndex: backSlot.zIndex })
      } catch (err) {
        console.error('CardSwap.swap: gsap.set failed on elFront in return', { err, elFront })
      }
    }, undefined, 'return')
    try {
      tl.to(
        elFront,
        {
          x: backSlot.x,
          y: backSlot.y,
          z: backSlot.z,
          duration: config.durReturn,
          ease: config.ease
        },
        'return'
      )
    } catch (err) {
      console.error('CardSwap.swap: gsap.to failed on elFront return', { err, elFront })
    }

    tl.eventCallback('onComplete', () => {
      if (tlRef.current === tl) {
        tlRef.current = null
      }
    })
  }, [refs, cardDistance, verticalDistance, config])

  useEffect(() => {
    const total = refs.length
    refs.forEach((r, i) => {
      if (!r.current) return
      placeNow(r.current, makeSlot(i, cardDistance, verticalDistance, total), skewAmount)
    })
    // initial front card notify
    onFrontChange?.(order.current[0])
  }, [refs, cardDistance, verticalDistance, skewAmount])

  const rendered = childArr.map((child, i) =>
    isValidElement(child)
      ? cloneElement(child, {
          key: i,
          ref: refs[i],
          style: { width, height, ...(child.props.style ?? {}) },
          onMouseDown: e => {
            pressStartRef.current = { x: e.clientX, y: e.clientY }
            child.props.onMouseDown?.(e)
          },
          onClick: e => {
            child.props.onClick?.(e)
            onCardClick?.(i)
            const start = pressStartRef.current
            const movedDistance = start ? Math.hypot(e.clientX - start.x, e.clientY - start.y) : 0

            pressStartRef.current = null

            if (movedDistance <= dragThreshold) {
              swap()
            }
          }
        })
      : child
  )

  return (
    <div
      ref={container}
      className="card-swap-container"
      style={{
        width,
        height,
        '--card-swap-offset-x': `${offsetX}px`,
        '--card-swap-offset-y': `${offsetY}px`
      }}
    >
      {rendered}
    </div>
  )
}

export default CardSwap
