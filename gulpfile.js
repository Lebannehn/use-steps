import { src, dest, series } from 'gulp';
import ts from 'gulp-typescript';
import { deleteSync } from 'del';
import through from 'through2';


const dirs = {
	included: 'package/**/*.{ts}',
	dest: 'dist/package',
	root: 'dist',
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

function copyAndModifyManifest() {
	return src('./package.json')
		.pipe(
			through.obj(function (file, _, cb) {
				const packageJson = JSON.parse(file.contents.toString());
				packageJson.type = 'commonjs';
				packageJson.main = 'package/index.js';

				file.contents = Buffer.from(JSON.stringify(packageJson, null, 2));
				cb(null, file);
			})
		)
		.pipe(dest(dirs.root));
}

function copyRest() {
	return src([
			'./README.md',
			'./LICENSE'
		])
		.pipe(dest(dirs.root));
}

export const build = series(cleanup, compileTs, copyAndModifyManifest, copyRest);

export default build;
