import { findUp } from 'find-up';
import fs from 'fs/promises';
import { glob } from 'glob';
import path from 'path';
import process from 'process';

const silent = process.argv.includes('--silent') || process.argv.includes('-s');

const log = silent ? () => void 0 : console.log;

async function readJson<T = any>(filepath: string) {
	const file = await fs.readFile(filepath, 'utf-8').catch(() => null);
	return (file ? JSON.parse(file) : null) as T;
}

async function getPackages(cwd: string) {
	const packageJson = await readJson(path.join(cwd, 'package.json'));
	if (typeof packageJson !== 'object' || !packageJson || !('workspaces' in packageJson)) {
		return [];
	}

	if (typeof packageJson.workspaces !== 'object' || !packageJson.workspaces) return [];

	const packages: string[] = Array.isArray(packageJson.workspaces)
		? packageJson.workspaces
		: packageJson.workspaces.packages;

	return packages.flatMap((name) => glob.sync(`${name}/`, { cwd }));
}

export async function linkPackage(pkgPath: string) {
	const packageJson = path.resolve(pkgPath, 'package.json');

	const pkg = await readJson(packageJson);
	if (!pkg) return;

	const target = path.resolve(pkgPath, String(pkg.publishConfig?.directory || '.'));
	const link = path.resolve('node_modules', String(pkg.name));
	if (target === link) return;

	try {
		// abort if the symlink already exists, recreating might trigger file watchers
		const stat = await fs.lstat(link).catch(() => null);
		if (!stat || (stat?.isSymbolicLink() && (await fs.readlink(link)) === link)) return;

		await fs.rm(link, { recursive: true, force: true }).catch(() => null);
		await fs.mkdir(path.dirname(link), { recursive: true });

		if (process.platform === 'win32' && path.isAbsolute(target)) {
			// use junctions on windows, they do require absolute paths
			await fs.symlink(target, link, 'junction');
		} else {
			// use relative paths so that the symlink can be moved around the filesystem
			await fs.symlink(path.relative(path.dirname(link), target) || '.', link);
		}
		log(`symlink - ${pkg.name} -> ${path.relative(path.join(link, '..'), target)}`);
	} catch (err) {
		const message = typeof err === 'object' && err && 'message' in err ? err.message : String(err);
		log(`symlink - errored on ${pkg.name}: ${message}`);
	}
}

export async function linkWorkspaces() {
	const root = path.dirname((await findUp('package.json')) || '.');

	const packages = await getPackages(root);
	for (const pkg of packages) {
		if (typeof pkg !== 'string' || !pkg) continue;
		await linkPackage(pkg);
	}
}
