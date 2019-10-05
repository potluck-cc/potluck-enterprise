﻿// WARNING: DO NOT EDIT. This file is automatically generated by AWS Amplify. It will be overwritten.

const awsmobile_DEV = {
  aws_appsync_graphqlEndpoint:
    "https://tkwq4aqahzeahawpc7bvbasbqu.appsync-api.us-east-1.amazonaws.com/graphql",
  aws_appsync_region: "us-east-1",
  aws_appsync_authenticationType: "AMAZON_COGNITO_USER_POOLS",
  aws_appsync_apiKey: "null"
};

const awsmobile_PROD = {
  aws_appsync_graphqlEndpoint:
    "https://l2hfi6ftpvej3ltins3muyefdm.appsync-api.us-east-1.amazonaws.com/graphql",
  aws_appsync_region: "us-east-1",
  aws_appsync_authenticationType: "AMAZON_COGNITO_USER_POOLS",
  aws_appsync_apiKey: "null"
};

export default process.env.NODE_ENV === "development"
  ? awsmobile_DEV
  : awsmobile_PROD;
