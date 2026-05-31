import React from 'react'
import styled from 'styled-components'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  height: 100%;
`

const Title = styled.h1`
  margin: 0;
  font-size: 28px;
  color: #1f2937;
  font-weight: 600;
`

const CertificationsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  flex: 1;
  overflow-y: auto;
`

const CertificationItem = styled.div`
  padding: 15px;
  background: #f3f4f6;
  border-radius: 8px;
  border-left: 4px solid #f39c12;

  h3 {
    margin: 0 0 5px 0;
    color: #1f2937;
    font-size: 16px;
  }

  p {
    margin: 0;
    color: #6b7280;
    font-size: 14px;
  }
`

function CertificationsApp() {
  const certifications = []

  return (
    <Container>
      <CertificationsList>
        {certifications.map((cert, index) => (
          <CertificationItem key={index}>
            <h3>{cert.name}</h3>
            <p>{cert.issuer} • {cert.date}</p>
          </CertificationItem>
        ))}
      </CertificationsList>
    </Container>
  )
}

export default CertificationsApp
