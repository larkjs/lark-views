/**
 * Example of lark-views
 **/
'use strict';

import _debug   from 'debug';
import Views    from '..';

const debug = _debug('lark-views');

const views = new Views({
    path: 'views',
    map: {
        tpl: 'ejs'
    }
});

setTimeout(() => {
    debug("Example: render a.tpl with variable test");
    views.render('a.tpl', { variable: 'test' })
        .then(data => console.log(data))
        .catch(e => console.error(e.stack));
    }, 0);

setTimeout(() => {
    debug("Example: render a.tpl with variable test2");
    views.render('a.tpl', { variable: 'test2' })
        .then(data => console.log(data))
        .catch(e => console.error(e.stack));
    }, 1000);

setTimeout(() => {
    debug("Example: render b.tpl");
    views.render('b.js')
        .then(data => console.log(data))
        .catch(e => console.error(e.stack));
    }, 2000);

setTimeout(() => {
    debug("Example: render c.html");
    views.render('c.html')
        .then(data => console.log(data))
        .catch(e => console.error(e.stack));
    }, 3000);

setTimeout(() => {
    debug("Example: render c.html");
    views.render('c.html')
        .then(data => console.log(data))
        .catch(e => console.error(e.stack));
    }, 4000);

setTimeout(() => {
    debug("Example: render d.jade");
    views.render('d.jade')
        .then(data => console.log(data))
        .catch(e => console.error(e.stack));
    }, 5000);

debug("Example: load");
