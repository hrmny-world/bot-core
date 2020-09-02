export interface FileLoaderReadDirOptions {
    dir: string;
    useTypescript?: boolean;
    ignorePattern?: string;
    makeDir?: boolean;
    debug?: boolean;
    root?: string;
}
export interface FileLoaderLoadDirOptions<T> extends FileLoaderReadDirOptions {
    ImportClass: T;
}
export declare const readDirectory: ({ dir, useTypescript, makeDir, debug, ignorePattern, root, }: FileLoaderReadDirOptions) => Promise<string[]>;
export declare const loadDirectory: <T>({ dir, ImportClass, makeDir, useTypescript, debug, root, }: FileLoaderLoadDirOptions<T>) => Promise<T[]>;
