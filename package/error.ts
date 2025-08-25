import { ERROR_PREFIX } from './constants';


function throwError(message: string): Error {
	return new Error(ERROR_PREFIX + message);
}

export function hasNoStagesError(): Error {
	return throwError('No stages found!');
}
