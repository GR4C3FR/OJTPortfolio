import styled from 'styled-components'

const Container = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
  gap: 28px;
  color: white;
  text-align: left;
  padding: 32px;
  font-family: 'Jetbrains', monospace;
`

const Icon = styled.img`
  width: 67px;
  height: 67px;
  object-fit: contain;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.35));
  margin-left: 25px;
  margin-bottom: 10px;
`

const Title = styled.h3`
  font-size: 15px;
  margin: 0 0 8px 0;
  font-weight: 200;
`

const Description = styled.p`
  font-size: 16px;
  margin: 0;
  color: rgba(255, 255, 255, 0.9);
  max-width: 420px;
`

const Right = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  align-items: flex-start;
  justify-content: center;
`

function LightroomApp() {
  return (
    <Container>
      <Icon src="/lightroom.svg" alt="Lightroom" />
      <Right>
        <Title>Don't judge me when I overexpose photos.</Title>
        <Description />
      </Right>
    </Container>
  )
}

export default LightroomApp
