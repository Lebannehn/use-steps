import { Dispatch, SetStateAction } from 'react';

export type UseStageReturn<T> = [
	T, () => void, () => void, (stage: T) => void, (stage: T) => boolean, Dispatch<SetStateAction<T[]>>
];

export const STAGE_MODE = {
	SEQUENTIAL: 'sequential',
	CIRCULAR: 'circular',
} as const;

export type TStageMode = typeof STAGE_MODE[keyof typeof STAGE_MODE];
