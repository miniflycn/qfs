import File = require('vinyl');
declare namespace qfs {
    class FileCache {
        cache: any;
        constructor(param: any);
        /**
        * get file from cache
        */
        get(path: string): File;
        /**
        * set file to cache
        */
        set(file: File): void;
    }
    class QFS extends FileCache {
        /**
        *  begin watch file change
        */
        private watch(param);
        constructor(param: {
            /**
            * the max number files can be cache.
            * 0 means no cache
            */
            max?: number;
            /**ı
            * files need to be watched
            */
            files?: string | string[];
        });
        /**
        *  read a file
        */
        read(path: string): File;
    }
    function create(para: any): QFS;
}
export = qfs;
