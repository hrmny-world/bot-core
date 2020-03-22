"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const util_1 = __importDefault(require("util"));
const path_1 = require("path");
const app_root_path_1 = __importDefault(require("app-root-path"));
const minimatch_1 = __importDefault(require("minimatch"));
const readDir = util_1.default.promisify(fs_1.default.readdir);
const exists = util_1.default.promisify(fs_1.default.exists);
const mkdir = util_1.default.promisify(fs_1.default.mkdir);
const stat = util_1.default.promisify(fs_1.default.stat);
exports.readDirectory = function ({ dir, useTypescript = false, ignorePattern = '_*', root = app_root_path_1.default.toString(), }) {
    return __awaiter(this, void 0, void 0, function* () {
        const absolutePath = path_1.join(root, dir);
        const extensionRegex = useTypescript ? /\.(js|ts)$/ : /\.js$/;
        const ignoreExp = new minimatch_1.default.Minimatch(ignorePattern).makeRe();
        const dirContents = yield readDir(absolutePath);
        const removeTsExtensionFn = (filePath) => filePath.replace('.ts', '');
        const results = [];
        for (const file of dirContents) {
            const name = path_1.join(absolutePath, file);
            const isDirectory = (yield stat(name)).isDirectory();
            const shouldIgnoreThisFile = ignoreExp.test(file);
            if (isDirectory) {
                results.push(...(yield exports.readDirectory({ dir: file, useTypescript, ignorePattern, root: absolutePath })));
            }
            else if (!shouldIgnoreThisFile && extensionRegex.test(file)) {
                results.push(name);
            }
        }
        return results.map(removeTsExtensionFn);
    });
};
exports.loadDirectory = function ({ dir, ImportClass, makeDir = true, useTypescript = false, debug = false, root = app_root_path_1.default.toString(), }) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = [];
        const failedToLoad = [];
        const dirPath = path_1.join(root, dir);
        try {
            if (makeDir && !(yield exists(dirPath))) {
                yield mkdir(dirPath);
                return [];
            }
        }
        catch (err) {
            if (debug) {
                console.log('Failed to create dir', { dirPath, root, dir }, err);
            }
            return [];
        }
        let filePaths;
        try {
            filePaths = yield exports.readDirectory({ dir, useTypescript, root, debug });
        }
        catch (err) {
            console.log('Failed to read directory', { dir, root }, err);
            return [];
        }
        const requires = filePaths.map(filePath => {
            try {
                return module.require(filePath.replace(__dirname, './'));
            }
            catch (err) {
                failedToLoad.push([filePath, err]);
                return null;
            }
        });
        const addToResultIfInstance = (Imported) => {
            const isInstance = Imported instanceof ImportClass;
            if (isInstance) {
                result.push(Imported);
            }
            const isDefaultExport = Imported.default instanceof ImportClass;
            if (isDefaultExport) {
                result.push(Imported.default);
            }
        };
        requires
            .filter((Imported) => Imported !== null)
            .forEach((Imported) => {
            if (Array.isArray(Imported)) {
                Imported.forEach(addToResultIfInstance);
            }
            else {
                addToResultIfInstance(Imported);
            }
        });
        if (failedToLoad.length > 0 && debug) {
            failedToLoad.forEach(failure => console.log('Failed to load file: ' + failure[0], failure[1]));
        }
        return result;
    });
};
