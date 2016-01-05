var r = require("request");

//follows same contructor as sendgrid API
var Contacts = function(apiUserOrKey, apiKeyOrOptions, options) {

  if (!(this instanceof Contacts)) {
    return new Contacts(apiUserOrKey, apiKeyOrOptions, options);
  }

  // Check if given a username + password or api key
  if (typeof apiKeyOrOptions === 'string') {
    // Username and password
    this.api_user = apiUserOrKey;
    this.api_key = apiKeyOrOptions;
    this.options = options || {};
  }
  else if (typeof apiKeyOrOptions === 'object' || apiKeyOrOptions === undefined) {
    // API key
    this.api_key = apiUserOrKey;
    this.api_user = null;

    // With options
    this.options = apiKeyOrOptions || {};
  }
  else {
    // Won't be thrown?
    throw new Error('Need a username + password or api key!');
  }

  // do this to mantain similarity to other libs
  var uriParts = {};
  uriParts.protocol = this.options.protocol || "https";
  uriParts.host = this.options.host || "api.sendgrid.com";
  uriParts.port = this.options.port || "";
  uriParts.endpoint = this.options.endpoint || "/v3/contactdb";
  delete this.options.protocol;
  delete this.options.host;
  delete this.options.port;
  delete this.options.endpoint;
  this.options.uriParts = uriParts;

  var uri = this.options.uri || uriParts.protocol + "://" + uriParts.host + (uriParts.port ? ":" + uriParts.port : "") + uriParts.endpoint;
  var request = r.defaults({
    headers: {
      'Authorization': 'Bearer ' + this.api_key
    }
  });
  //Standard callback for all requests
  var apiCallback = function(callback) {
      return function(err, resp, body) {
        var json;
        if (err) return callback(err, null);
        try {
          if (typeof(body) === 'object') {
            json = body;
          }
          else if (typeof(body) === 'undefined') {
            json = {};
          }
          else {
            json = JSON.parse(body);
          }
        }
        catch (e) {
          // be more granular with the error message
          e.message = e.message + " JSONPARSEERROR when parsing: " + body;
          return callback(new Error(e), null);
        }

        /*if (json.message !== 'success') {
          var error = 'sendgrid error';
          if (json.errors) { error = json.errors.shift(); }
          return callback(new Error(error), null);
        }*/

        return callback(null, json);
      };
    }
    //Lists
  this.lists = {
    //Create a List - POST
    createList: function(body, callback) {
      request({
          uri: uri + "/lists",
          method: 'POST',
          json: body
        },
        apiCallback(callback));
    },
    //List All Lists - GET
    getAllLists: function(callback) {
      request({
          uri: uri + "/lists",
          method: 'GET'
        },
        apiCallback(callback));
    },
    //Delete Multiple Lists - DELETE
    deleteMultipleLists: function(body, callback) {
      request({
          uri: uri + "/lists",
          method: 'DELETE',
          json: body
        },
        apiCallback(callback));
    },
    //Retrieve a List - GET
    getList: function(params, callback) {
      request({
          uri: uri + "/lists/" + params.list_id,
          method: 'GET'
        },
        apiCallback(callback));
    },
    //Update a List - PATCH
    updateList: function(params, body, callback) {
      request({
          uri: uri + "/lists/" + params.list_id,
          method: 'PATCH',
          json: body
        },
        apiCallback(callback));
    },
    //Delete a List - DELETE
    deleteList: function(params, body, callback) {
      request({
          uri: uri + "/lists/" + params.list_id,
          method: 'DELETE'
        },
        apiCallback(callback));
    },
    //List Recipients on a List - GET
    getListRecipients: function(params, body, callback) {
      request({
          uri: uri + "/lists/" + params.list_id + "/recipients",
          method: 'GET',
          qs: {
            page: params.page,
            page_size: params.page_size
          }
        },
        apiCallback(callback));
    },
    //Delete a Single Recipient From a List - DELETE
    deleteListRecipient: function(params, body, callback) {
      request({
          uri: uri + "/lists/" + params.list_id + "/recipients/" + params.recipient_id,
          method: 'DELETE'
        },
        apiCallback(callback));
    },
    //Add Multiple Recipients To a List - POST
    addListRecipients: function(params, body, callback) {
      request({
          uri: uri + "/lists/" + params.list_id + "/recipients",
          method: 'POST',
          json: body
        },
        apiCallback(callback));
    }
  };
  //Recipients
  //Add Multiple Recipients - POST
  this.recipients = {
    addRecipients: function(body, callback) {
      request({
          uri: uri + "/recipients",
          method: 'POST',
          json: body
        },
        apiCallback(callback));
    },
    //Update a Recipient - PATCH
    updateRecipients: function(body, callback) {
      request({
          uri: uri + "/recipients",
          method: 'PATCH',
          json: body
        },
        apiCallback(callback));
    },
    //Delete one or more Recipients - DELETE
    deleteRecipients: function(body, callback) {
      request({
          uri: uri + "/recipients",
          method: 'DELETE',
          json: body
        },
        apiCallback(callback));
    },
    //List Recipients - GET
    getRecipients: function(params, callback) {
      request({
          uri: uri + "/recipients",
          method: 'GET',
          qs: {
            page: params.page,
            page_size: params.page_size
          }
        },
        apiCallback(callback));
    },
    //Retrieve a Recipient - GET
    getRecipient: function(params, callback) {
      request({
          uri: uri + "/recipients/" + params.recipient_id,
          method: 'GET'
        },
        apiCallback(callback));
    },
    //Delete a single Recipient - DELETE
    deleteRecipient: function(params, callback) {
      request({
          uri: uri + "/recipients/" + params.recipient_id,
          method: 'DELETE'
        },
        apiCallback(callback));
    },
    //Gets the lists the Recipient is on - GET
    getRecipientLists: function(params, callback) {
      request({
          uri: uri + "/recipients/" + params.recipient_id + "/lists",
          method: 'GET'
        },
        apiCallback(callback));
    },
    //Get Count of Billable Recipients - GET
    getBillableRecipientCount: function(callback) {
      request({
          uri: uri + "/recipients/" + "billable_count",
          method: 'GET'
        },
        apiCallback(callback));
    },
    //Get Count of Recipients - GET
    getRecipientCount: function(callback) {
      request({
          uri: uri + "/recipients/" + "count",
          method: 'GET'
        },
        apiCallback(callback));
    },
    //Get Recipients Matching Search Criteria - GET
    searchRecipients: function(params, callback) {
      request({
          uri: uri + "/recipients/" + "/search",
          method: 'GET',
          qs: {
            params
          }
        },
        apiCallback(callback));
    }
  };
};


module.exports = Contacts;