# use-steps

A custom [React](https://reactjs.de) hook to control ui/wizard/page stages or steps.

Supports circular and sequential transitions.

### Installation

> npm i @27-lanterns/use-steps

### Params

| Param | type     | Optional? | Default value | Description                                                                              |
|------|----------|-----------|---------------|------------------------------------------------------------------------------------------|
| stepsList | `T[]`    | No        | -             | An array of available steps to go through                                                |
| isCircular | `boolean` | Yes       | `false`       | Are controls circular (i.e. you go to the first step after the last one and vice versa)? |

### Usage

```tsx
import React, { FC } from 'react';
import useSteps from '@27-lanterns/use-steps';

const availableSteps: string[] = ['Beginning', 'Intermission', 'Ending'];
const altrenateSteps: string[] = ['Intro', 'Culmination', 'B-roll'];

const SomeWizardComponent: FC = () => {
	const [currentStep, nextStep, previousStep, setStep, hasStep, setAvailableSteps] = useSteps({
		stepsList: availableSteps,
		isCircular: false
	});

	return <>
        <article>
            <h2>{currentStep}</h2>
            <p>Has intermission? {hasStep(availableSteps[1]) ? 'Yes' : 'No'}</p>
        </article>
        <button onClick={nextStep}>Previous</button>
        <button onClick={nextStep}>Next</button>
        <button onClick={() => setStep(availableSteps[2])}>FastForward</button>
        <button onClick={() => setAvailableSteps(altrenateSteps)}>Change steps</button>
    </>;
};
```
