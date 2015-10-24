/// <reference path="../typings/tsd.d.ts" />

import fs = require('fs');
import File = require('vinyl');
import gaze = require('gaze');
import LRU = require('lru-cache');

class FileCache {

    public cache

    constructor(param) {
        let max = param.max || 0;
        if (max > 0) {
            this.cache = LRU(max);
        } else {
            this.get = function () { return null; };
            this.set = function () {};
        }
    }
    /**
     * get file from cache
     */
    get(path: string): File {
        return this.cache.get(path);
    }
    /**
     * set file to cache
     */
    set(file: File) {
        this.cache.set(file.path, file);
    }
}

class QFS extends FileCache {
    /**
     *  begin watch file change
     */
    private watch(param) {
        if (param.max === 0) return;
        console.log('watch.....');
        gaze(param.files, (err, watcher) => {
            watcher.on('all', (e, filename) => {
                let cache = this.cache;
                if (e === 'changed') {
                    cache.has(filename) && cache.del(filename);
                } else if (e === 'added') {
                    watcher.add(filename);
                } else if (e === 'deleted') {
                    watcher.remove(filename);
                }
                console.log(e, filename);
            });
        });
    }

    constructor(param: {
        /**
        * the max number files can be cache.
        * 0 means no cache
        */
        max?: number,
        /**
         * files need to be watched
         */
        files?: string | string[]
    }) {
        if (param.max === void 0) param.max = 1000;
        if (param.files === void 0) param.files = '**';
        super(param);
        this.watch(param);
    }
    /**
     *  read a file
     */
    read(path: string): File {
        let f = this.get(path);
        if (!f) {
            f = new File({
                path: path,
                contents: fs.readFileSync(path)
            });
            this.set(f);
        }
        return f;
    }
}

/**
 * create QFS instance
 */
function create(param) {
    return new QFS(param);
};

export = create;
