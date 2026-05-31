import styled from 'styled-components'

import CircularGallery from './CircularGallery'

const Container = styled.div`
  position: relative;
  height: 100%;
  width: 100%;
  overflow: hidden;
  background: #ffffff;
`

const GalleryShell = styled.div`
  width: 100%;
  height: 100%;
  padding: 0 18px 28px;
  transform: translateY(-20px);
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
  return (
    <Container>
      <GalleryShell>
        <CircularGallery items={CERTIFICATION_ITEMS} bend={1.5} textColor="#000000" borderRadius={0.06} font="bold 30px Manrope" imageScale={1.5} scrollSpeed={1.6} scrollEase={0.08} onItemClick={onOpenPreview} />
      </GalleryShell>
      <ViewMoreButton type="button" onClick={() => window.open(VIEW_MORE_URL, '_blank', 'noopener,noreferrer')}>View More</ViewMoreButton>
    </Container>
  )
}

export default CertificationsApp
