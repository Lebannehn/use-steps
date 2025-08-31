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
		console.log(availableStages);
		console.log(currentStageIndex);
	}, [availableStages, currentStageIndex]);

	useEffect(() => {
		setCurrentStageIndex(stageList.length ? 0 : NO_STAGE);
	}, []);

	const _checkStageListSanity = useCallback(() => {
		console.log('checking sanity');
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
		console.log('next stage');
		_checkStageListSanity();
		console.log('next stage - ok');
		if (_canProceed()) {
			setCurrentStageIndex(currentStageIndex + 1);
		}
	};
	const previousStage = () => {
		console.log('previous stage');
		_checkStageListSanity();
		console.log('previous stage - ok');
		if (_canProceed()) {
			setCurrentStageIndex(currentStageIndex - 1);
		}
	};
	const setStage = (stage: T) => {
		console.log('setting stage');
		_checkStageListSanity();
		if (stageList.length === 1) {
			return;
		}
		console.log('setting stage - ok');
		setCurrentStageIndex(availableStages.indexOf(stage));
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
