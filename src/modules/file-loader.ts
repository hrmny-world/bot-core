/* eslint-disable no-await-in-loop */
/* eslint-disable no-console */
import fs from 'fs';
import util from 'util';
import { join } from 'path';
import appRoot from 'app-root-path';
import minimatch from 'minimatch';

const readDir = util.promisify(fs.readdir);
const exists = util.promisify(fs.exists);
const mkdir = util.promisify(fs.mkdir);
const stat = util.promisify(fs.stat);

export interface FileLoaderReadDirOptions {
  /**
   * The directory to look for files, absolute path.
   */
  dir: string;
  /**
   * Should look for .ts files?
   */
  useTypescript?: boolean;
  /**
   * Files matching this pattern will be ignored.
   */
  ignorePattern?: string;
  /**
   * If the folder cannot be found, should it be created?
   */
  makeDir?: boolean;
  /**
   * Whether to console.log stuff.
   */
  debug?: boolean;
  /**
   * Path to the root directory FileLoader will look for commands, tasks, etc...
   * If not set, FileLoader will use the directory where the app was started.
   */
  root?: string;
}

export interface FileLoaderLoadDirOptions<T> extends FileLoaderReadDirOptions {
  /**
   * The class that should be imported from the loaded files.
   */
  ImportClass: T;
}

/**
 * Gets the path to all .js (or .ts) files in a given directory recursively.
 */
export const readDirectory = async function ({
  dir,
  useTypescript = false,
  makeDir = true,
  debug = false,
  ignorePattern = '_*',
  root = appRoot.toString(),
}: FileLoaderReadDirOptions): Promise<string[]> {
  const absolutePath = join(root, dir);
  const extensionRegex = useTypescript ? /\.(js|ts)$/ : /\.js$/;
  const ignoreExp = new minimatch.Minimatch(ignorePattern).makeRe();

  // dir doesn't exist, return empty array
  try {
    if (makeDir && !(await exists(absolutePath))) {
      await mkdir(absolutePath);
      return [];
    }
  } catch (err) {
    if (debug) {
      console.log('Failed to create dir', { absolutePath, root, dir }, err);
    }
    return [];
  }

  const dirContents = await readDir(absolutePath);
  const removeTsExtensionFn = (filePath: string) => filePath.replace('.ts', '');

  const results: string[] = [];

  for (const file of dirContents) {
    const name = join(absolutePath, file);
    const isDirectory = (await stat(name)).isDirectory();
    const shouldIgnoreThisFile = ignoreExp.test(file);
    if (isDirectory) {
      results.push(
        ...(await readDirectory({ dir: file, useTypescript, ignorePattern, root: absolutePath })),
      );
    } else if (!shouldIgnoreThisFile && extensionRegex.test(file)) {
      results.push(name);
    }
  }

  return results.map(removeTsExtensionFn);
};

export const loadDirectory = async function <T>({
  dir,
  ImportClass,
  makeDir = true,
  useTypescript = false,
  debug = false,
  root = appRoot.toString(),
}: FileLoaderLoadDirOptions<T>): Promise<T[]> {
  const result: T[] = [];
  const failedToLoad: [string, Error][] = [];
  const dirPath = join(root, dir);

  // dir doesn't exist, return empty array
  try {
    if (makeDir && !(await exists(dirPath))) {
      await mkdir(dirPath);
      return [];
    }
  } catch (err) {
    if (debug) {
      console.log('Failed to create dir', { dirPath, root, dir }, err);
    }
    return [];
  }

  let filePaths: string[];
  try {
    filePaths = await readDirectory({ dir, useTypescript, root, debug });
  } catch (err) {
    console.log('Failed to read directory', { dir, root }, err);
    return [];
  }

  const requires = filePaths.map((filePath) => {
    try {
      return module.require(filePath.replace(__dirname, './'));
    } catch (err) {
      // if failed to require file, add its path to array and return null to be filtered later.
      failedToLoad.push([filePath, err as Error]);
      return null;
    }
  });

  const addToResultIfInstance = (Imported: any) => {
    // check if Imported is an instance of ImportClass
    const isInstance = Imported instanceof (ImportClass as any);
    if (isInstance) {
      result.push(Imported as T);
    }
    const isDefaultExport = Imported.default instanceof (ImportClass as any);
    if (isDefaultExport) {
      result.push(Imported.default as T);
    }
  };

  requires
    .filter((Imported: any) => Imported !== null)
    .forEach((Imported: any) => {
      // this allows multiple exports in one file.
      if (Array.isArray(Imported)) {
        Imported.forEach(addToResultIfInstance);
      } else {
        addToResultIfInstance(Imported as T);
      }
    });

  if (failedToLoad.length > 0 && debug) {
    failedToLoad.forEach((failure) =>
      console.log('Failed to load file: ' + failure[0], failure[1]),
    );
  }
  return result;
};
