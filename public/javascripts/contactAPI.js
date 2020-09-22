class contactsAPI {
    constructor() {
        this.path = '/api/contacts/';
    }

    #sendRequest(method, path){
        return new Promise(
            function(resolve, reject){
                let request = new XMLHttpRequest();
                request.open(method, path, true);
                request.responseType = 'json';
                request.onload = function (e) {
                    if (request.readyState === 4) {
                        if (request.status === 200 || request.status === 204) {
                            resolve(request.response);
                        } else {
                            reject(request.status);
                        }
                    }
                };
                request.onerror = function (e) {
                    reject(request.statusText);
                };
                request.send();		
            }
        );
    }

    #sendData(method, path, data) {
        let json = JSON.stringify(data);
        let request = new XMLHttpRequest();

        request.open(method, path, true);
        request.setRequestHeader("Content-Type", "application/json");

        request.send(json);	
    }

    list(){
        let method = 'GET';
        let path = this.path;
        return this.#sendRequest(method, path);
    }

    get(id){
        let method = 'GET';
        let path = this.path+id;
        return this.#sendRequest(method, path);
    }

    add(data){
        let method = 'POST';
        return this.#sendData(method, this.path, data);
    }

    delete(id){
        let method = 'DELETE';
        let path = this.path + id;
        return this.#sendRequest(method, path);
    }

    update(id, data){
        let path = this.path+id;
        let method = 'PUT';
        return this.#sendData(method, path, data);
    }
}

export {contactsAPI};