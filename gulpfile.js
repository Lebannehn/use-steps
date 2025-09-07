import { dest, series } from 'gulp';
import ts from 'gulp-typescript';
import { deleteSync } from 'del';


const dirs = {
	included: 'package/**/*.{ts}',
	dest: 'dest/',
};

function cleanup(done) {
	deleteSync([dirs.dest]);
	done();
}

function compileTs() {
	const project = ts.createProject('tsconfig.json');
	const result = project.src().pipe(project());

	result.js.pipe(dest(dirs.dest));
	result.dts.pipe(dest(dirs.dest));

	return result;
}

function transpileJs() {

}

export const build = series(cleanup, compileTs);

export default build;
