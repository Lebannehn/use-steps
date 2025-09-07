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
	const [availableStages, setAvailableStages] = useState(stepsList);
	const [currentStageIndex, setCurrentStageIndex] = useState(0);

	useEffect(() => {
		setCurrentStageIndex(stepsList.length ? 0 : NO_STAGE);
	}, []);

	const _canProceed = useCallback(
		(isForwardDirection: 0 | 1 = 1) => {
			if (currentStageIndex === NO_STAGE) {
				throw hasNoStagesError();
			}
			if (availableStages.length === 1) {
				return false;
			}

			if (!isCircular) {
				if (isForwardDirection) {
					return currentStageIndex !== availableStages.length - 1;
				} else {
					return currentStageIndex !== 0;
				}
			}

			return true;
		},
		[availableStages, currentStageIndex]
	);

	const nextStage = () => {
		if (_canProceed(1)) {
			setCurrentStageIndex(
				isCircular && currentStageIndex === availableStages.length - 1
					? 0
					: currentStageIndex + 1
			);
		}
	};
	const previousStage = () => {
		if (_canProceed(0)) {
			setCurrentStageIndex(
				isCircular && currentStageIndex === 0
					? availableStages.length - 1
					: currentStageIndex - 1
			);
		}
	};
	const setStage = (stage: T) => {
		if (availableStages.length !== 1) {
			setCurrentStageIndex(availableStages.indexOf(stage));
		}
	};

	const hasStage = (stage: T) => availableStages.includes(stage);

	return [
		availableStages[currentStageIndex],
		nextStage,
		previousStage,
		setStage,
		hasStage,
		setAvailableStages
	];
};

export default useSteps;
