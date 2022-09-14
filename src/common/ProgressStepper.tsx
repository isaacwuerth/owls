import * as React from 'react'
import { Children, PropsWithChildren, ReactNode } from 'react'
import Box from '@mui/material/Box'
import Stepper from '@mui/material/Stepper'
import Step from '@mui/material/Step'
import StepLabel from '@mui/material/StepLabel'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'

const steps = ['Select campaign settings', 'Create an ad group', 'Create an ad']

interface HorizontalLinearStepperProps {
  children: Array<React.ReactElement<StepProps>> | React.ReactElement<StepProps>
}

export default function HorizontalLinearStepper({
  children,
}: HorizontalLinearStepperProps) {
  const [activeStep, setActiveStep] = React.useState(0)
  const [skipped, setSkipped] = React.useState(new Set<number>())
  const child: ReactNode = Children.toArray(children)[activeStep]

  const isStepOptional = () => {
    // @ts-expect-error
    return child.props.optional
  }

  const isStepSkipped = (step: number) => {
    return skipped.has(step)
  }

  const handleNext = () => {
    let newSkipped = skipped
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values())
      newSkipped.delete(activeStep)
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1)
    setSkipped(newSkipped)
  }

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1)
  }

  const handleSkip = () => {
    if (!isStepOptional()) {
      // You probably want to guard against something like this,
      // it should never occur unless someone's actively trying to break something.
      throw new Error("You can't skip a step that isn't optional.")
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1)
    setSkipped((prevSkipped) => {
      const newSkipped = new Set(prevSkipped.values())
      newSkipped.add(activeStep)
      return newSkipped
    })
  }

  const handleReset = () => {
    setActiveStep(0)
  }

  const header = Children.map(children, (element, index) => {
    if (!React.isValidElement(element)) return null
    const { title, optional, error } = element.props
    const stepProps: { completed?: boolean } = {}
    if (isStepSkipped(index)) {
      stepProps.completed = false
    }
    return (
      <Step key={title} title={title} {...stepProps}>
        <StepLabel
          error={error}
          optional={
            optional && <Typography variant="caption">Optional</Typography>
          }
        >
          {title}
        </StepLabel>
      </Step>
    )
  })

  return (
    <Box sx={{ width: '100%' }}>
      <Stepper activeStep={activeStep} sx={{ marginBottom: '15px' }}>
        {header}
      </Stepper>
      {activeStep === steps.length - 1 ? (
        <React.Fragment>
          <Typography sx={{ mt: 2, mb: 1 }}>{child}</Typography>
          <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
            <Box sx={{ flex: '1 1 auto' }} />
            <Button onClick={handleReset}>Reset</Button>
          </Box>
        </React.Fragment>
      ) : (
        <React.Fragment>
          {child}
          <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
            <Button
              color="inherit"
              disabled={activeStep === 0}
              onClick={handleBack}
              sx={{ mr: 1 }}
            >
              Back
            </Button>
            <Box sx={{ flex: '1 1 auto' }} />
            {isStepOptional() && (
              <Button color="inherit" onClick={handleSkip} sx={{ mr: 1 }}>
                Skip
              </Button>
            )}
            <Button onClick={handleNext}>
              {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
            </Button>
          </Box>
        </React.Fragment>
      )}
    </Box>
  )
}

interface StepProps extends PropsWithChildren {
  title: string
  optional?: boolean
  error?: boolean
}

export function HorizontalLinearStep({ children }: StepProps) {
  return children as JSX.Element
}
