import React, { useMemo, lazy, Suspense } from 'react'
import styled from 'styled-components'
const Masonry = lazy(() => import('./Masonry'))

const Container = styled.div`
  width: 100%;
  height: 100%;
  background: #ffffff;
  padding: 16px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 14px;

  @media (max-width: 600px) {
    padding: 12px;
    gap: 10px;
  }
`

const Title = styled.h2`
  margin: 0;
  font-size: 1rem;
  color: #111827;
  font-family: 'Manrope', sans-serif;

  @media (max-width: 600px) {
    font-size: 0.95rem;
  }
`

const Subtitle = styled.p`
  margin: 0;
  font-size: 0.85rem;
  color: #4b5563;
  font-family: 'Manrope', sans-serif;
  line-height: 1.4;

  @media (max-width: 600px) {
    font-size: 0.8rem;
  }
`

const MasonryWrapper = styled.div`
  flex: 1;
  min-height: 0;
  border-radius: 18px;
  overflow: hidden;
  background: #f8fafc;
  position: relative;

  @media (max-width: 1024px) {
    overflow-y: auto;
    overflow-x: hidden;
    -webkit-overflow-scrolling: touch;
  }
`

function OthersApp() {
  const items = useMemo(
    () => [
      { id: '1', img: '/1.webp', height: 420 },
      { id: '2', img: '/2.webp', height: 360 },
      { id: '3', img: '/3.webp', height: 520 },
      { id: '4', img: '/4.webp', height: 460 },
      { id: '5', img: '/5.webp', height: 380 },
      { id: '6', img: '/6.webp', height: 520 },
      { id: '7', img: '/7.webp', height: 300 },
      { id: '8', img: '/8.webp', height: 440 },
      { id: '9', img: '/9.webp', height: 500 },
      { id: '10', img: '/10.webp', height: 340 },
      { id: '11', img: '/11.webp', height: 620 },
      { id: '12', img: '/12.webp', height: 280 },
      { id: '13', img: '/13.webp', height: 560 }
    ],
    []
  )

  return (
    <Container>
      <MasonryWrapper>
        <Suspense fallback={<div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6b7280' }}>Loading gallery…</div>}>
          <Masonry
            items={items}
            ease="power3.out"
            duration={0.6}
            stagger={0.05}
            animateFrom="center"
            scaleOnHover={true}
            hoverScale={0.95}
            blurToFocus={true}
            colorShiftOnHover={false}
          />
        </Suspense>
      </MasonryWrapper>
    </Container>
  )
}

export default OthersApp
