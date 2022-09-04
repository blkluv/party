resource "aws_api_gateway_resource" "refund_ticket_resource" {
  rest_api_id = aws_api_gateway_rest_api.PartyBoxAPI.id
  parent_id   = aws_api_gateway_rest_api.MyDemoAPI.root_resource_id
  path_part   = "/tickets/{ticketId}/refund"
}

resource "aws_api_gateway_method" "MyDemoMethod" {
  rest_api_id   = aws_api_gateway_rest_api.PartyBoxAPI.id
  resource_id   = aws_api_gateway_resource.refund_ticket_resource.id
  http_method   = "POST"
  authorization = "NONE"
  authorizer_id = aws_api_gateway_authorizer.CognitoJWTAuthorizer.id
}