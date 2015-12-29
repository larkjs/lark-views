# lark-views

This repository began as a GitHub fork of [queckezz/koa-views](https://github.com/queckezz/koa-views).


[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![NPM downloads][downloads-image]][npm-url]
[![Node.js dependencies][david-image]][david-url]

Template rendering middleware for koa, supporting [many](https://github.com/tj/consolidate.js#supported-template-engines) template engines.

## Installation

```
$ npm install lark-views
```

## Example

```js
// Must be used before any router is used
app.use(views('views', {
  map: {
    html: underscore
  }
}));

app.use(function* (next) {
  this.locals = {
    session: this.session,
    title: 'app'
  };

  yield this.render('user', {
    user: 'John'
  });
});
```

For more examples take a look at the [tests](./test/index.js)

## API

#### `views([path, opts])`

* `path ()`: directory form [rootPath](https://github.com/inxilpro/node-app-root-path)
* `opts`: these options go straight to [co-views](https://github.com/visionmedia/co-views).

## Debug

Set the `DEBUG` environment variable to `lark-views` when starting your server.

```bash
$ DEBUG=lark-views
```

## License

[MIT](./license)

[npm-image]: https://img.shields.io/npm/v/lark-views.svg?style=flat-square
[npm-url]: https://npmjs.org/package/lark-views
[travis-image]: https://img.shields.io/travis/larkjs/lark-views/master.svg?style=flat-square
[travis-url]: https://travis-ci.org/larkjs/lark-views
[downloads-image]: https://img.shields.io/npm/dm/lark-views.svg?style=flat-square
[david-image]: https://img.shields.io/david/larkjs/lark-views.svg?style=flat-square
[david-url]: https://david-dm.org/larkjs/lark-views