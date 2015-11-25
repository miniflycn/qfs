"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, Promise, generator) {
    return new Promise(function (resolve, reject) {
        generator = generator.call(thisArg, _arguments);
        function cast(value) { return value instanceof Promise && value.constructor === Promise ? value : new Promise(function (resolve) { resolve(value); }); }
        function onfulfill(value) { try { step("next", value); } catch (e) { reject(e); } }
        function onreject(value) { try { step("throw", value); } catch (e) { reject(e); } }
        function step(verb, value) {
            var result = generator[verb](value);
            result.done ? resolve(result.value) : cast(result.value).then(onfulfill, onreject);
        }
        step("next", void 0);
    });
};
var fs = require('fs');
var File = require('vinyl');
var gaze = require('gaze');
var LRU = require('lru-cache');
function gazePromise(files) {
    return new Promise(function (resolve, reject) {
        gaze(files, function (err, watcher) {
            if (err) {
                reject(err);
            }
            else {
                resolve(watcher);
            }
        });
    });
}
var qfs;
(function (qfs) {
    class FileCache {
        constructor(param) {
            let max = param.max || 0;
            if (max > 0) {
                this.cache = LRU(max);
            }
            else {
                this.get = function () { return null; };
                this.set = function () { };
            }
        }
        /**
        * get file from cache
        */
        get(path) {
            return this.cache.get(path);
        }
        /**
        * set file to cache
        */
        set(file) {
            this.cache.set(file.path, file);
        }
    }
    qfs.FileCache = FileCache;
    class QFS extends FileCache {
        constructor(param) {
            if (param.max === void 0)
                param.max = 1000;
            if (param.files === void 0)
                param.files = '**';
            super(param);
            this.watch(param);
        }
        /**
        *  begin watch file change
        */
        watch(param) {
            return __awaiter(this, void 0, Promise, function* () {
                if (param.max === 0)
                    return;
                console.log('watch.....');
                var watcher = yield gazePromise(param.files);
                watcher.on('all', (e, filename) => {
                    let cache = this.cache;
                    switch (e) {
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
            });
        }
        /**
        *  read a file
        */
        read(path) {
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
    qfs.QFS = QFS;
    function create(para) {
        return new QFS(para);
    }
    qfs.create = create;
})(qfs || (qfs = {}));
module.exports = qfs;
