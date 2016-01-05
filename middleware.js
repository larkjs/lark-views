/**
 *  Koa/Lark middleware
 **/

'use strict';

import _debug	from 'debug';
import path 	from 'path';
import Views 	from './';

const debug = _debug("lark-views");

function middleware (options) {
	debug("Middleware: create middleware");
	if ('string' !== typeof options.path) {
		options.path = '';
	}
	if (!path.isAbsolute(options.path)) {
		options.path = path.join(path.dirname(process.mainModule.filename), options.path);
	}
	const views = new Views(options).saveInstance();
	return async (ctx, next) => {
		debug("Middleware: ctx.render enabled!");
		ctx.render = async (viewPath, locals) => {
			debug("Middleware: ctx.render " + viewPath);
			ctx.body = await views.render(viewPath, locals);
			return ctx.body;
		}
		await next();
	};
}

debug("Middleware: load!");
export default middleware;
