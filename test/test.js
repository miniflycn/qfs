/// <reference path="../typings/mocha/mocha.d.ts" />
/// <reference path="../typings/should/should.d.ts" />
/// <reference path="../typings/tsd.d.ts" />
var path = require('path');
var fs = require('fs');
var QFS = require('../src/qfs');
var qfs = QFS({
    max: 1,
    files: 'test/feature/**'
});
var myContents = 'var a = 123;', newContents = 'var c = 456;';
describe("QFS", function () {
    before(function (done) {
        setTimeout(done, 100);
    });
    it('should get a file', function () {
        var filename = path.join(__dirname, 'feature/my.js'), file = qfs.read(filename);
        file.contents.toString().should.equal(myContents);
        qfs.get(filename).should.equal(file);
    });
    it('should just cache one file', function () {
        var fileMe = path.join(__dirname, 'feature/my.js'), fileYou = path.join(__dirname, 'feature/you.js'), file = qfs.read(fileYou);
        (qfs.get(fileMe) === null).should.be.true;
    });
    it('should watch file changed', function (done) {
        var filename = path.join(__dirname, 'feature/my.js');
        qfs.read(filename);
        (qfs.get(filename) === null).should.be.false;
        fs.writeFileSync(filename, newContents, 'utf-8');
        fs.writeFileSync(filename, myContents, 'utf-8');
        (qfs.get(filename) === null).should.be.true;
        done();
    });
});
