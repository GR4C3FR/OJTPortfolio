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
  delay = 5000,
  pauseOnHover = false,
  onCardClick,
  skewAmount = 6,
  easing = 'elastic',
  children
}) => {
  const childArr = useMemo(() => Children.toArray(children), [children])
  const refs = useMemo(() => childArr.map(() => createRef()), [childArr.length])
  const order = useRef(Array.from({ length: childArr.length }, (_, i) => i))
  const tlRef = useRef(null)
  const container = useRef(null)

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

    if (tlRef.current) {
      tlRef.current.kill()
      tlRef.current = null
    }

    const [front, ...rest] = order.current
    const elFront = refs[front].current
    if (!elFront) return

    order.current = [...rest, front]

    const tl = gsap.timeline()
    tlRef.current = tl

    tl.to(elFront, {
      y: '+=500',
      duration: config.durDrop,
      ease: config.ease
    })

    tl.addLabel('promote', `-=${config.durDrop * config.promoteOverlap}`)
    rest.forEach((idx, i) => {
      const el = refs[idx].current
      if (!el) return
      const slot = makeSlot(i, cardDistance, verticalDistance, refs.length)
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
    })

    const backSlot = makeSlot(refs.length - 1, cardDistance, verticalDistance, refs.length)
    tl.addLabel('return', `promote+=${config.durMove * config.returnDelay}`)
    tl.call(() => {
      gsap.set(elFront, { zIndex: backSlot.zIndex })
    }, undefined, 'return')
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
  }, [refs, cardDistance, verticalDistance, skewAmount])

  const rendered = childArr.map((child, i) =>
    isValidElement(child)
      ? cloneElement(child, {
          key: i,
          ref: refs[i],
          style: { width, height, ...(child.props.style ?? {}) },
          onClick: e => {
            child.props.onClick?.(e)
            onCardClick?.(i)
            swap()
          }
        })
      : child
  )

  return (
    <div ref={container} className="card-swap-container" style={{ width, height }}>
      {rendered}
    </div>
  )
}

export default CardSwap
