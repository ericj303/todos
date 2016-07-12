'use strict';
console.log('Loading function');

const table = 'Todos';
const AWS = require("aws-sdk");

exports.handler = (event, context, callback) => {
    console.log('Received event:', JSON.stringify(event, null, 2));

    var params = {
        TableName: table
    };

    var docClient = new AWS.DynamoDB.DocumentClient();
    docClient.scan(params, callback);
};
