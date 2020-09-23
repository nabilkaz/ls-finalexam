# Contact Manager
This project is part of the conditional requirement for passing the final project assessment. Completed within the 72 hour limit. The application is a simple CRUD contact list application that additionally allows for tagging and searching. The assessment is based on the overall development approach with an emphasis on organizing structure.

## Interfacing with the API
The general approach was to abstract the CRUD functionality of the API into an object `contactsAPI` which the rest of the code would interface with. Methods return a `Promise` that can then be handled in conjunction with event handlers.

```
contactsApi
├── #sendRequest        // private methods - for methods that require - GET & DELETE
├── #sendData           // private method - for methods that require data - PUT & POST 
├── add(data)           // Creates a new contact using GET method & #sendData
├── update(id, data)    // Updates an existing contact
├── get(id)             // Reads an existing contact
├── list()              // Reads entire list of contacts
└── delete(id)          // Delete an exisitn contact
```

## Modularizing HTML with Handlebars.js
The user interface was broken down into the core app views:
```
index/
└── main_view/
    ├── searchbar
    ├── list_view
    │   ├── list_items // generates list of contacts
    │   └── empty_list // handles both list without items and no results
    └── form_template // handles both updates and new submissions
```
The styling was administered used (TailwindCSS)[https://tailwindcss.com/]. It takes a utlity-first approach to styling components.

### Form view
`form_template` pulls in contact data and adds it to the form values and id (the key identifier for the contact). If there is none. The values simply don't register. Upon submission there is an event-handler in `app.js` that checks if there is an `id` attribute on the `form` tag. If so it submits it as an update using the `contactsAPI` method `update(id, data)` otherwise it'll submit it as new contact with the `add(data)` method.

### Empty list view
`empty_list` used Handlebars expressions to introduce logical displays for both when there are no items in your contact list or if there are no search results. This was done so we could use a single template for handling list empty states.

### Search bar
The search bar functionality relies on the `contactsAPI` object, filtering the resolved results from the `Promise` and updating the view using the Handlebars partial `list_view`.

## Event-handlers
`app.js` focuses on imports helper modules for interaction and template views. Event handlers are split up into their functional areas:
- Page-level functionality:
    - Add contact event handler
    - Search event handlers
- Form-level functionality
    - Form submission handler
    - Form cancellation handler
- Card-level functionality
    - Edit contact information handler
    - Delete contact handler
