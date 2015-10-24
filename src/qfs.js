/// <reference path="../typings/tsd.d.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var fs = require('fs');
var File = require('vinyl');
var gaze = require('gaze');
var LRU = require('lru-cache');
var FileCache = (function () {
    function FileCache(param) {
        var max = param.max || 0;
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
    FileCache.prototype.get = function (path) {
        return this.cache.get(path);
    };
    /**
     * set file to cache
     */
    FileCache.prototype.set = function (file) {
        this.cache.set(file.path, file);
    };
    return FileCache;
})();
var QFS = (function (_super) {
    __extends(QFS, _super);
    function QFS(param) {
        if (param.max === void 0)
            param.max = 1000;
        if (param.files === void 0)
            param.files = '**';
        _super.call(this, param);
        this.watch(param);
    }
    /**
     *  begin watch file change
     */
    QFS.prototype.watch = function (param) {
        var _this = this;
        if (param.max === 0)
            return;
        console.log('watch.....');
        gaze(param.files, function (err, watcher) {
            watcher.on('all', function (e, filename) {
                var cache = _this.cache;
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
    };
    /**
     *  read a file
     */
    QFS.prototype.read = function (path) {
        var f = this.get(path);
        if (!f) {
            f = new File({
                path: path,
                contents: fs.readFileSync(path)
            });
            this.set(f);
        }
        return f;
    };
    return QFS;
})(FileCache);
/**
 * create QFS instance
 */
function create(param) {
    return new QFS(param);
}
;
module.exports = create;
