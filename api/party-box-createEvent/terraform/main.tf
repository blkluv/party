terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.29.0"
    }
  }
}

provider "aws" {
  region = "us-east-1"
}

resource "aws_lambda_function" "lambda" {
  image_uri     = format("356466505463.dkr.ecr.us-east-1.amazonaws.com/%s:%s", var.ecr_repository, var.lambda_name)
  function_name = var.lambda_name
  role          = aws_iam_role.lambda_role.arn
  package_type  = "Image"
  memory_size   = 128
  publish       = true
  tags = {
    service = "party-box"
  }
  timeout = 30
}

resource "aws_lambda_alias" "dev_lambda_alias" {
  name             = "dev"
  description      = "dev"
  function_name    = aws_lambda_function.lambda.arn
  function_version = "$LATEST"
}

resource "aws_lambda_alias" "prod_lambda_alias" {
  name             = "prod"
  description      = "prod"
  function_name    = aws_lambda_function.lambda.arn
  function_version = "$LATEST"
}
