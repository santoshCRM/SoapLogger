'use strict';
var https = require('https');
 
//set these values to retrieve the oauth token
var crmorg = 'https://k4mobilityltdsb.crm8.dynamics.com';
//Application ID
var clientid = 'd9fa15d8-2b90-4c5d-b355-deabbb49b647';
var username = 'admin@k4mobilityltd.onmicrosoft.com';
var userpassword = 'K4Mobility@123';
var tokenendpoint = 'https://login.microsoftonline.com/6a9fbffa-96d5-47ff-843d-3a291cc10465/oauth2/token';
 
//set these values to query your crm data
var crmwebapihost = 'k4mobilityltdsb.api.crm8.dynamics.com';
var crmwebapipath = '/api/data/v9.1/contacts?$select=fullname,contactid'; //basic query to select contacts
 
//remove https from tokenendpoint url
tokenendpoint = tokenendpoint.toLowerCase().replace('https://','');
 
//get the authorization endpoint host name
var authhost = tokenendpoint.split('/')[0];

//get the authorization endpoint path
var authpath = '/' + tokenendpoint.split('/').slice(1).join('/');

//build the authorization request
//if you want to learn more about how tokens work, see IETF RFC 6749 - https://tools.ietf.org/html/rfc6749
var reqstring = 'client_id='+clientid;
reqstring+='&resource='+encodeURIComponent(crmorg);
reqstring+='&username='+encodeURIComponent(username);
reqstring+='&password='+encodeURIComponent(userpassword);
reqstring+='&grant_type=password';

//set the token request parameters
var tokenrequestoptions = {
	host: authhost,
	path: authpath,
	method: 'POST',
	headers: {
		'Content-Type': 'application/x-www-form-urlencoded',
		'Content-Length': Buffer.byteLength(reqstring)
	}
};
 
//make the token request
var tokenrequest = https.request(tokenrequestoptions, function(response) {
	//make an array to hold the response parts if we get multiple parts
	var responseparts = [];
	response.setEncoding('utf8');
	response.on('data', function(chunk) {
		//add each response chunk to the responseparts array for later
		responseparts.push(chunk);		
	});
	response.on('end', function(){
		//once we have all the response parts, concatenate the parts into a single string
		var completeresponse = responseparts.join('');
		//console.log('Response: ' + completeresponse);
		console.log('Token response retrieved . . . ');
		
		//parse the response JSON
		var tokenresponse = JSON.parse(completeresponse);
		
		//extract the token
		var token = tokenresponse.access_token;
		 
		//pass the token to our data retrieval function
		getData(token);
	});
});
tokenrequest.on('error', function(e) {
	console.error(e);
});
 
//post the token request data
tokenrequest.write(reqstring);
 
//close the token request
tokenrequest.end();
 
 
function getData(token){
	//set the web api request headers
	var requestheaders = { 
		'Authorization': 'Bearer ' + token,
		'OData-MaxVersion': '4.0',
		'OData-Version': '4.0',
		'Accept': 'application/json',
		'Content-Type': 'application/json; charset=utf-8',
		'Prefer': 'odata.maxpagesize=500',
		'Prefer': 'odata.include-annotations=OData.Community.Display.V1.FormattedValue'
	};
	
	//set the crm request parameters
	var crmrequestoptions = {
		host: crmwebapihost,
		path: crmwebapipath,
		method: 'GET',
		headers: requestheaders
	};
	
	//make the web api request
	var crmrequest = https.request(crmrequestoptions, function(response) {
		//make an array to hold the response parts if we get multiple parts
		var responseparts = [];
		response.setEncoding('utf8');
		response.on('data', function(chunk) {
			//add each response chunk to the responseparts array for later
			responseparts.push(chunk);		
		});
		response.on('end', function(){
			//once we have all the response parts, concatenate the parts into a single string
			var completeresponse = responseparts.join('');
			
			//parse the response JSON
			var collection = JSON.parse(completeresponse).value;
			
			//loop through the results and write out the fullname
			collection.forEach(function (row, i) {
				console.log(row['fullname']);
			});
		});
	});
	crmrequest.on('error', function(e) {
		console.error(e);
	});
	//close the web api request
	crmrequest.end();
}
