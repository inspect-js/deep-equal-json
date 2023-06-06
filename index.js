'use strict';

var is = require('object-is');
var isArray = require('isarray');
var objectKeys = require('object-keys');

var callBound = require('call-bind/callBound');

var $sort = callBound('Array.prototype.sort');

module.exports = function deepEqualJSON(actual, expected) {
	if (is(actual, expected)) {
		return true;
	}

	if (!actual || !expected || (typeof actual !== 'object' && typeof expected !== 'object')) {
		return is(actual, expected);
	}

	var i, key;

	if (typeof actual !== typeof expected) { return false; }
	if (actual == null || expected == null) { return false; }

	var aIsArray = isArray(actual);
	var bIsArray = isArray(expected);
	if (aIsArray !== bIsArray) { return false; }

	if (typeof actual !== typeof expected) { return false; }

	var ka = objectKeys(actual);
	var ke = objectKeys(expected);
	// having the same number of owned properties (keys incorporates hasOwnProperty)
	if (ka.length !== ke.length) { return false; }

	// the same set of keys (although not necessarily the same order),
	$sort(ka);
	$sort(ke);
	// ~~~cheap key test
	for (i = ka.length - 1; i >= 0; i--) {
		if (ka[i] != ke[i]) { return false; } // eslint-disable-line eqeqeq
	}

	// equivalent values for every corresponding key, and ~~~possibly expensive deep test
	for (i = ka.length - 1; i >= 0; i--) {
		key = ka[i];
		if (!deepEqualJSON(actual[key], expected[key])) { return false; }
	}

	return true;
};
