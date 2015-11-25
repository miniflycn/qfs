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
var path = require('path');
var fs = require('fs');
var QFS = require('../src/qfs');
let qfs = QFS.create({
    max: 1,
    files: 'test/feature/**'
});
const myContents = 'var a = 123;', newContents = 'var c = 456;';
describe("QFS", () => {
    before(function (done) {
        setTimeout(done, 100);
    });
    it('should get a file', () => {
        let filename = path.join(__dirname, 'feature/my.js'), file = qfs.read(filename);
        file.contents.toString().should.equal(myContents);
        qfs.get(filename).should.equal(file);
    });
    it('should just cache one file', () => {
        let fileMe = path.join(__dirname, 'feature/my.js'), fileYou = path.join(__dirname, 'feature/you.js'), file = qfs.read(fileYou);
        (qfs.get(fileMe) === undefined).should.be.true;
    });
    it('should watch file changed', (done) => {
        let filename = path.join(__dirname, 'feature/my.js');
        qfs.read(filename);
        (qfs.get(filename) === undefined).should.false;
        fs.writeFileSync(filename, newContents, 'utf-8');
        fs.writeFileSync(filename, myContents, 'utf-8');
        setTimeout(function () {
            (qfs.get(filename) === undefined).should.true;
            done();
        }, 100);
    });
});
