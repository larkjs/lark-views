/**
 * Example of using Lark-views in Koa-app
 **/
'use strict';

import _debug		from 'debug';
import views 		from '../middleware';
import Koa 		from 'koa';

const debug = _debug("lark-views");

const app = new Koa();

const options = {
	path: 'views',
    map: {
        tpl: 'ejs'
    }
}

const tpl = {
	'a' : 'a.tpl',
	'b' : 'b.js',
	'c' : 'c.html',
	'd' : 'd.jade',
}

app.use(views(options));
app.use(async (ctx, next) => {
	for (const name of ['a', 'b', 'c', 'd']) {
		if (ctx.url.includes('render=' + name)) {
			await ctx.render(tpl[name], { variable: 'request url is ' + ctx.url });
		}
	}
	await next();
})

if (!module.parent) {
	app.listen(3000);
	console.log('App listening at 3000...');
}

export default app;