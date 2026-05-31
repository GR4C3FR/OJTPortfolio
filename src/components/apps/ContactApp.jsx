import React, { useState } from 'react'
import styled from 'styled-components'

const Container = styled.div`
  display: grid;
  grid-template-columns: minmax(240px, 0.9fr) minmax(300px, 1.1fr);
  gap: 12px;
  align-items: stretch;
  width: 100%;
  height: 100%;
  overflow: hidden;
  box-sizing: border-box;
  font-family: 'JetBrains Mono', monospace;

  @media (max-width: 760px) {
    grid-template-columns: 1fr;
  }
`

const Panel = styled.section`
  border-radius: 0;
  padding: 20px;
  background: transparent;
  border: 0;
  box-shadow: none;
  backdrop-filter: none;
`

const LeftPanel = styled(Panel)`
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-height: 0;
`

const RightPanel = styled(Panel)`
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-height: 0;
  margin-top: 1px;
`

const Eyebrow = styled.p`
  margin: 0;
  font-size: 0.65rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #7c8798;
`

const Title = styled.h2`
  margin: 0;
  font-size: 1.05rem;
  line-height: 1.1;
  color: #111827;
`

const Copy = styled.p`
  margin: 0;
  color: #475569;
  line-height: 1.45;
  font-size: 0.82rem;
  padding-bottom: 4px;
`

const InfoList = styled.div`
  margin-top: 6px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`

const InfoRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1px;
  padding: 8px 10px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.72);
  border: 1px solid rgba(15, 23, 42, 0.06);
`

const InfoText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
`

const InfoLabel = styled.span`
  font-size: 0.55rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: #7c8798;
`

const InfoValue = styled.span`
  color: #111827;
  font-weight: 600;
  font-size: 0.75rem;
  word-break: break-word;
`

const ContactLink = styled.a`
  color: inherit;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`

const SocialRow = styled.div`
  padding-top: 7px;
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`

const SocialLink = styled.a`
  width: auto;
  height: auto;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: 0;
  padding: 0;
  transition: transform 180ms ease, opacity 180ms ease;

  &:hover {
    transform: translateY(-2px);
    opacity: 0.85;
  }

  img {
    width: 32px;
    height: 32px;
    display: block;
  }
`

const Form = styled.form`
  display: grid;
  gap: 7px;
`

const Field = styled.label`
  display: grid;
  gap: 4px;
  color: #111827;
  font-size: 0.72rem;
  font-weight: 600;
`

const Input = styled.input`
  width: 100%;
  padding: 8px 10px;
  border: 1px solid rgba(15, 23, 42, 0.14);
  border-radius: 8px;
  font-size: 0.78rem;
  font-family: inherit;
  background: rgba(255, 255, 255, 0.92);

  &:focus {
    outline: none;
    border-color: rgba(17, 24, 39, 0.3);
    box-shadow: 0 0 0 3px rgba(17, 24, 39, 0.08);
  }
`

const Textarea = styled.textarea`
  width: 100%;
  height: 105px;
  padding: 8px 10px;
  border: 1px solid rgba(15, 23, 42, 0.14);
  border-radius: 8px;
  font-size: 0.78rem;
  font-family: inherit;
  resize: none;
  background: rgba(255, 255, 255, 0.92);

  &:focus {
    outline: none;
    border-color: rgba(17, 24, 39, 0.3);
    box-shadow: 0 0 0 3px rgba(17, 24, 39, 0.08);
  }
`

const Button = styled.button`
  justify-self: start;
  padding: 8px 12px;
  border: none;
  border-radius: 999px;
  background: #111827;
  color: #fff;
  font-size: 0.74rem;
  font-weight: 700;
  cursor: pointer;
  transition: transform 180ms ease, opacity 180ms ease;

  &:hover {
    transform: translateY(-1px);
    opacity: 0.92;
  }

  &:disabled {
    cursor: progress;
    opacity: 0.7;
  }
`

const Status = styled.div`
  padding: 8px 10px;
  border-radius: 8px;
  font-size: 0.72rem;
  line-height: 1.5;
  background: ${({ $tone }) => ($tone === 'success' ? 'rgba(34, 197, 94, 0.12)' : 'rgba(239, 68, 68, 0.12)')};
  color: ${({ $tone }) => ($tone === 'success' ? '#166534' : '#991b1b')};
  border: 1px solid ${({ $tone }) => ($tone === 'success' ? 'rgba(34, 197, 94, 0.22)' : 'rgba(239, 68, 68, 0.22)')};
`

function ContactApp() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [status, setStatus] = useState({ tone: '', text: '' })

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setIsSubmitting(true)
    setStatus({ tone: '', text: '' })

    try {
      const response = await fetch('https://formspree.io/f/xvzynvdn', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      if (!response.ok) {
        throw new Error('Form submission failed')
      }

      setFormData({ name: '', email: '', subject: '', message: '' })
      setStatus({ tone: 'success', text: 'Message sent. I will get back to you as soon as I can.' })
    } catch (error) {
      setStatus({ tone: 'error', text: 'Something went wrong while sending the message. Please try again.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Container>
      <LeftPanel>
        <div>
          <Title>Let&apos;s work together.</Title>
        </div>

        <Copy>
          Whether you&apos;ve got a project idea, a job opportunity, or just want to say hi, feel free to drop a
          message. I&apos;ll get back to you as soon as I can!
        </Copy>

        <InfoList>
          <InfoRow>
            <InfoText>
              <InfoLabel>Email</InfoLabel>
              <InfoValue>
                <ContactLink href="mailto:garcia.charlesdan@gmail.com">garcia.charlesdan@gmail.com</ContactLink>
              </InfoValue>
            </InfoText>
          </InfoRow>

          <InfoRow>
            <InfoText>
              <InfoLabel>Location</InfoLabel>
              <InfoValue>Arayat, Pampanga</InfoValue>
            </InfoText>
          </InfoRow>

          <InfoRow>
            <InfoText>
              <InfoLabel>Status</InfoLabel>
              <InfoValue>Open to opportunities</InfoValue>
            </InfoText>
          </InfoRow>
        </InfoList>

        <SocialRow>
          <SocialLink href="https://www.linkedin.com/in/charles-garcia-9b6b1934b/" target="_blank" rel="noreferrer" aria-label="LinkedIn">
            <img src="/linkedin.svg" alt="LinkedIn" />
          </SocialLink>
          <SocialLink href="https://github.com/GR4C3FR" target="_blank" rel="noreferrer" aria-label="GitHub">
            <img src="/github.svg" alt="GitHub" />
          </SocialLink>
          <SocialLink href="https://www.instagram.com/gracefourthree/" target="_blank" rel="noreferrer" aria-label="Instagram">
            <img src="/instagram.svg" alt="Instagram" />
          </SocialLink>
        </SocialRow>
      </LeftPanel>

      <RightPanel>
        <Form onSubmit={handleSubmit}>
          <Field>
            Name
            <Input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your full name"
              required
            />
          </Field>

          <Field>
            Email
            <Input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
            />
          </Field>

          <Field>
            Subject
            <Input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              placeholder="What would you like to talk about?"
              required
            />
          </Field>

          <Field>
            Message
            <Textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Write your message here..."
              required
            />
          </Field>

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Sending...' : 'Send'}
          </Button>

          {status.text ? <Status $tone={status.tone}>{status.text}</Status> : null}
        </Form>
      </RightPanel>
    </Container>
  )
}

export default ContactApp
