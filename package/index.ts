import { useCallback, useEffect, useState } from 'react';

import { STAGE_MODE, TStageMode, TUseStageReturn } from './types';
import { NO_STAGE } from './constants';
import { hasNoStagesError } from './error';


type TProps<T> = {
	stageList: T[],
	mode: TStageMode,
};

/**
 * Set up a stage list and control it with handlers.
 *
 * @template T
 * @param {Array<T>} stageList
 * @param {boolean} isCircular
 */
const useStage = <T>({ stageList = [], mode = STAGE_MODE.SEQUENTIAL }: TProps<T>): TUseStageReturn<T> => {
	const [availableStages, setAvailableStages] = useState(stageList);
	const [currentStageIndex, setCurrentStageIndex] = useState(0);

	useEffect(() => {
		setCurrentStageIndex(stageList.length ? 0 : NO_STAGE);
	}, []);

	const _checkStageListSanity = useCallback(() => {
		if (currentStageIndex === NO_STAGE) {
			throw hasNoStagesError();
		}
	}, [currentStageIndex]);

	const _canProceed = useCallback(
		() => {
			if (stageList.length === 1 || currentStageIndex === stageList.length - 1) {
				return false;
			}
		},
		[stageList, currentStageIndex]
	);

	const nextStage = () => {
		_checkStageListSanity();
		if (_canProceed()) {
			setCurrentStageIndex(currentStageIndex + 1);
		}
	};
	const previousStage = () => {
		_checkStageListSanity();
		if (_canProceed()) {
			setCurrentStageIndex(currentStageIndex - 1);
		}
	};
	const setStage = (stage: T) => {
		_checkStageListSanity();
		if (stageList.length === 1) {
			return;
		}
		setCurrentStageIndex(availableStages.indexOf(stage));
	};

	const hasStage = (stage: T) => availableStages.includes(stage);

	return [
		availableStages[currentStageIndex],
		nextStage,
		previousStage,
		setStage,
		hasStage
	];
};

export default useStage;
