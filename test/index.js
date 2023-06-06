'use strict';

var test = require('tape');
require('./_tape');
var hasSymbols = require('has-symbols')();
var semver = require('semver');
var keys = require('object-keys');
var hasProto = require('has-proto')();

var isNode = typeof process === 'object' && typeof process.version === 'string';

function tag(obj, value) {
	if (hasSymbols && Symbol.toStringTag && Object.defineProperty) {
		Object.defineProperty(obj, Symbol.toStringTag, {
			value: value
		});
	}
	return obj;
}

test('equal', function (t) {
	t.deepEqualTest(
		{ a: [2, 3], b: [4] },
		{ a: [2, 3], b: [4] },
		'two equal objects',
		true,
		false
	);

	var obj1 = { a: [2, 3], b: [4] };
	var obj2 = { b: [4], a: [2, 3] };
	t.notDeepEqual(keys(obj1), keys(obj2), 'keys are in a different order');
	t.deepEqual(keys(obj1), keys(obj2).reverse(), 'keys are in opposite order');
	t.deepEqualTest(
		obj1,
		obj2,
		'two equal objects, in different order',
		true
	);

	t.deepEqualTest(
		{ a: 2, b: '4' },
		{ a: 2, b: 4 },
		'two loosely equal, strictly inequal objects',
		false
	);

	t.deepEqualTest(
		{ a: 2, b: 4 },
		{ a: 2, B: 4 },
		'two inequal objects',
		false
	);

	t.deepEqualTest(
		'-000',
		false,
		'`false` and `"-000"`',
		false
	);

	t.end();
});

test('not equal', function (t) {
	t.deepEqualTest(
		{ x: 5, y: [6] },
		{ x: 5, y: 6 },
		'two inequal objects are',
		false
	);

	t.end();
});

test('nested nulls', function (t) {
	t.deepEqualTest(
		[null, null, null],
		[null, null, null],
		'same-length arrays of nulls',
		true,
		true
	);
	t.end();
});

test('objects with strings vs numbers', function (t) {
	t.deepEqualTest(
		[{ a: 3 }, { b: 4 }],
		[{ a: '3' }, { b: '4' }],
		'objects with equivalent string/number values',
		false
	);
	t.end();
});

test('non-objects', function (t) {
	t.deepEqualTest(3, 3, 'same numbers', true, true);
	t.deepEqualTest('beep', 'beep', 'same strings', true, true);
	t.deepEqualTest('3', 3, 'numeric string and number', false);
	t.deepEqualTest('3', [3], 'numeric string and array containing number', false);
	t.deepEqualTest(3, [3], 'number and array containing number', false);

	t.end();
});

test('infinities', function (t) {
	t.deepEqualTest(Infinity, Infinity, '∞ and ∞', true, true);
	t.deepEqualTest(-Infinity, -Infinity, '-∞ and -∞', true, true);
	t.deepEqualTest(Infinity, -Infinity, '∞ and -∞', false);

	t.end();
});

test('Arrays', function (t) {
	var a = [];
	var b = [];
	b.foo = true;

	t.deepEqualTest(
		a,
		b,
		'two identical arrays, one with an extra property',
		false
	);

	t.end();
});

test('booleans', function (t) {
	t.deepEqualTest(
		true,
		true,
		'trues',
		true,
		false
	);

	t.deepEqualTest(
		false,
		false,
		'falses',
		true,
		false
	);

	t.deepEqualTest(
		true,
		false,
		'true and false',
		false
	);

	t.end();
});

test('booleans and arrays', function (t) {
	t.deepEqualTest(
		true,
		[],
		'true and an empty array',
		false
	);
	t.deepEqualTest(
		false,
		[],
		'false and an empty array',
		false
	);
	t.end();
});

test('arrays initiated', function (t) {
	var a0 = [
		undefined,
		null,
		-1,
		0,
		1,
		false,
		true,
		undefined,
		'',
		'abc',
		null,
		undefined
	];
	var a1 = [
		undefined,
		null,
		-1,
		0,
		1,
		false,
		true,
		undefined,
		'',
		'abc',
		null,
		undefined
	];

	t.deepEqualTest(
		a0,
		a1,
		'arrays with equal contents are equal',
		true,
		true
	);
	t.end();
});

test('arrays assigned', function (t) {
	var a0 = [
		undefined,
		null,
		-1,
		0,
		1,
		false,
		true,
		undefined,
		'',
		'abc',
		null,
		undefined
	];
	var a1 = [];

	a1[0] = undefined;
	a1[1] = null;
	a1[2] = -1;
	a1[3] = 0;
	a1[4] = 1;
	a1[5] = false;
	a1[6] = true;
	a1[7] = undefined;
	a1[8] = '';
	a1[9] = 'abc';
	a1[10] = null;
	a1[11] = undefined;
	a1.length = 12;

	t.deepEqualTest(a0, a1, 'a literal array and an assigned array', true);
	t.end();
});

test('arrays push', function (t) {
	var a0 = [
			undefined,
			null,
			-1,
			0,
			1,
			false,
			true,
			undefined,
			'',
			'abc',
			null,
			undefined
		],
		a1 = [];

	a1.push(undefined);
	a1.push(null);
	a1.push(-1);
	a1.push(0);
	a1.push(1);
	a1.push(false);
	a1.push(true);
	a1.push(undefined);
	a1.push('');
	a1.push('abc');
	a1.push(null);
	a1.push(undefined);
	a1.length = 12;

	t.deepEqualTest(a0, a1, 'a literal array and a pushed array', true);
	t.end();
});

test('null == undefined', function (t) {
	t.deepEqualTest(null, undefined, 'null and undefined', false);
	t.deepEqualTest([null], [undefined], '[null] and [undefined]', false);

	t.end();
});

test('NaNs', function (t) {
	t.deepEqualTest(
		NaN,
		NaN,
		'two NaNs',
		true
	);

	t.deepEqualTest(
		{ a: NaN },
		{ a: NaN },
		'two equiv objects with a NaN value',
		true
	);

	t.deepEqualTest(NaN, 1, 'NaN and 1', false);

	t.end();
});

test('zeroes', function (t) {
	t.deepEqualTest(0, -0, '0 and -0', false);

	t.deepEqualTest({ a: 0 }, { a: -0 }, 'two objects with a same-keyed 0/-0 value', false);

	t.end();
});

test('Object.create', { skip: !Object.create }, function (t) {
	var a = { a: 'A' };
	var b = Object.create(a);
	b.b = 'B';
	var c = Object.create(a);
	c.b = 'C';

	t.deepEqualTest(
		b,
		c,
		'two objects with the same [[Prototype]] but a different own property',
		false
	);

	t.end();
});

test('Object.create(null)', { skip: !Object.create }, function (t) {
	t.deepEqualTest(
		Object.create(null),
		Object.create(null),
		'two empty null objects',
		true,
		true
	);

	t.deepEqualTest(
		Object.create(null, { a: { value: 'b' } }),
		Object.create(null, { a: { value: 'b' } }),
		'two null objects with the same property pair',
		true,
		true
	);

	t.end();
});

test('object literals', function (t) {
	t.deepEqualTest(
		{ prototype: 2 },
		{ prototype: '2' },
		'two loosely equal, strictly inequal prototype properties',
		false
	);

	t.end();
});

test('arrays and objects', function (t) {
	t.deepEqualTest([], {}, 'empty array and empty object', false);
	t.deepEqualTest([], { length: 0 }, 'empty array and empty arraylike object', false);
	t.deepEqualTest([1], { 0: 1 }, 'array and similar object', false);

	t.end();
});

test('functions', function (t) {
	function f() {}

	t.deepEqualTest(f, f, 'a function and itself', true, true);
	t.deepEqualTest([f], [f], 'a function and itself in an array', true, true);

	t.deepEqualTest(function () {}, function () {}, 'two distinct functions', false, true);
	t.deepEqualTest([function () {}], [function () {}], 'two distinct functions in an array', false, true);

	t.deepEqualTest(f, {}, 'function and object', false, true);
	t.deepEqualTest([f], [{}], 'function and object in an array', false, true);

	t.end();
});

test('object and null', function (t) {
	t.deepEqualTest(
		{},
		null,
		'null and an object',
		false
	);

	t.end();
});

test('error = Object', function (t) {
	t.deepEqualTest(
		new Error('a'),
		{ message: 'a' },
		false
	);

	t.end();
});

test('[[Prototypes]]', function (t) {
	function C() {}
	var instance = new C();
	delete instance.constructor;

	t.deepEqualTest({}, instance, 'two identical objects with different [[Prototypes]]', true);

	t.test('Dates with different prototypes', { skip: !hasProto }, function (st) {
		var d1 = new Date(0);
		var d2 = new Date(0);

		st.deepEqualTest(d1, d2, 'two dates with the same timestamp', true);

		var newProto = {
			__proto__: Date.prototype
		};
		d2.__proto__ = newProto; // eslint-disable-line no-proto
		st.ok(d2 instanceof Date, 'd2 is still a Date instance after tweaking [[Prototype]]');

		st.deepEqualTest(d1, d2, 'two dates with the same timestamp and different [[Prototype]]', true);

		st.end();
	});

	t.end();
});

test('toStringTag', { skip: !hasSymbols || !Symbol.toStringTag }, function (t) {
	var o1 = {};
	t.equal(Object.prototype.toString.call(o1), '[object Object]', 'o1: Symbol.toStringTag works');

	var o2 = {};
	t.equal(Object.prototype.toString.call(o2), '[object Object]', 'o2: original Symbol.toStringTag works');

	t.deepEqualTest(o1, o2, 'two normal empty objects', true);

	o2[Symbol.toStringTag] = 'jifasnif';
	t.equal(Object.prototype.toString.call(o2), '[object jifasnif]', 'o2: modified Symbol.toStringTag works');

	t.deepEqualTest(o1, o2, 'two normal empty objects with different toStringTags', true);

	t.end();
});

test('boxed primitives', function (t) {
	t.deepEqualTest(Object(false), false, 'boxed and primitive `false`', false);
	t.deepEqualTest(Object(true), true, 'boxed and primitive `true`', false);
	t.deepEqualTest(Object(3), 3, 'boxed and primitive `3`', false);
	t.deepEqualTest(Object(NaN), NaN, 'boxed and primitive `NaN`', false);
	t.deepEqualTest(Object(''), '', 'boxed and primitive `""`', false);
	t.deepEqualTest(Object('str'), 'str', 'boxed and primitive `"str"`', false);

	t.test('symbol', { skip: !hasSymbols }, function (st) {
		var s = Symbol('');
		st.deepEqualTest(Object(s), s, 'boxed and primitive `Symbol()`', false);
		st.end();
	});

	t.test('bigint', { skip: typeof BigInt !== 'function' }, function (st) {
		var hhgtg = BigInt(42);
		st.deepEqualTest(Object(hhgtg), hhgtg, 'boxed and primitive `BigInt(42)`', false);
		st.end();
	});

	t.test('`valueOf` is called for boxed primitives', function (st) {
		var a = Object(5);
		a.valueOf = function () { throw new Error('failed'); };
		var b = Object(5);
		b.valueOf = function () { throw new Error('failed'); };

		st.deepEqualTest(a, b, 'two boxed numbers with a thrower valueOf', false);

		st.end();
	});

	t.end();
});

test('getters', { skip: !Object.defineProperty }, function (t) {
	var a = {};
	Object.defineProperty(a, 'a', { enumerable: true, get: function () { return 5; } });
	var b = {};
	Object.defineProperty(b, 'a', { enumerable: true, get: function () { return 6; } });

	t.deepEqualTest(a, b, 'two objects with the same getter but producing different values', false);

	t.end();
});

var isBrokenNode = isNode && process.env.ASSERT && semver.satisfies(process.version, '<= 13.3.0');
test('fake arrays: extra keys will be tested', { skip: !hasProto || isBrokenNode }, function (t) {
	var a = tag({
		__proto__: Array.prototype,
		0: 1,
		1: 1,
		2: 'broken',
		length: 2
	}, 'Array');
	if (Object.defineProperty) {
		Object.defineProperty(a, 'length', {
			enumerable: false
		});
	}

	t.deepEqualTest(a, [1, 1], 'fake and real array with same contents and [[Prototype]]', false);

	var b = tag(/abc/, 'Array');
	b.__proto__ = Array.prototype; // eslint-disable-line no-proto
	b.length = 3;
	if (Object.defineProperty) {
		Object.defineProperty(b, 'length', {
			enumerable: false
		});
	}
	t.deepEqualTest(b, ['a', 'b', 'c'], 'regex faking as array, and array', false);

	t.end();
});
