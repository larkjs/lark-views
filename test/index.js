/**
 * Lark-views test
 **/
'use strict';

const path  = require('path');
const Views = require('..');
const views = require('../example/app');

describe('render with engine', () => {
    it('should be ok initializing in different cases', async () => {
        let views1 = new Views();
        let views2 = new Views({});
        let views3 = new Views({ engine: 'ejs' });
        let views4 = new Views({ cache: { max: 10} });
    });
    it('should response html with ejs', async () => {
        let result = null;
        result = await views.render('a.tpl', { variable: 'test' });
        result.should.be.exactly('This is template a. The variable is "test".\n');
        result = await views.render(path.join(__dirname, '../example/views', 'a.tpl'), { variable: 'test2' });
        result.should.be.exactly('This is template a. The variable is "test2".\n');
        result = await views.render('e', { variable: 'test' });
        result.should.be.exactly('This is template e.ejs. The variable is "test".\n');
    });
    it('should response raw content if not match', async () => {
        let result = null;
        result = await views.render('b.js');
        result.should.be.exactly('module.exports = \'This is static js file b\';\n');
        result = await views.render('c.html');
        result.should.be.exactly('<h1>How are you!</h1>\n');

    });
    it('should response html with pug', async () => {
        let result = await views.render('d.pug');
        result.should.be.exactly('<!DOCTYPE html><html lang="en"><head><title></title><script type="text/javascript">if (foo) bar(1 + 5)</script></head><body><h1>Jade - node template engine</h1><div class="col" id="container"><p>Get on it!</p><p>Jade is a terse and simple templating language with a strong focus on performance and powerful features.</p></div></body></html>');
    });
    it('should throw if file not exist', async () => {
        let error = {};
        try {
            await views.render('no-exist');
        }
        catch (e) {
            error = e;
        }
        error.should.be.an.instanceof(Error);
    });
});
