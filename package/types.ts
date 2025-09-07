import { Dispatch, SetStateAction } from 'react';

export type UseStepsReturn<T> = [
	T, () => void, () => void, (stage: T) => void, (stage: T) => boolean, Dispatch<SetStateAction<T[]>>
];
