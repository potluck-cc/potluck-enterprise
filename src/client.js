import AWSAppSyncClient from "aws-appsync";
import aws_config from "./appsync-config";
import { Auth } from "aws-amplify";

export default new AWSAppSyncClient({
  url: aws_config.aws_appsync_graphqlEndpoint,
  region: aws_config.aws_appsync_region,
  disableOffline: true,
  auth: {
    type: "AMAZON_COGNITO_USER_POOLS",
    jwtToken: async () =>
      (await Auth.currentSession()).getIdToken().getJwtToken()
  }
});
