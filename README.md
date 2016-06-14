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

Use _lark-views_ as a Class.

```js
import Views from 'lark-views';
const views = new Views({
  path: 'views',
  map: {
    tpl: 'ejs',
  }
});
views.render('a.tpl', { foo: "bar" })
     .then(data => console.log(data))
     .catch(e => console.error(e.stack));
```

Use _lark-views_ as a koa middleware

```js
import views from 'lark-views/middleware';
import Koa   from 'koa';

const app = new Koa();

// Must be used before any router is used
app.use(views({
  path: 'views',
  map: {
    tpl: 'ejs',
  }
}));

app.use(async (ctx, next) => {
  await ctx.render('user.tpl', {
    user: 'John'
  });
  await next();
});
```

For more examples take a look at the [tests](./test/index.js)

## API

#### `views([opts])`

* `opts`: see below
* `opts.map`: map from extname to template engine.
* `opts.path`: directory path relative from main module file if it is not an absolute path.

#### `middleware([opts)`
* `opts`: the same as in `views[opts]`;

when `middleware(opts)` is called, `Views.instance()` will return the instance created in that middleware

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
