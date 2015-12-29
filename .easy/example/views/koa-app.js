/**
 * Example of using Lark-views in Koa-app
 **/
'use strict';

var _debug2 = require('debug');

var _debug3 = _interopRequireDefault(_debug2);

var _middleware = require('../middleware');

var _middleware2 = _interopRequireDefault(_middleware);

var _koa = require('koa');

var _koa2 = _interopRequireDefault(_koa);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const debug = (0, _debug3.default)("lark-views");

const app = new _koa2.default();

const options = {
  path: 'views'

};

app.use((0, _middleware2.default)());