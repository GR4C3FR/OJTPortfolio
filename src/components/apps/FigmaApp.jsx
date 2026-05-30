import styled from 'styled-components'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
  gap: 20px;
  color: white;
  text-align: center;
  padding: 40px;
`

const Icon = styled.img`
  width: 120px;
  height: 120px;
  object-fit: contain;
`

const Title = styled.h2`
  font-size: 28px;
  margin: 0;
  font-weight: 600;
  color: #111;
`

function FigmaApp() {
  return (
    <Container />
  )
}

export default FigmaApp
