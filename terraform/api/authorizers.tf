resource "aws_api_gateway_authorizer" "CognitoJWTAuthorizer" {
  name          = "CognitoJWTAuthorizer"
  type          = "COGNITO_USER_POOLS"
  rest_api_id   = aws_api_gateway_rest_api.PartyBoxAPI.id
  provider_arns = data.aws_cognito_user_pools.this.arns
}