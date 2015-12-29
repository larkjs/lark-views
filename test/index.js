/**
 * Lark-views test
 **/
'use strict';

import _debug   from 'debug';
import app      from '../example/koa-app';
import test     from 'supertest';

const debug   = _debug('lark-views');
const request = test.agent(app.listen(3000));

describe('request on render=a', () => {
    it('should return rendered template a.tpl with ejs', done => {
        request.get('/?render=a')
              .expect(200)
              .expect('This is template a. The variable is "request url is /?render=a".\n', done);
    });
    it('should return rendered template a.tpl with ejs, using cache', done => {
        request.get('/?render=a')
              .expect(200)
              .expect('This is template a. The variable is "request url is /?render=a".\n', done);
    });
});

describe('request on render=b', () => {
    it('should return template b.js without rendering', done => {
        request.get('/?render=b')
              .expect(200)
              .expect('"use strict";\n\nconsole.log("This is static js file b");', done);
    });
});

describe('request on render=c', () => {
    it('should return template c.html without rendering', done => {
        request.get('/?render=c')
              .expect(200)
              .expect('<h1>How are you!</h1>\n', done);
    });
});

describe('request on render=d', () => {
    it('should return template d.jade with jade', done => {
        request.get('/?render=d')
              .expect(200)
              .expect('<!DOCTYPE html><html lang="en"><head><title></title><script type="text/javascript">if (foo) bar(1 + 5)</script></head><body><h1>Jade - node template engine</h1><div id="container" class="col"><p>Get on it!</p><p>Jade is a terse and simple templating language with a\nstrong focus on performance and powerful features.</p></div></body></html>', done);
    });
    it('should return template d.jade with jade, using cache', done => {
        request.get('/?render=d')
              .expect(200)
              .expect('<!DOCTYPE html><html lang="en"><head><title></title><script type="text/javascript">if (foo) bar(1 + 5)</script></head><body><h1>Jade - node template engine</h1><div id="container" class="col"><p>Get on it!</p><p>Jade is a terse and simple templating language with a\nstrong focus on performance and powerful features.</p></div></body></html>', done);
    });
});