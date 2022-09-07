import React, { Component, ErrorInfo, ReactNode } from 'react'
import './ErrorBoundry.sass'
import { Box } from '@mui/material'

interface Props {
  children?: ReactNode
}

interface State {
  hasError: boolean
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  }

  public static getDerivedStateFromError (_: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true }
  }

  public componentDidCatch (error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo)
  }

  private Span (content: string) {
    return (<Box component='span' sx={{ '&:after, &:before': { content: `"${content}"` } }}>{content}</Box>)
  }

  public render () {
    if (this.state.hasError) {
      return (
        <div className={'errorboundry'}>
          <div className={'errorboundry-container'}>
            <Box component='h1' sx={{ '&:after, &:before': { content: '"FEHLER"' } }}>Fehler</Box>
            <p>Die Dinge sind hier ein wenig {this.Span('unstabil')}</p>
            <p>Komm später wieder vorbei</p>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
