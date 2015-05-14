# babel-jscs [![Build Status][travis-image]][travis-url]

**babel-jscs** allows you to lint **ALL** valid Babel code with [JSCS](https://github.com/jscs-dev/node-jscs). Big thanks to @sebmck!

> Also check out the fantastic [babel-eslint](https://github.com/babel/babel-eslint) to lint using [ESLint](https://github.com/eslint/eslint). 

**NOTE:** Please note that this is experimental and may have numerous bugs. It has been run against `ember.js` and `babel-core` with no errors (at the moment). If there's an issue, first check if you can reproduce with the regular parser (esprima) and the latest version.

## How does it work?

JSCS allows custom parsers. This is great but some of the syntax nodes that Babel supports
aren't supported by JSCS. When using this plugin, JSCS is monkeypatched and your code is
transformed into code that JSCS can understand. All location info such as line numbers,
columns is also retained so you can track down errors with ease.

## Usage

### Install

```sh
$ npm install -g jscs babel-jscs // global
$ npm install jscs babel-jscs // local
```

### Setup

**Example .jscsrc**

```js
{
  "esprima": "babel-jscs", // global
  "esprima": "./node_modules/babel-jscs", // local
  "esnext": "true", // es6
  "verbose": "true", // prints out rule names
  "preset": "airbnb"
}
```

Check out the [JSCS docs](http://jscs.info/rules.html) for all possible rules.

### Run

```sh
$ jscs your-files-here
```

### Issues
Include: `jscs` and `babel-jscs` version, code snippet/screenshot

- See if the issue is a duplicate.
- Check if the issue is reproducible with regular jscs.
- Run jscs in `--verbose` mode to get the rule name(s) that have issues.


[travis-url]: https://travis-ci.org/jscs-dev/babel-jscs
[travis-image]: https://travis-ci.org/jscs-dev/babel-jscs.svg?branch=master
