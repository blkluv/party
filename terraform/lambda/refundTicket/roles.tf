resource "aws_iam_role" "lambda_role" {
  name = format("%s-role", var.lambda_name)

  assume_role_policy = jsonencode(
    {
      "Version" : "2012-10-17",
      "Statement" : [
        {
          "Action" : "sts:AssumeRole",
          "Principal" : {
            "Service" : "lambda.amazonaws.com"
          },
          "Effect" : "Allow",
          "Sid" : ""
        }
      ]
  })
}

resource "aws_iam_role_policy_attachment" "attach_lambda_basic_execution_role" {
  role       = aws_iam_role.lambda_role.name
  policy_arn = data.aws_iam_policy.AWSLambdaBasicExecutionRole.arn
}

data "aws_iam_policy" "AWSLambdaBasicExecutionRole" {
  arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}


# The policy that allows this function to read from Secrets Manager
resource "aws_iam_role_policy_attachment" "attach_lambda_secrets_read_policy" {
  role       = aws_iam_role.lambda_role.name
  policy_arn = data.aws_iam_policy.SecretsManagerRead.arn
}

data "aws_iam_policy" "SecretsManagerRead" {
  arn = "arn:aws:iam::356466505463:policy/SecretsManagerReadAccess"
}



