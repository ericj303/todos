'use strict';
console.log('Loading function');

const table = 'Todos';
const AWS = require("aws-sdk");

exports.handler = (event, context, callback) => {
    console.log('Received event:', JSON.stringify(event, null, 2));

    var uuid = '';
    if (event.uuid) {
        uuid = event.uuid;
    } else {
        const err = 'Request Error: Missing uuid of todo!';
        console.log(err);
        callback(new Error(err));
    }
    
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
        const err = 'Request Error: Missing uuid of todo!';
        console.log(err);
        callback(new Error(err));
    }
    
    var priority = 0;
    if (event.priority) {
        priority = event.priority;
    } else {
        console.log('Error: Missing priority field in todo!');
        callback(new Error(`Missing priority field in todo!`));
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
 
    console.log("Updating an item: ", JSON.stringify(params, null, 2));
    //replace old item with new one
    docClient.put(params, function(err, data) {
        if (err) {
            console.error("Unable to update item. Error JSON:", JSON.stringify(err, null, 2));
            callback("Unable to update item. Error JSON:", JSON.stringify(err, null, 2));
        } else {
            console.log("Updated item ", JSON.stringify(data, null, 2));
            context.succeed("Updated item ", JSON.stringify(data, null, 2));
        }
    });
    
    
    /* To reviewer:
    Using regular update doesn't work because "user" is reserved keyword.  If the schema is changed to "usr" or something else the
    below update code could could be used.  See error below along with update code.
    
    2016-07-11T00:38:44.475Z	d1ad292e-46ff-11e6-ac0f-b1631479e0d6	Unable to update item. Error JSON: {
      "message": "Invalid UpdateExpression: Attribute name is a reserved keyword; reserved keyword: user",
      "code": "ValidationException",
      "time": "2016-07-11T00:38:44.474Z",
      "requestId": "VC74KRONTFVHDKMBOO79O1DE7RVV4KQNSO5AEMVJF66Q9ASUAAJG",
      "statusCode": 400,
      "retryable": false,
      "retryDelay": 0
    }
    
    var params = {
        TableName:table,
        Key:{
            "uuid": uuid
        },
        UpdateExpression: "set Todos.user = :u, Todos.description =:d, Todos.priority =:p, Todos.completed = :c",
        ExpressionAttributeValues:{
            ":u": updatedUser,
            ":d": description,
            ":p": priority,
            ":c": completed
        },
        ReturnValues:"UPDATED_NEW"
    };

    console.log("Updating an item: ", JSON.stringify(params, null, 2));
    docClient.update(params, function(err, data) {
        if (err) {
            console.error("Unable to update item. Error JSON:", JSON.stringify(err, null, 2));
            callback("Unable to update item. Error JSON:", JSON.stringify(err, null, 2));

        } else {
            console.log("Update succeeded:", JSON.stringify(data, null, 2));
            callback("Updated item:", JSON.stringify(data, null, 2));
        }
    });
   */
};
