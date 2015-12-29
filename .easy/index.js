/**
 * Lark-Views
 **/
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _debug2 = require('debug');

var _debug3 = _interopRequireDefault(_debug2);

var _lruCache = require('lru-cache');

var _lruCache2 = _interopRequireDefault(_lruCache);

var _caller = require('caller');

var _caller2 = _interopRequireDefault(_caller);

var _extend = require('extend');

var _extend2 = _interopRequireDefault(_extend);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var debug = (0, _debug3.default)('lark-views');

var defaultPath = 'views';
var defaultEngine = 'ejs';

var Views = (function () {
    function Views() {
        var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

        _classCallCheck(this, Views);

        debug("Views: Views.constructor");
        if ('string' !== typeof options.path) {
            options.path = defaultPath;
        }
        if (!_path2.default.isAbsolute(options.path)) {
            options.path = _path2.default.join(_path2.default.dirname((0, _caller2.default)()), options.path);
        }
        debug("Views: path is " + options.path);
        if ('string' !== typeof options.default) {
            options.default = defaultEngine;
        }
        options.map = options.map || {};

        this.options = (0, _extend2.default)(true, {}, options);

        this.cache = (0, _lruCache2.default)(options.cacheLimit > 0 ? options.cacheLimit : 100);
        this.engines = {};

        debug("Views: constructed");
    }

    _createClass(Views, [{
        key: 'read',
        value: function read(viewPath, options) {
            var _this = this;

            debug("Views: Views.read");
            if (!viewPath || 'string' !== typeof viewPath) {
                throw new Error("Param path of the view is required!");
            }
            if (!_path2.default.isAbsolute(viewPath)) {
                viewPath = _path2.default.join(this.options.path, viewPath);
            }
            if (viewPath.indexOf(this.options.path) !== 0) {
                throw new Error("Access denied, you can only read view files under " + this.options.path);
            }
            var extname = _path2.default.extname(viewPath);
            if (!extname) {
                extname += '.' + defaultEngine;
                viewPath += extname;
            }
            extname = extname.slice(1);
            debug("Views: extname is " + extname);

            return new Promise(function (resolve, reject) {
                var result = _this.cache.get(viewPath);
                if (result) {
                    debug("Views: use cache file " + viewPath);
                    return resolve({
                        tpl: result,
                        extname: extname
                    });
                }
                debug("Views: Reading file " + viewPath);
                _fs2.default.readFile(viewPath, function (error, tpl) {
                    if (error) {
                        return reject(error);
                    }
                    tpl = tpl.toString();
                    if ('string' !== typeof process.env.NODE_ENV || !process.env.NODE_ENV.match(/^development$/i)) {
                        debug("Views: set cache file " + viewPath);
                        _this.cache.set(viewPath, tpl);
                    }
                    return resolve({
                        tpl: tpl,
                        extname: extname
                    });
                });
            });
        }
    }, {
        key: 'render',
        value: function render(viewPath, locals) {
            var _this2 = this;

            debug("Views: Views.render");
            return this.read(viewPath, locals).then(function (result) {
                var tpl = result.tpl;
                var extname = result.extname;

                var enginename = extname;
                if (extname && _this2.options.map && _this2.options.map[extname]) {
                    enginename = _this2.options.map[extname];
                }
                var engine = undefined;
                if (_this2.engines.hasOwnProperty(enginename)) {
                    engine = _this2.engines[enginename];
                } else {
                    try {
                        debug("Views: loading engine " + enginename);
                        engine = require(enginename);
                    } catch (e) {
                        debug("Views: load engine " + enginename + " failed : " + e.message);
                        engine = null;
                    }
                    _this2.engines[enginename] = engine;
                }
                if (!engine) {
                    debug("Views: engine not define, return content directly");
                    return tpl;
                } else {
                    debug("Views: render by engine " + enginename);
                    return engine.render(tpl, locals);
                }
            });
        }
    }]);

    return Views;
})();

exports.default = Views;
