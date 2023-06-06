# deep-equal-json <sup>[![Version Badge][npm-version-svg]][package-url]</sup>

[![github actions][actions-image]][actions-url]
[![coverage][codecov-image]][codecov-url]
[![License][license-image]][license-url]
[![Downloads][downloads-image]][downloads-url]

[![npm badge][npm-badge-png]][package-url]

[`deep-equal`](https://npmjs.com/deep-equal), but only for JSON-supported values.

Note that any results you get from values that do not round-trip through `JSON.stringify` and `JSON.parse` are explicitly not part of this API, and you must not rely on them.

## Example

```js
const assert = require('assert');
const deepEqual = require('deep-equal-json');

assert.equal(typeof deepEqual(a, b), 'boolean'); // `a` and `b` can be anything that roundtrips with JSON
```

## Tests
Simply clone the repo, `npm install`, and run `npm test`

[package-url]: https://npmjs.org/package/deep-equal-json
[npm-version-svg]: https://versionbadg.es/inspect-js/deep-equal-json.svg
[deps-svg]: https://david-dm.org/inspect-js/deep-equal-json.svg
[deps-url]: https://david-dm.org/inspect-js/deep-equal-json
[dev-deps-svg]: https://david-dm.org/inspect-js/deep-equal-json/dev-status.svg
[dev-deps-url]: https://david-dm.org/inspect-js/deep-equal-json#info=devDependencies
[npm-badge-png]: https://nodei.co/npm/deep-equal-json.png?downloads=true&stars=true
[license-image]: https://img.shields.io/npm/l/deep-equal-json.svg
[license-url]: LICENSE
[downloads-image]: https://img.shields.io/npm/dm/deep-equal-json.svg
[downloads-url]: https://npm-stat.com/charts.html?package=deep-equal-json
[codecov-image]: https://codecov.io/gh/inspect-js/deep-equal-json/branch/main/graphs/badge.svg
[codecov-url]: https://app.codecov.io/gh/inspect-js/deep-equal-json/
[actions-image]: https://img.shields.io/endpoint?url=https://github-actions-badge-u3jn4tfpocch.runkit.sh/inspect-js/deep-equal-json
[actions-url]: https://github.com/inspect-js/deep-equal-json/actions
