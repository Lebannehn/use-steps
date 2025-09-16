import { ERROR_PREFIX } from './constants';


function throwError(message: string): Error {
	return new Error(ERROR_PREFIX + message);
}

export function hasNoStepsError(): Error {
	return throwError('No steps found!');
}
