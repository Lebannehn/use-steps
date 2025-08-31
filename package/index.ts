import { useCallback, useEffect, useState } from 'react';

import { STAGE_MODE, TStageMode, UseStageReturn } from './types';
import { NO_STAGE } from './constants';
import { hasNoStagesError } from './error';


type Props<T> = {
	stageList: T[],
	mode?: TStageMode,
};

/**
 * Set up a stage list and control it with handlers.
 *
 * @template T
 * @param {Array<T>} stageList
 * @param {boolean} isCircular
 */
const useStage = <T>({ stageList = [], mode = STAGE_MODE.SEQUENTIAL }: Props<T>): UseStageReturn<T> => {
	const [availableStages, setAvailableStages] = useState(stageList);
	const [currentStageIndex, setCurrentStageIndex] = useState(0);

	useEffect(() => {
		setCurrentStageIndex(stageList.length ? 0 : NO_STAGE);
	}, []);

	const _canProceed = useCallback(
		(isForwardDirection = true) => {
			if (currentStageIndex === NO_STAGE) {
				throw hasNoStagesError();
			}
			if (availableStages.length === 1) {
				return false;
			}

			if (mode === STAGE_MODE.SEQUENTIAL) {
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
		if (_canProceed(true)) {
			setCurrentStageIndex(
				mode === STAGE_MODE.CIRCULAR && currentStageIndex === availableStages.length - 1
					? 0
					: currentStageIndex + 1
			);
		}
	};
	const previousStage = () => {
		if (_canProceed(false)) {
			setCurrentStageIndex(
				mode === STAGE_MODE.CIRCULAR && currentStageIndex === 0
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

export default useStage;
