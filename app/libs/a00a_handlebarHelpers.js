'use strict';

Handlebars.registerHelper('ifIn', function (elem, list, options) {
    if (list.indexOf(elem) > -1) {
        return options.fn(this);
    }
    return options.inverse(this);
});
Handlebars.registerHelper('ifNotIn', function (elem, list, options) {
    if (list.indexOf(elem) > -1) {
        return options.inverse(this);
    }
    return options.fn(this);
});