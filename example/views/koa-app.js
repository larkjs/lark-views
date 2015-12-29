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
	
}

app.use(views())