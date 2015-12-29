/**
 * Lark-views test
 **/
'use strict';

var _debug2 = require('debug');

var _debug3 = _interopRequireDefault(_debug2);

var _koaApp = require('../example/koa-app');

var _koaApp2 = _interopRequireDefault(_koaApp);

var _supertest = require('supertest');

var _supertest2 = _interopRequireDefault(_supertest);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var debug = (0, _debug3.default)('lark-views');
var request = _supertest2.default.agent(_koaApp2.default.listen(3000));

describe('request on render=a', function () {
    it('should return rendered template a.tpl with ejs', function (done) {
        request.get('/?render=a').expect(200).expect('This is template a. The variable is "request url is /?render=a".\n', done);
    });
    it('should return rendered template a.tpl with ejs, using cache', function (done) {
        request.get('/?render=a').expect(200).expect('This is template a. The variable is "request url is /?render=a".\n', done);
    });
});

describe('request on render=b', function () {
    it('should return template b.js without rendering', function (done) {
        request.get('/?render=b').expect(200).expect('"use strict";\n\nconsole.log("This is static js file b");', done);
    });
});

describe('request on render=c', function () {
    it('should return template c.html without rendering', function (done) {
        request.get('/?render=c').expect(200).expect('<h1>How are you!</h1>\n', done);
    });
});

describe('request on render=d', function () {
    it('should return template d.jade with jade', function (done) {
        request.get('/?render=d').expect(200).expect('<!DOCTYPE html><html lang="en"><head><title></title><script type="text/javascript">if (foo) bar(1 + 5)</script></head><body><h1>Jade - node template engine</h1><div id="container" class="col"><p>Get on it!</p><p>Jade is a terse and simple templating language with a\nstrong focus on performance and powerful features.</p></div></body></html>', done);
    });
    it('should return template d.jade with jade, using cache', function (done) {
        request.get('/?render=d').expect(200).expect('<!DOCTYPE html><html lang="en"><head><title></title><script type="text/javascript">if (foo) bar(1 + 5)</script></head><body><h1>Jade - node template engine</h1><div id="container" class="col"><p>Get on it!</p><p>Jade is a terse and simple templating language with a\nstrong focus on performance and powerful features.</p></div></body></html>', done);
    });
});