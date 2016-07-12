# todos

To the reviewer, a few points:

0. API calls will return 200 on success, 400 on bad client requests, and 500 on server errors.  This is done by declaring response types on Method Response in API Gateway, and then in the Integration Response matching on Request Error.* for 400, and errorMessage.* for 500.  The GET call is the only one that does not have Request Error.* and 400 defined on it.

1. Versioning will be done via the API Gateway, by using stages (multiple environments) of a given API and then selectively deploying them within the scope of a tag such as dev, beta, prod. Each operation in each version can (but need not) have a distinct implementation. When the time comes to create a new version of an API, you clone an existing one, deploy the clone to a distinct stage, and continue to work on both, with the eventual goal of deprecating the older one. 

2. The keys AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY would need to be provided from a credentials file loaded from S3 or by other means.

3. Packages node-uuid and aws-sdk need to be installed via npm.
 
