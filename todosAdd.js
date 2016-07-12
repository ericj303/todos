'use strict';
console.log('Loading function');

const uuid = require('node-uuid');
const table = 'Todos';
const AWS = require("aws-sdk");

exports.handler = (event, context, callback) => {
    console.log('Received event:', JSON.stringify(event, null, 2));

    var uuid = uuid.v1(); //generate time-based id

    //dynamodb doesn't allow empty strings for attribute values.  
    //either give a pragmatic default or remove empty items from params object after populating
    var user = '-';  
    if (event.user) {
        user = event.user;
    }

    var description = '';
    if (event.description) {
        description = event.description;
    } else {
	const err = 'Request Error: Missing description field in todo!';
        console.log(err);
        callback(new Error(err));
    }
    
    var priority = 0;
    if (typeof event.priority !== 'undefined') {
        priority = event.priority;
    } else {
	const err = 'Request Error: Missing priority field in todo!';
        console.log(err);
        callback(new Error(err));
    }

    var completed = '-';
    if (event.completed) {
        completed = event.completed;
    }
    
    var docClient = new AWS.DynamoDB.DocumentClient();
    var params = {
        TableName:table,
        Item:{
            "uuid": uuid,
            "user": user,
            "description": description,
            "priority": priority,
            "completed": completed
        }
    };
 
    console.log("Adding a new item: ", JSON.stringify(params, null, 2));
    docClient.put(params, function(err, data) {
        if (err) {
            console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
            callback("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
        } else {
            console.log("Added item " + uuid+ ": ", JSON.stringify(data, null, 2));
            context.succeed("uuid: " + uuid);
        }
    });
};
