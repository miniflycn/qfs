import path = require('path');
import fs = require('fs');
import QFS = require('../src/qfs');

let qfs = QFS.create({
    max: 1,
    files: 'test/feature/**'
});

const myContents = 'var a = 123;',
    newContents = 'var c = 456;';

describe("QFS", () => {
    before(function (done) {
        setTimeout(done, 100);
    });

    it('should get a file', () => {
        let filename = path.join(__dirname, 'feature/my.js'),
            file = qfs.read(filename);

        file.contents.toString().should.equal(myContents);
        qfs.get(filename).should.equal(file);
    });

    it('should just cache one file', () => {
        let fileMe = path.join(__dirname, 'feature/my.js'),
            fileYou = path.join(__dirname, 'feature/you.js'),
            file = qfs.read(fileYou);

        (qfs.get(fileMe) === null).should.be.true;
    });

    it('should watch file changed', (done) => {
        let filename = path.join(__dirname, 'feature/my.js');

        qfs.read(filename);
        (qfs.get(filename) === null).should.be.false;

        fs.writeFileSync(filename, newContents, 'utf-8');
        fs.writeFileSync(filename, myContents, 'utf-8');

        (qfs.get(filename) === null).should.be.true;
        done();
    });
});
