import {objectifyFormArray} from './formHelpers.js';
import {contactsAPI} from './contactAPI.js';
import './handlebarsHelpers.js';

$(function(){
    let contactList = new contactsAPI(),
        templates = {};
    
    //register templates
    $("script[type='text/x-handlebars']").each(function() {
        var $tmpl = $(this);
        templates[$tmpl.attr("id")] = Handlebars.compile($tmpl.html());
    });

    $("[data-type=partial]").each(function() {
        var $partial = $(this);
        Handlebars.registerPartial($partial.attr('id'), $partial.html());
    });

    // eventhandlers-page
    // add contact
    $("main").on('click', 'a.eventhandler-add-contact', function(e){
        e.stopPropagation();
        e.preventDefault();
        $('main').html(templates.form_template);
    });

    //eventhandlers-form
    // cancel
    $("main").on('click', '#form-cancel', function(e){
        e.stopPropagation();
        e.preventDefault();
        $('main').html(templates.list_view);
    });
    
    // submit
    $("main").on('click', 'button[type=submit]', function(e){
        e.stopPropagation();
        e.preventDefault();
        let data = objectifyFormArray($('form').serializeArray());
        contactList.add(data);
        contactList.list().then((data)=>console.table(data));
    });

    // eventhandlers-card
    // Update
    $('main').on('click', 'a.eventhandler-update-contact', function(e){
        e.stopPropagation();
        e.preventDefault();
        $('main').html(templates.form_template);
    });

    // Delete
    $("main").on('click', 'a.eventhandler-delete-contact', function(e){
        e.stopPropagation();
        e.preventDefault();
        let id = $(e.currentTarget).closest('article').attr('id');
        contactList.delete(id);
        $('main').html(templates.list_view);
    });




    // load
    contactList.list().then(function(data){
        let context = {
            "hasItems": Object.keys(data).length > 0,
            "items": data
        };

        $('main').html(templates.list_view(context));
    });
});