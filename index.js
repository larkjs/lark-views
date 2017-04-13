
/**
 * Lark-Views
 **/
'use strict';

const assert  = require('assert');
const cache   = require('lru-cache');
const extend  = require('extend');
const fs      = require('fs');
const misc    = require('vi-misc');
const path    = require('path');

const defaultPath   = 'views';
const defaultEngine = 'ejs';

class Views {
    constructor (options = {}) {
        options = extend({}, options, true);
        options.path = 'string' !== typeof options.path ? defaultPath : options.path;
        options.path = misc.path.absolute(options.path);

        options.engine = 'string' !== typeof options.engine ? defaultEngine : options.engine;

        options.map = options.map || {};
        this.options = options;
        this.cache = cache(options.cache || {});
        this.engines = options.engines || {};
    }

    setEngine(name, engine) {
        this.engines[name] = engine;
    }

    async read(viewPath) {
        assert('string' === typeof viewPath, 'Param path of the view is required!');
        if (!path.isAbsolute(viewPath)) {
            viewPath = path.join(this.options.path, viewPath);
        }
        viewPath = misc.path.absolute(viewPath);
        assert(viewPath.startsWith(this.options.path),
            `Access denied, you can only read view files under '${this.options.path}', '${viewPath}' given`);
        let extname = path.extname(viewPath);
        if (!extname) {
            extname = `.${this.options.engine}`;
            viewPath += extname;
        }
        const type = extname.slice(1);
        let template = this.cache.get(viewPath);
        if (!template) {
            template = await this.readFile(viewPath);
            this.cache.set(viewPath, template);
        }

        return { template, type };
    }

    async readFile(filepath) {
        return await new Promise((resolve, reject) => {
            fs.readFile(filepath, (error, template) => {
                if (error) {
                    return reject(error);
                }
                template = template.toString();
                return resolve(template);
            });
        });
    }

    async render (viewPath, data = {}) {
        const { template, type } = await this.read(viewPath);
        let engineName = this.options.map[type];
        if (!engineName) {
            return template;
        }
        let engine = this.engines[engineName];
        if (!engine) {
            try {
                engine = require(engineName);
            }
            catch (e) {
                throw new Error(`Can not load template engine ${engineName}, try '$ npm install ${engineName}' to install`);
            }
        }
        return engine.render(template, data);
    }
}

module.exports = Views;
