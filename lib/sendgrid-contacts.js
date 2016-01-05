var r = require("request");

//follows same contructor as sendgrid API
var Contacts = function(apiUserOrKey, apiKeyOrOptions, options) {

  if( !(this instanceof Contacts) ) {
    return new Contacts(apiUserOrKey, apiKeyOrOptions, options);
  }

  // Check if given a username + password or api key
  if (typeof apiKeyOrOptions === 'string') {
    // Username and password
    this.api_user = apiUserOrKey;
    this.api_key  = apiKeyOrOptions;
    this.options  = options || {};
  } else if (typeof apiKeyOrOptions === 'object' || apiKeyOrOptions === undefined) {
    // API key
    this.api_key  = apiUserOrKey;
    this.api_user = null;

    // With options
    this.options = apiKeyOrOptions || {};
  } else {
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
  
  this.options.uri = this.options.uri || uriParts.protocol + "://" + uriParts.host + (uriParts.port ? ":" + uriParts.port : "") + uriParts.endpoint;
  var request = r.defaults({headers: {'Authorization' : 'Bearer ' + this.api_key}});
  //Standard callback for all requests
  var apiCallback = function(callback){
  return function(err, resp, body){
    var json;

      if(err) return callback(err, null);
      
      try {
        json = JSON.parse(body);
      } catch (e) {
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
//Create a List - POST
  this.lists.createList = function(body, callback){
      request({
        uri: this.options.uri + "/lists",
        method: 'POST',
        json: body},
        apiCallback(callback));
  };
//List All Lists - GET
  this.lists.getAllLists = function(callback){
      request({
        uri: this.options.uri + "/lists",
        method: 'GET'},
        apiCallback(callback));
  };
//Delete Multiple Lists - DELETE
  this.lists.deleteMultipleLists = function(body, callback){
      request({
        uri: this.options.uri + "/lists",
        method: 'DELETE',
        json: body},
        apiCallback(callback));
  };
//Retrieve a List - GET
  this.lists.getList = function(params, callback){
      request({
        uri: this.options.uri + "/lists/" + params.listId,
        method: 'GET'},
        apiCallback(callback));
  };
//Update a List - PATCH
  this.lists.updateList = function(params, body, callback){
      request({
        uri: this.options.uri + "/lists/" + params.listId,
        method: 'PATCH',
        json: body 
      },
        apiCallback(callback));
  };
//Delete a List - DELETE
  this.lists.deleteList = function(params, body, callback){
      request({
        uri: this.options.uri + "/lists/" + params.listId,
        method: 'DELETE'
      },
        apiCallback(callback));
  };
//List Recipients on a List - GET
  this.lists.getListRecipients = function(params, body, callback){
      request({
        uri: this.options.uri + "/lists/" + params.listId + "/recipients",
        method: 'GET',
        qs: {page: params.page, page_size: params.page_size}
      },
        apiCallback(callback));
  };
//Delete a Single Recipient From a List - DELETE
  this.lists.deleteListRecipient = function(params, body, callback){
      request({
        uri: this.options.uri + "/lists/" + params.listId + "/recipients/" + params.recipient_id,
        method: 'DELETE'
      },
        apiCallback(callback));
  };
//Add Multiple Recipients To a List - POST
  this.lists.addListRecipients = function(params, body, callback){
      request({
        uri: this.options.uri + "/lists/" + params.listId + "/recipients/",
        method: 'POST',
        json: body
      },
        apiCallback(callback));
  };
//Recipients
//Add Multiple Recipients - POST
this.recipients.addRecipients = function(body, callback){
      request({
        uri: this.options.uri + "/contactdb" + "/recipients",
        method: 'POST',
        json: body
      },
        apiCallback(callback));
  };
//Update a Recipient - PATCH
this.recipients.updateRecipients = function(body, callback){
      request({
        uri: this.options.uri + "/contactdb" + "/recipients",
        method: 'PATCH',
        json: body
      },
        apiCallback(callback));
  };
//Delete one or more Recipients - DELETE
this.recipients.deleteRecipients = function(body, callback){
      request({
        uri: this.options.uri + "/contactdb" + "/recipients",
        method: 'DELETE',
        json: body
      },
        apiCallback(callback));
  };
//List Recipients - GET
this.recipients.getRecipients = function(params, callback){
      request({
        uri: this.options.uri + "/contactdb" + "/recipients",
        method: 'GET',
        qs: {page: params.page, page_size: params.page_size}
      },
        apiCallback(callback));
  };
//Retrieve a Recipient - GET
this.recipients.getRecipient = function(params, callback){
      request({
        uri: this.options.uri + "/contactdb" + "/recipients/" + params.recipient_id,
        method: 'GET'
      },
        apiCallback(callback));
  };
//Delete a single Recipient - DELETE
this.recipients.deleteRecipient = function(params, callback){
      request({
        uri: this.options.uri + "/contactdb" + "/recipients/" + params.recipient_id,
        method: 'DELETE'
      },
        apiCallback(callback));
  };
//Gets the lists the Recipient is on - GET
this.recipients.getRecipientLists = function(params, callback){
      request({
        uri: this.options.uri + "/contactdb" + "/recipients/" + params.recipient_id + "/lists",
        method: 'GET'
      },
        apiCallback(callback));
  };
//Get Count of Billable Recipients - GET
this.recipients.getBillableRecipientCount = function(callback){
      request({
        uri: this.options.uri + "/contactdb" + "/recipients/" + "billable_count",
        method: 'GET'
      },
        apiCallback(callback));
  };
//Get Count of Recipients - GET
this.recipients.getRecipientCount = function(callback){
      request({
        uri: this.options.uri + "/contactdb" + "/recipients/" + "count",
        method: 'GET'
      },
        apiCallback(callback));
  };
//Get Recipients Matching Search Criteria - GET
this.recipients.searchRecipients = function(params, callback){
      request({
        uri: this.options.uri + "/contactdb" + "/recipients/" + "/search",
        method: 'GET',
        qs:{params}
      },
        apiCallback(callback));
  };
};


module.exports = Contacts;