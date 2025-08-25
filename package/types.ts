export type TUseStageReturn<T> = [T, () => void, () => void, (stage: T) => void, (stage: T) => boolean];

export const STAGE_MODE = {
	SEQUENTIAL: 'sequential',
	CIRCULAR: 'circular',
} as const;

export type TStageMode = typeof STAGE_MODE[keyof typeof STAGE_MODE];
