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
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
`

const Title = styled.h2`
  font-size: 28px;
  margin: 0;
  font-weight: 600;
`

const Description = styled.p`
  font-size: 14px;
  margin: 0;
  color: rgba(255, 255, 255, 0.8);
  max-width: 300px;
`

function LightroomApp() {
  return (
    <Container>
      <Icon src="/lightroom.svg" alt="Adobe Lightroom Classic" />
      <Title>Adobe Lightroom Classic</Title>
      <Description>Photo management and editing software for photographers</Description>
    </Container>
  )
}

export default LightroomApp
