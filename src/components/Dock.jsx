'use client';

import {
  motion,
  useMotionValue,
  useSpring,
  useTransform
} from 'motion/react';
import React, { Children, cloneElement, useMemo, useRef, useState } from 'react';

import './Dock.css';

function DockItem({
  className = '',
  onClick,
  magnification,
  baseItemSize,
  icon,
  label,
  width
  ,
  style = {}
}) {
  const ref = useRef(null);
  const [isItemHovered, setIsItemHovered] = useState(false);

  const targetWidth = width || baseItemSize
  const isFixedItem = Boolean(width)
  const animatedWidth = isFixedItem ? targetWidth : isItemHovered ? magnification : baseItemSize
  const animatedHeight = isFixedItem ? baseItemSize : isItemHovered ? magnification : baseItemSize

  return (
    <motion.div
      ref={ref}
      initial={isFixedItem ? false : undefined}
      animate={{ 
        width: animatedWidth,
        height: animatedHeight 
      }}
      transition={{ type: "spring", stiffness: 600, mass: 0.01, damping: 4 }}
      onHoverStart={() => setIsItemHovered(true)}
      onHoverEnd={() => setIsItemHovered(false)}
      onFocus={() => setIsItemHovered(true)}
      onBlur={() => setIsItemHovered(false)}
      onClick={onClick}
      className={`dock-item ${className}`}
      tabIndex={0}
      role="button"
      aria-haspopup="true"
      style={{ minWidth: targetWidth, ...style }}
    >
      <MemoizedDockIcon isHovered={isItemHovered}>{icon}</MemoizedDockIcon>
      <MemoizedDockLabel isHovered={isItemHovered}>{label}</MemoizedDockLabel>
    </motion.div>
  );
}

const MemoizedDockItem = React.memo(DockItem);

function DockLabel({ children, className = '', isHovered }) {
  return (
    <motion.div
      initial={false}
      animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? -10 : 0 }}
      transition={{ duration: 0.15 }}
      className={`dock-label ${className}`}
      role="tooltip"
      style={{ x: '-50%', pointerEvents: 'none' }}
    >
      {children}
    </motion.div>
  );
}

const MemoizedDockLabel = React.memo(DockLabel);

function DockIcon({ children, className = '', isHovered }) {
  return <div className={`dock-icon ${className}`}>{children}</div>;
}

const MemoizedDockIcon = React.memo(DockIcon);

export default function Dock({
  items,
  className = '',
  spring = { mass: 0.1, stiffness: 200, damping: 20 },
  magnification = 70,
  distance = 200,
  panelHeight = 68,
  dockHeight = 256,
  baseItemSize = 50
}) {
  const mouseX = useMotionValue(Infinity);
  const [isHovered, setIsHovered] = useState(false);

  const maxHeight = useMemo(
    () => Math.max(dockHeight, magnification + magnification / 2 + 4),
    [magnification, dockHeight]
  );

  const height = useSpring(isHovered ? maxHeight : panelHeight, spring);

  return (
    <motion.div style={{ height, willChange: 'height' }} className="dock-outer">
      <motion.div
        onMouseMove={({ pageX }) => {
          setIsHovered(true);
          mouseX.set(pageX);
        }}
        onMouseLeave={() => {
          setIsHovered(false);
          mouseX.set(Infinity);
        }}
        className={`dock-panel ${className}`}
        style={{ height: panelHeight }}
        role="toolbar"
        aria-label="Application dock"
      >
        {items.map((item, index) => (
          <MemoizedDockItem
            key={index}
            onClick={item.onClick}
            magnification={magnification}
            baseItemSize={baseItemSize}
            icon={item.icon}
            label={item.label}
            width={item.width}
            style={item.style}
            className={item.className}
          />
        ))}
      </motion.div>
    </motion.div>
  );
}
