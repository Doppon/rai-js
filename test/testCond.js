let testCase = require('nodeunit').testCase;
const Signal = require('../src/Signal');
const Condition = require('../src/Condition');


module.exports = testCase({
    'Create': function (test) {
        let s1 = new Signal(10, "a");
        let cond = new Condition("a > 10", [s1]);

        test.notEqual(cond === undefined);
        test.ok(true, "condition was created");

        test.done();
    },
    'Evaluate': function (test) {
        let s1 = new Signal(10, "a");
        let cond = new Condition("a > 10", [s1]);

        test.equal(cond.evaluate(), false);

        test.done();
    },
    'ChangeValue': function (test) {
        let s1 = new Signal(10, "a");
        let cond = new Condition("a > 10", [s1]);

        test.equal(cond.evaluate(), false);
        s1._val = 11;
        test.equal(cond.evaluate(), true);

        test.done();
    },
    'undefined variables': function (test) {
        let cond = new Condition("a > 10", [new Signal(10, 'b')]);

        test.equal(cond.evaluate(), false);

        test.done();
    },
    'multiple condition': function (test) {
        let s1 = new Signal(0, "a");
        let cond1 = new Condition("a > 10", [s1]);
        let cond2 = new Condition("a > 100", [s1]);

        s1._val = 19;
        test.equal(cond1.evaluate(), true);
        test.equal(cond2.evaluate(), false);

        test.done();
    },
    'condition multiples adding': function (test) {
        let cond = new Condition("a > 10 && b > 4 && c < 5 && d < 10", []);

        cond.addSignal(new Signal(100, "a"));
        cond.addSignal(new Signal(10, "b"));
        cond.addSignal(new Signal(2, "c"));
        cond.addSignal(new Signal(0, "d"));

        test.done();
    },
    'condition multiples adding-2': function (test) {
        let cond = new Condition("a > 10 && b > 4 && c < 5 && d < 10");

        cond.addSignal(new Signal(100, "a"));
        cond.addSignal(new Signal(10, "b"));
        cond.addSignal(new Signal(2, "c"));
        cond.addSignal(new Signal(0, "d"));

        test.done();
    },
    'condition multiples adding-3': function (test) {
        let cond = new Condition("a > 10 && b > 4 && c < 5 && d < 10");

        cond.addSignal(new Signal(100, "a"));
        cond.addSignal(new Signal(10, "b"));
        cond.addSignal(new Signal(2, "c"));
        cond.addSignal(new Signal(0, "d"));
        test.equal(cond.evaluate(), true);

        test.done();
    },
    'condition different signal': function (test) {
        let s1 = new Signal(0, "a");
        let s2 = new Signal(11, "a");
        let s3 = new Signal(5, "a");

        let activation;
        let cond = new Condition("a > 10");
        cond.on(function (r) {
            test.equal(r, activation);
        });

        activation = false;
        cond.addSignal(s1);

        activation = true;
        cond.addSignal(s2);

        activation = false;
        cond.addSignal(s3);

        test.done();
    },
    'condition unknown signal': function (test) {
        let s = new Signal(0, "b");

        let count = 0;
        let cond = new Condition("a > 10", [s]);
        cond.on(function (r) {
            test.equal(r, false);
            ++count;
        });

        s.value = 5;
        s.value = 10;
        s.value = 45;
        test.equal(count, 3);

        test.done();
    },
    'counting condition signal': function (test) {
        let s = new Signal(0, "a");

        let count = 0;
        let cond = new Condition("a > 10", [s]);
        cond.on(function (r) {
            test.equal(r, false);
            ++count;
        });

        s.value = 5;
        s.value = 1;
        s.value = 4;
        test.equal(count, 3);

        test.done();
    },
    'counting condition signal-2': function (test) {
        let s = new Signal(0, "a");
        let count = 0;
        let cond = new Condition("a > 10");
        cond.on(function (r) {
            test.equal(r, false);
            ++count;
        });

        cond.addSignal(s);
        s.value = 5;
        s.value = 1;
        s.value = 4;
        test.equal(count, 4);

        test.done();
    }
});