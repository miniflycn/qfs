import * as fs from 'fs';
import File = require('vinyl');
import * as gaze from 'gaze';
import * as LRU from 'lru-cache';

function gazePromise(files: string[]): Promise<gaze.Gaze> {
    return new Promise(function (resolve, reject) {
        gaze(files, function (err, watcher) {
            if (err) {
                reject(err);
            } else {
                resolve(watcher);
            }
        });
    });
}

namespace qfs {
    export class FileCache {
    
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
    
    export class QFS extends FileCache {
        /**
        *  begin watch file change
        */
        private async watch(param) {
            if (param.max === 0) return;
            console.log('watch.....');
            var watcher = await gazePromise(param.files);
            watcher.on('all', (e, filename) => {
                let cache = this.cache;
                switch(e) {
                    case 'changed':
                        cache.has(filename) && cache.del(filename);
                        break;
                    case 'added':
                        watcher.add(filename);
                        break;
                    case 'deleted':
                        watcher.remove(filename);
                        break;
                }
            });
        }
    
        constructor(param: {
            /**
            * the max number files can be cache.
            * 0 means no cache
            */
            max?: number,
            /**ı
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
    
    export function create(para) {
        return new QFS(para);
    }
}

export = qfs;
