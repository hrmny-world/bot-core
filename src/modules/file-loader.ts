/* eslint-disable no-console */
import appRoot from 'app-root-path';
import glob from 'glob';
import { join } from 'path';

export const readAllFiles = ({
  root = appRoot.toString(),
  ignorePattern = '_*',
}: IReaderOptions): Promise<string[]> => {
  return new Promise((resolve, reject) => {
    glob(
      '**',
      {
        cwd: root,
        ignore: [ignorePattern, 'node_modules'].filter(Boolean),
      },
      (err, files) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(files);
      },
    );
  });
};

export const requireSensumObjects = async (root = appRoot.toString(), files: string[], models: IModelDescription[]) => {
  const requiredObjects: Record<string, unknown[]> = {};

  for (const model of models) {
    requiredObjects[model.name] = [];
  }

  for (const file of files) {
    const matchingModel = models.find((m) => m.regex.test(file));
    if (!matchingModel) continue;

    try {
      const required = module.require(join(root, file));

      let sensumObject;
      if (required instanceof matchingModel.importClass) {
        sensumObject = required;
      }
      if (required?.default instanceof matchingModel.importClass) {
        sensumObject = required.default;
      }

      if (!sensumObject) continue;

      const name = matchingModel.name;
      requiredObjects[name].push(sensumObject);
    } catch (err) {
      console.log('Failed to load file.', file);
      console.log('err: ', err);
    }
  }

  return requiredObjects;
};

export interface IReaderOptions {
  /**
   * The root of the application to start reading from.
   */
  root?: string;
  /**
   * Files matching this pattern will be ignored.
   */
  ignorePattern?: string;
}

export interface IModelDescription {
  /**
   * Name of the model.
   */
  name: string;
  /**
   * Expression to test against the name of files.
   */
  regex: RegExp;
  /**
   * The class to instantiate.
   */
  importClass: Function;
}
