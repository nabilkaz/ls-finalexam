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

    // template helper
    function loadListView(){
        contactList.list().then(function(data){
            let context = {
                "hasItems": Object.keys(data).length > 0,
                "items": data
            };
    
            $('main').html(templates.main_view(context));
        });
    }

    // eventhandlers-page
    // add contact
    $("main").on('click', 'a.eventhandler-add-contact', function(e){
        e.stopPropagation();
        e.preventDefault();
        $('main').html(templates.form_template);
    });

    //search
    $("main").on('keyup', 'input.eventhandler-search-list', function(e){
        e.stopPropagation();
        e.preventDefault();
        // replace list with filtered one based on string
        contactList.list().then(function(data){
            let term = $(e.target).val();
            let filteredContacts = data.filter(function(contact){
                return contact.full_name.includes(term);
            });

            let context = {
                "hasItems": Object.keys(filteredContacts).length > 0,
                "term": term,
                "items": filteredContacts
            };
            $('#list').replaceWith(templates.list_view(context));
        });
    });
    
    //eventhandlers-form
    // cancel
    $("main").on('click', '#form-cancel', function(e){
        e.stopPropagation();
        e.preventDefault();
        loadListView();
    });
    
    // submit
    $("main").on('click', 'button[type=submit]', function(e){
        e.stopPropagation();
        e.preventDefault();
        let $form = $('form');
        let data = objectifyFormArray($form.serializeArray());
        let id = $form.attr('id');
        if(id){
            contactList.update(id, data);
        } else {
            contactList.add(data);
        }
        loadListView();
    });

    // eventhandlers-card
    // Update
    $('main').on('click', 'a.eventhandler-update-contact', function(e){
        e.stopPropagation();
        e.preventDefault();
        let id = $(e.currentTarget).closest('article').attr('id');

        contactList.get(id).then(function(data){
            $('main').html(templates.form_template(data));
        });
    });

    // Delete
    $("main").on('click', 'a.eventhandler-delete-contact', function(e){
        e.stopPropagation();
        e.preventDefault();
        let id = $(e.currentTarget).closest('article').attr('id');
        contactList.delete(id);

        loadListView();
    });

    // Tags
    $("main").on('click', 'a.eventhandler-filter-list', function(e){
        e.stopPropagation();
        e.preventDefault();
        let tag = $(e.target).text().replace('#', '');

        contactList.list().then(function(data){
            let filteredContacts = data.filter(function(contact){
                return contact.tags.split(/,\s?/).includes(tag);
            });

            let context = {
                "hasItems": Object.keys(filteredContacts).length > 0,
                "items": filteredContacts
            };
    
            $('main').html(templates.main_view(context));
        });
    });

    // start
    loadListView();
});