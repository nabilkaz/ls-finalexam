Handlebars.registerHelper('splitStr', function(aString) {
    if (aString) {
        return aString.split(/,\s?/);
    } else {
        return '';
    }
});