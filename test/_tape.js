'use strict';

var Test = require('tape/lib/test');
var is = require('object-is');

var deepEqual = require('../');
var assert = require('../assert');

var equal = process.env.ASSERT ? function assertDeepEqual(a, b) {
	try {
		assert.deepStrictEqual(a, b);
	} catch (e) {
		return false;
	}
	return true;
} : deepEqual;

Test.prototype.deepEqualTest = function deepEqualTest(a, b, message, isStrictEqual, skipReversed) {
	var actual = equal(a, b);
	var suffix = isStrictEqual ? ' are equal' : ' are not equal';
	this.equal(actual, !!isStrictEqual, message + suffix);
	if (typeof skipReversed === 'boolean' ? !skipReversed : !is(a, b)) {
		var actualReverse = equal(b, a);
		this.equal(actualReverse, !!isStrictEqual, message + suffix + ' (reversed)');
	}
};

