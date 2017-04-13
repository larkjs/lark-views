/**
 * Example of lark-views
 **/
'use strict';

process.mainModule = module;
const Views = require('..');

const pug   = require('pug');

const views = new Views({
    path: 'views',
    map: {
        tpl: 'ejs',
        ejs: 'ejs',
        pug: 'pug',
        jade: 'jade',
    }
});

views.setEngine('pug', pug);

// views.render('a.tpl', { variable: 'test' }).then(result => console.log(result));

module.exports = views;

