import React, { useState } from 'react'
import styled from 'styled-components'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`

const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`

const Title = styled.h2`
  color: #2c3e50;
  font-size: 18px;
  margin-bottom: 5px;
  border-bottom: 2px solid #f39c12;
  padding-bottom: 5px;
`

const ContactLink = styled.a`
  display: flex;
  align-items: center;
  gap: 10px;
  color: #f39c12;
  text-decoration: none;
  font-size: 14px;
  padding: 10px;
  background: #fef5e7;
  border-radius: 4px;
  transition: all 0.3s ease;

  &:hover {
    background: #fdebd0;
    transform: translateX(5px);
  }
`

const Icon = styled.span`
  font-size: 18px;
`

const Form = styled.form`
  display: none;
`

const Input = styled.input`
  padding: 10px;
  border: 1px solid #bdc3c7;
  border-radius: 4px;
  font-size: 14px;
  font-family: inherit;

  &:focus {
    outline: none;
    border-color: #f39c12;
    box-shadow: 0 0 0 3px rgba(243, 156, 18, 0.1);
  }
`

const Textarea = styled.textarea`
  padding: 10px;
  border: 1px solid #bdc3c7;
  border-radius: 4px;
  font-size: 14px;
  font-family: inherit;
  resize: vertical;
  min-height: 100px;

  &:focus {
    outline: none;
    border-color: #f39c12;
    box-shadow: 0 0 0 3px rgba(243, 156, 18, 0.1);
  }
`

const Button = styled.button`
  padding: 10px 20px;
  background: #f39c12;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #e67e22;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(243, 156, 18, 0.3);
  }

  &:active {
    transform: translateY(0);
  }
`

const Message = styled.div`
  padding: 10px;
  background: #d5f4e6;
  color: #27ae60;
  border-radius: 4px;
  font-size: 13px;
`

function ContactApp() {
  const [submitted, setSubmitted] = useState(false)
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
    setFormData({ name: '', email: '', message: '' })
    setTimeout(() => setSubmitted(false), 3000)
  }

  return (
    <Container>
    </Container>
  )
}

export default ContactApp
