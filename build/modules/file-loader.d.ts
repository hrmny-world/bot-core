export interface FileLoaderReadDirOptions {
    dir: string;
    useTypescript?: boolean;
    ignorePattern?: string;
    debug?: boolean;
    root?: string;
}
export interface FileLoaderLoadDirOptions<T> extends FileLoaderReadDirOptions {
    ImportClass: T;
    makeDir?: boolean;
}
export declare const readDirectory: ({ dir, useTypescript, ignorePattern, root, }: FileLoaderReadDirOptions) => Promise<string[]>;
export declare const loadDirectory: <T>({ dir, ImportClass, makeDir, useTypescript, debug, root, }: FileLoaderLoadDirOptions<T>) => Promise<T[]>;
