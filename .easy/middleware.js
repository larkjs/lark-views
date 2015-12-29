/**
 *  Koa/Lark middleware
 **/

'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _debug2 = require('debug');

var _debug3 = _interopRequireDefault(_debug2);

var _caller = require('caller');

var _caller2 = _interopRequireDefault(_caller);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _ = require('./');

var _2 = _interopRequireDefault(_);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } step("next"); }); }; }

const debug = (0, _debug3.default)("lark-views");

function middleware(options, output) {
	debug("Middleware: create middleware");
	if ('string' !== typeof options.path) {
		options.path = '';
	}
	if (!_path2.default.isAbsolute(options.path)) {
		options.path = _path2.default.join(_path2.default.dirname((0, _caller2.default)()), options.path);
	}
	const views = new _2.default(options);
	if (output) {
		output.views = views;
	}
	return (function () {
		var ref = _asyncToGenerator(function* (ctx, next) {
			debug("Middleware: ctx.render enabled!");
			ctx.render = (function () {
				var ref = _asyncToGenerator(function* (viewPath, locals) {
					debug("Middleware: ctx.render " + viewPath);
					ctx.body = yield views.render(viewPath, locals);
					return ctx.body;
				});

				return function (_x3, _x4) {
					return ref.apply(this, arguments);
				};
			})();
			yield next();
		});

		return function (_x, _x2) {
			return ref.apply(this, arguments);
		};
	})();
}

debug("Middleware: load!");
exports.default = middleware;
