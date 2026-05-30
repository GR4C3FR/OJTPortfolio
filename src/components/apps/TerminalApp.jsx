import React, { useState, useRef, useEffect } from 'react'
import styled from 'styled-components'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #1e1e1e;
  font-family: 'Courier New', monospace;
  padding: 10px;
  gap: 10px;
`

const Output = styled.div`
  flex: 1;
  overflow-y: auto;
  color: #00ff00;
  font-size: 13px;
  line-height: 1.5;
  white-space: pre-wrap;
  word-wrap: break-word;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: #2d2d2d;
  }

  &::-webkit-scrollbar-thumb {
    background: #555;
    border-radius: 3px;
  }
`

const InputLine = styled.div`
  display: flex;
  gap: 5px;
  color: #00ff00;
  font-size: 13px;
`

const Prompt = styled.span`
  color: #00ff00;
  font-weight: bold;
`

const Input = styled.input`
  flex: 1;
  background: transparent;
  border: none;
  color: #00ff00;
  font-family: 'Courier New', monospace;
  font-size: 13px;
  outline: none;
  caret-color: #00ff00;
`

function TerminalApp() {
  const [output, setOutput] = useState([])
  const [input, setInput] = useState('')
  const inputRef = useRef(null)
  const outputRef = useRef(null)

  useEffect(() => {
    outputRef.current?.scrollTo(0, outputRef.current.scrollHeight)
  }, [output])

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const commands = {}

  const handleSubmit = (e) => {
    e.preventDefault()
  }

  return (
    <Container>
      <Output ref={outputRef}>
        {output.map((line, idx) => (
          <div key={idx}>{line}</div>
        ))}
      </Output>
      <InputLine>
        <Prompt>$</Prompt>
        <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '5px', flex: 1 }}>
          <Input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            autoComplete="off"
            spellCheck="false"
          />
        </form>
      </InputLine>
    </Container>
  )
}

export default TerminalApp
