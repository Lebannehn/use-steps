import { useCallback, useEffect, useState } from 'react';

import { UseStepsReturn } from './types';
import { NO_STAGE } from './constants';
import { hasNoStagesError } from './error';


type Props<T> = {
	/**
	 * List of steps.
	 *
	 * @example ['step1', 'step2', 'step3']
	 */
	stepsList: T[],
	/**
	 * Circular or sequential mode.
	 *
	 * @example true
	 * @dafeult false
	 */
	isCircular?: boolean,
};

/**
 * Set up a stage list and control it with handlers.
 *
 * @template T
 * @param {Array<T>} stepsList
 * @param {boolean} isCircular
 */
const useSteps = <T>({ stepsList, isCircular = false }: Props<T>): UseStepsReturn<T> => {
	const [availableSteps, setAvailableSteps] = useState(stepsList);
	const [currentStageIndex, setCurrentStageIndex] = useState(0);

	useEffect(() => {
		setCurrentStageIndex(stepsList.length ? 0 : NO_STAGE);
	}, []);

	const _canProceed = useCallback(
		(isForwardDirection: 0 | 1 = 1) => {
			if (currentStageIndex === NO_STAGE) {
				throw hasNoStagesError();
			}
			if (availableSteps.length === 1) {
				return false;
			}

			if (!isCircular) {
				if (isForwardDirection) {
					return currentStageIndex !== availableSteps.length - 1;
				} else {
					return currentStageIndex !== 0;
				}
			}

			return true;
		},
		[availableSteps, currentStageIndex]
	);

	const nextStep = () => {
		if (_canProceed(1)) {
			setCurrentStageIndex(
				isCircular && currentStageIndex === availableSteps.length - 1
					? 0
					: currentStageIndex + 1
			);
		}
	};
	const previousStep = () => {
		if (_canProceed(0)) {
			setCurrentStageIndex(
				isCircular && currentStageIndex === 0
					? availableSteps.length - 1
					: currentStageIndex - 1
			);
		}
	};
	const setStep = (stage: T) => {
		if (availableSteps.length !== 1) {
			setCurrentStageIndex(availableSteps.indexOf(stage));
		}
	};

	const hasStep = (stage: T) => availableSteps.includes(stage);

	return [
		availableSteps[currentStageIndex],
		nextStep,
		previousStep,
		setStep,
		hasStep,
		setAvailableSteps
	];
};

export default useSteps;
