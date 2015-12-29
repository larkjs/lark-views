/**
 * Example of using Lark-views in Koa-app
 **/
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _debug2 = require('debug');

var _debug3 = _interopRequireDefault(_debug2);

var _middleware = require('../middleware');

var _middleware2 = _interopRequireDefault(_middleware);

var _koa = require('koa');

var _koa2 = _interopRequireDefault(_koa);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } step("next"); }); }; }

const debug = (0, _debug3.default)("lark-views");

const app = new _koa2.default();

const options = {
	map: {
		tpl: 'ejs'
	}
};

const tpl = {
	'a': 'a.tpl',
	'b': 'b.js',
	'c': 'c.html',
	'd': 'd.jade'
};

app.use((0, _middleware2.default)('views', options));
app.use((function () {
	var ref = _asyncToGenerator(function* (ctx, next) {
		var _arr = ['a', 'b', 'c', 'd'];

		for (var _i = 0; _i < _arr.length; _i++) {
			const name = _arr[_i];
			if (ctx.url.includes('render=' + name)) {
				yield ctx.render(tpl[name], { variable: 'request url is ' + ctx.url });
			}
		}
		yield next();
	});

	return function (_x, _x2) {
		return ref.apply(this, arguments);
	};
})());

if (!module.parent) {
	app.listen(3000);
	console.log('App listening at 3000...');
}

exports.default = app;