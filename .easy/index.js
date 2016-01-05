/**
 * Lark-Views
 **/
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _debug2 = require('debug');

var _debug3 = _interopRequireDefault(_debug2);

var _lruCache = require('lru-cache');

var _lruCache2 = _interopRequireDefault(_lruCache);

var _extend = require('extend');

var _extend2 = _interopRequireDefault(_extend);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const debug = (0, _debug3.default)('lark-views');

const defaultPath = 'views';
const defaultEngine = 'ejs';

class Views {
    constructor() {
        let options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

        debug("Views: Views.constructor");
        if ('string' !== typeof options.path) {
            options.path = defaultPath;
        }
        if (!_path2.default.isAbsolute(options.path)) {
            options.path = _path2.default.join(_path2.default.dirname(process.mainModule.filename), options.path);
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

    read(viewPath, options) {
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
        let extname = _path2.default.extname(viewPath);
        if (!extname) {
            extname += '.' + defaultEngine;
            viewPath += extname;
        }
        extname = extname.slice(1);
        debug("Views: extname is " + extname);

        return new Promise((resolve, reject) => {
            let result = this.cache.get(viewPath);
            if (result) {
                debug("Views: use cache file " + viewPath);
                return resolve({
                    tpl: result,
                    extname: extname
                });
            }
            debug("Views: Reading file " + viewPath);
            _fs2.default.readFile(viewPath, (error, tpl) => {
                if (error) {
                    return reject(error);
                }
                tpl = tpl.toString();
                if ('string' !== typeof process.env.NODE_ENV || !process.env.NODE_ENV.match(/^development$/i)) {
                    debug("Views: set cache file " + viewPath);
                    this.cache.set(viewPath, tpl);
                }
                return resolve({
                    tpl: tpl,
                    extname: extname
                });
            });
        });
    }

    render(viewPath, locals) {
        debug("Views: Views.render");
        return this.read(viewPath, locals).then(result => {
            let tpl = result.tpl;
            let extname = result.extname;

            let enginename = extname;
            if (extname && this.options.map && this.options.map[extname]) {
                enginename = this.options.map[extname];
            }
            let engine;
            if (this.engines.hasOwnProperty(enginename)) {
                engine = this.engines[enginename];
            } else {
                try {
                    debug("Views: loading engine " + enginename);
                    engine = require(enginename);
                } catch (e) {
                    debug("Views: load engine " + enginename + " failed : " + e.message);
                    engine = null;
                }
                this.engines[enginename] = engine;
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
    saveInstance() {
        let name = arguments.length <= 0 || arguments[0] === undefined ? 'default' : arguments[0];

        debug("Logger: saving instance");
        if (savedInstances[name]) {
            throw new Error('Fail to save view instance as "' + name + '" : name duplicated with existing instance');
        }
        savedInstances[name] = this;
        return this;
    }
    static instance() {
        let name = arguments.length <= 0 || arguments[0] === undefined ? 'default' : arguments[0];

        return savedInstances[name] || null;
    }
}

const savedInstances = {};

exports.default = Views;
