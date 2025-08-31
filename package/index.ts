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
		(isForwardDirection = true) => {
			if (availableStages.length === 1) {
				console.log('checking can proceed - no');
				return false;
			}

			if (mode === STAGE_MODE.SEQUENTIAL) {
				if (isForwardDirection) {
					console.log('checking can proceed - no');
					return currentStageIndex !== availableStages.length - 1;
				} else {
					console.log('checking can proceed - no');
					return currentStageIndex !== 0;
				}
			}
			console.log('checking can proceed - yes');

			return true;
		},
		[availableStages, currentStageIndex]
	);

	const nextStage = () => {
		console.log('next stage');
		_checkStageListSanity();
		console.log('next stage - ok');
		if (_canProceed(true)) {
			setCurrentStageIndex(currentStageIndex + 1);
		}
	};
	const previousStage = () => {
		console.log('previous stage');
		_checkStageListSanity();
		console.log('previous stage - ok');
		if (_canProceed(false)) {
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
