const AWS = require('aws-sdk');
const aws_access_key_id = 'YOURKEY'; //replace with load from S3 file, etc.
const aws_secret_access_key = 'YOURSECRET'; //replace with load from S3 file, etc.

function sendEmails(records) {
    console.log("sendEmails() records.length: " + records.length);

    var len = records.length;
    for (var i = 0; i < len; i++) {
        if (records[i].completed === '-') {
            var address = records[i].user;
            var emailTxt = "The following todo still needs to be completed: " + record.description;
           
            //send email
            var eparam = {
                Destination: {
                  ToAddresses: [address]
                },
                Message: {
                  Body: {
                    Text: {
                      Data: emailTxt
                    }
                  },
                  Subject: {
                    Data: "Todos reminder email"
                  }
                },
                Source: "test@gmail.com",
                ReplyToAddresses: ["test@gmail.com"],
                ReturnPath: "test@gmail.com"
            };

            ses.sendEmail(eparam, function (err, data) {
              if (err) {
                  console.log(err);
              } else {
                  console.log("===EMAIL SENT===");
                  console.log(data);
              }
            });
        }
    }
}

exports.handler = function(event, context) {
    console.log("event: ", event);

    var ses = new AWS.SES({
       accessKeyId: aws_access_key_id,
       secretAccesskey: aws_secret_access_key,
       region: 'us-east-1'
    });
   
    AWS.config.region = 'us-east-1';
    var lambda = new AWS.Lambda();

    var lambdaParams = {
        FunctionName: 'todosList',
        InvocationType: 'RequestResponse',
        LogType: 'Tail'
    };
    
    lambda.invoke(lambdaParams, function(err, data) {
        if (err) {
          context.fail(err);
        } else {
          console.log("data.Payload: " + data.Payload);
          var obj = JSON.parse(data.Payload);
          sendEmails(obj.Items);
          context.succeed();
        }
    })
};
