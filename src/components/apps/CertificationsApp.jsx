import styled from 'styled-components'
import { useEffect, useState } from 'react'

import CircularGallery from './CircularGallery'

const Container = styled.div`
  position: relative;
  height: 100%;
  width: 100%;
  overflow: hidden;
  background: #ffffff;

  @media (max-width: 600px) {
    touch-action: pan-y;
  }
`

const GalleryShell = styled.div`
  width: 100%;
  height: 100%;
  padding: 0 18px 28px;
  transform: translateY(-20px);

  @media (max-width: 900px) {
    padding: 0 12px 72px;
    transform: translateY(-8px);
  }

  @media (max-width: 600px) {
    padding: 0 10px 72px;
  }
`

const ViewMoreButton = styled.button`
  position: absolute;
  left: 50%;
  bottom: 18px;
  transform: translateX(-50%);
  margin-bottom: 5px;
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

  &:hover {
    transform: translateX(-50%) translateY(-1px);
    opacity: 0.92;
  }

  &:disabled {
    cursor: progress;
    opacity: 0.7;
  }

  @media (max-width: 600px) {
    bottom: 12px;
    font-size: 0.68rem;
    padding: 7px 11px;
  }
`

const VIEW_MORE_URL = 'https://drive.google.com/drive/u/5/folders/1mwjg1zE42E1seDnZrLZRnbIu6Vtd4Ve4'

const CERTIFICATION_ITEMS = [
  { image: '/Basics of UI UX.webp', text: 'Basics of UI UX' },
  { image: '/Introduction to Figma.webp', text: 'Introduction to Figma' },
  { image: '/Introduction to PHP.webp', text: 'Introduction to PHP' },
  { image: '/JavaScript Essentials 1.webp', text: 'JavaScript Essentials 1' },
  { image: '/Legacy Javascript.webp', text: 'Legacy JavaScript' },
  { image: '/Responsive Web Design.webp', text: 'Responsive Web Design' }
]

function CertificationsApp({ onOpenPreview }) {
  const [viewport, setViewport] = useState(() => ({
    width: typeof window !== 'undefined' ? window.innerWidth : 1280,
    height: typeof window !== 'undefined' ? window.innerHeight : 800,
  }))

  useEffect(() => {
    const updateViewport = () => setViewport({ width: window.innerWidth, height: window.innerHeight })
    updateViewport()
    window.addEventListener('resize', updateViewport)
    return () => window.removeEventListener('resize', updateViewport)
  }, [])

  const fontSize = viewport.width <= 480 ? 18 : viewport.width <= 900 ? 24 : 30
  const imageScale = viewport.width <= 480 ? 1.2 : viewport.width <= 900 ? 1.35 : 1.5

  return (
    <Container>
      <GalleryShell>
        <CircularGallery items={CERTIFICATION_ITEMS} bend={1.5} textColor="#000000" borderRadius={0.06} font={`bold ${fontSize}px Manrope`} imageScale={imageScale} scrollSpeed={1.6} scrollEase={0.08} onItemClick={onOpenPreview} />
      </GalleryShell>
      <ViewMoreButton type="button" onClick={() => window.open(VIEW_MORE_URL, '_blank', 'noopener,noreferrer')}>View More</ViewMoreButton>
    </Container>
  )
}

export default CertificationsApp
