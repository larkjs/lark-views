
/**
 * Module dependencies.
 */

var debug = require('debug')('lark-views');
var resolve = require('path').resolve;
var assign = require('object-assign');
var fmt = require('util').format;
var join = require('path').join;
var cons = require('co-views');
var send = require('koa-send');
var base = require('app-root-path').toString();

/**
 * Add `render` method
 *
 * @param {String} path (optional)
 * @param {Object} opts (optional)
 * @api public
 */

module.exports = function (opts) {

  opts = opts||{};
  // default dircetory is `views`
  opts.directory = opts.directory || 'views';
  opts.path = resolve(base, opts.directory);

  debug(fmt('path: %s'), opts.path);
  // default extension to `html`
  opts.default = opts.default || 'html';


 debug(fmt(opts));

  return function *views (next) {
    if (this.render) return;

    /**
     * App-specific `locals`, but honor upstream
     * middlewares that may have already set this.locals.
     */

    this.locals = this.locals || {};

    /**
     * Render `view` with `locals`.
     *
     * @param {String} view
     * @param {Object} locals
     * @return {GeneratorFunction}
     * @api public
     */

    this.render = function *(view, locals) {
      var ext = opts.default;
      if(view[view.length - 1] === '/'){
        view += 'index';
      }
      var file = fmt('%s.%s', view, ext);

      locals = locals || {};
      locals = assign(locals, this.locals);

      debug(fmt('render `%s` with %j', file, locals));

      if (ext == 'html' && !opts.map) {
        yield send(this, join(opts.path, file));
      } else {
        var render = cons(opts.path, opts);
        this.body = yield render(view, locals);
      }

      this.type = 'text/html';
    };

    yield next;
  }
};