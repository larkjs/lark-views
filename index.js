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
var path = require('path');
var base = path.dirname(process.mainModule.filename);


/**
 * Add `render` method
 *
 * @param {String} path (optional)
 * @param {Object} opts (optional)
 * @api public
 */

module.exports = function (opts) {

    opts = opts || {};
    // default dircetory is `views`
    opts.directory = opts.directory || 'views';
    opts.path = resolve(base, opts.directory);

    debug(fmt('path: %s'), opts.path);
    // default extension to `html`
    opts.default = opts.default || 'html';

    debug(fmt(opts));

    return function *views(next) {
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
            var extname = path.extname(view);
            var file = view;
            if (file[file.length - 1] === '/') {
                file += 'index';
            }
            if(!extname){
                file = fmt('%s.%s', file, ext);
            }else{
                ext = extname;
            }
            locals = locals || {};
            locals = assign(locals, this.locals);

            debug(fmt('render `%s` with %j', file, locals));

            if (ext == 'html' && (!opts.map || (opts.map && !opts.map.html))) {
                yield send(this, join(opts.path, file));
            } else {
                var render = cons(opts.path, opts);
                this.body = yield render(view, locals);
            }
            if (undefined === this.body) {
                throw new Error('Can not render ' + file);
            }
            this.type = 'text/html';
        };

        yield next;
    }
};
