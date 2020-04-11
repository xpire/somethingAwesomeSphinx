import React, { useEffect } from 'react';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepContent from '@material-ui/core/StepContent';
import Paper from '@material-ui/core/Paper';
import { Typography } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button'


function getSteps() {
    return ['Client: generate alpha', 'Device: return beta', 'Client: generate rwd']
}
  
// function getStepContent(step) {
//     // dynamically generate this information
//     switch (step) {
//         case 0:
//             return `generating alpha`;
//         case 1:
//            return `send alpha, recieve beta`;
//         case 2:
//            return `generating rwd`;
//         default:
//             return `Unknown Step`
//     }
// }



export default function MyStepper({activeStep, stepContent, appear}) {
    // const [activeStep, setActiveStep] = React.useState(props);
    const steps = getSteps();

    // useEffect(() => {
    //     setActiveStep(props);
    // }, [props]);

    return (
        <div>
            <Stepper className='stepper' activeStep={activeStep} orientation="vertical">
                {steps.map((label, index) => (
                    <Step key={label} expanded={true}>
                        <StepLabel>{label}</StepLabel>
                        <StepContent>
                            {stepContent[index].split('\n').map((line, lineIndex) => (
                                <Typography key={label+index+lineIndex}>{line}</Typography>
                            ))}
                            {/* <Typography display="block">{stepContent[index]}</Typography> */}
                            {activeStep === index && (
                                <div>
                                    <CircularProgress/>
                                </div>
                            )}
                        </StepContent>
                    </Step>
                ))}
                </Stepper>
            {activeStep === steps.length && (
                <Paper square elevation={0}>
                    <Typography>Done.</Typography>
                </Paper>
            )}
        </div>
    )
}