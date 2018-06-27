inline-js-default-resources
===========================

[![Build Status](https://travis-ci.org/eight04/inline-js-default-resources.svg?branch=master)](https://travis-ci.org/eight04/inline-js-default-resources)
[![codecov](https://codecov.io/gh/eight04/inline-js-default-resources/branch/master/graph/badge.svg)](https://codecov.io/gh/eight04/inline-js-default-resources)
[![install size](https://packagephobia.now.sh/badge?p=inline-js-default-resources)](https://packagephobia.now.sh/result?p=inline-js-default-resources)

This repository contains the buildtin resources for [inline-js](https://github.com/eight04/inline-js)

Installation
------------
```js
npm install inline-js-default-resources
```

Usage
-----
```js
const {createInliner} = require("inline-js-core");
const {RESOURCES} = require("inline-js-default-resources");

const inliner = createInliner();
RESOURCES.forEach(inliner.resource.add);
```

RESOURCES
---------

This repository contains following resources:

* `file`: It reads the content from a file path, which may be relative to the file which requires the resource.

  The result could be a utf8 string or a `Buffer`, depending on the extension of the file (see [is-binary-path](https://www.npmjs.com/package/is-binary-path)).
  
* `text`: Like `file`, but the result is always a utf8 string.
* `raw`: Like `file`, but the result is always a `Buffer`.
* `cmd`: Execute a command and read the stdout as a utf8 string. You may pass the second argument which represent the encoding (default: `utf8`). Passing `buffer` to get raw `Buffer` object.

  ```js
  Current date: $inline("cmd:date /t")
  ```
  
PATH_LIKE
---------

A set of resource type. These resources use a filepath as their first argument, including `file`, `text`, and `raw`.

Changelog
---------

* 0.1.0 (Jan 21, 2017)

    - First release.
