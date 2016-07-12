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
    
    var params = {
        TableName: table,
        Key: {
          uuid: uuid
        }
    };

    var docClient = new AWS.DynamoDB.DocumentClient();
    //DeleteItem is an idempotent operation; running it multiple times on the same item or attribute does not result in an error response.
    //see http://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_DeleteItem.html
    docClient.delete(params, callback);
};
