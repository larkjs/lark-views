/**
 * Lark-Views
 **/
'use strict';

import _debug   from 'debug';
import cache    from 'lru-cache';
import caller   from 'caller';
import extend   from 'extend';
import fs       from 'fs';
import path     from 'path';

const debug = _debug('lark-views');

const defaultPath   = 'views';
const defaultEngine = 'ejs';

class Views {
    constructor (options = {}) {
        debug("Views: Views.constructor");
        if ('string' !== typeof options.path) {
            options.path = defaultPath;
        }
        if (!path.isAbsolute(options.path)) {
            options.path = path.join(path.dirname(caller()), options.path);
        }
        debug("Views: path is " + options.path);
        if ('string' !== typeof options.default) {
            options.default = defaultEngine;
        }
        options.map = options.map || {};

        this.options = extend(true, {}, options);

        this.cache = cache(options.cacheLimit > 0 ? options.cacheLimit : 100);
        this.engines = {};

        debug("Views: constructed");
    }

    read (viewPath, options) {
        debug("Views: Views.read");
        if (!viewPath || 'string' !== typeof viewPath) {
            throw new Error("Param path of the view is required!");
        }
        if (!path.isAbsolute(viewPath)) {
            viewPath = path.join(this.options.path, viewPath);
        }
        if (viewPath.indexOf(this.options.path) !== 0) {
            throw new Error("Access denied, you can only read view files under " + this.options.path);
        }
        let extname = path.extname(viewPath);
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
                    extname: extname,
                });
            }
            debug("Views: Reading file " + viewPath);
            fs.readFile(viewPath, (error, tpl) => {
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
                    extname: extname,
                });
            });
        });
    }

    render (viewPath, locals) {
        debug("Views: Views.render");
        return this.read(viewPath, locals).then(result  => {
            let {tpl, extname} = result;
            let enginename = extname;
            if (extname && this.options.map && this.options.map[extname]) {
                enginename = this.options.map[extname];
            }
            let engine;
            if (this.engines.hasOwnProperty(enginename)) {
                engine = this.engines[enginename];
            }
            else {
                try {
                    debug("Views: loading engine " + enginename);
                    engine = require(enginename);
                }
                catch (e) {
                    debug("Views: load engine " + enginename + " failed : " + e.message);
                    engine = null;
                }
                this.engines[enginename] = engine;
            }
            if (!engine) {
                debug("Views: engine not define, return content directly");
                return tpl;
            }
            else {
                debug("Views: render by engine " + enginename);
                return engine.render(tpl, locals)
            }
        });
    }
    saveInstance (name = 'default') {
        debug("Logger: saving instance");
        if (savedInstances[name]) {
            throw new Error('Fail to save view instance as "' + name + '" : name duplicated with existing instance');
        }
        savedInstances[name] = this;
        return this;
    }
    static instance (name = 'default') {
        return savedInstances[name] || null;
    }
}

const savedInstances = {};

export default Views;
