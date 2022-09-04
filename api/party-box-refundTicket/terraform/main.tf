

resource "aws_lambda_function" "lambda" {
  image_uri     = format("356466505463.dkr.ecr.us-east-1.amazonaws.com/%s:%s", var.ecr_repository, var.lambda_name)
  function_name = var.lambda_name
  role          = aws_iam_role.lambda_role.arn
  package_type  = "Image"
  memory_size   = 128
  publish       = true
  tags = {
    service = "conor"
  }
  timeout = 30
}
