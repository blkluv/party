import * as fs from "fs";
import { LambdaClient, CreateFunctionCommand, CreateAliasCommand } from "@aws-sdk/client-lambda";
import consola from "consola";
import { exit } from "process";
import {
  AttachRolePolicyCommand,
  CreateRoleCommand,
  CreateServiceLinkedRoleCommand,
  IAMClient,
} from "@aws-sdk/client-iam";
import { randomBytes } from "crypto";

(async () => {
  const iam = new IAMClient({});
  const lambda = new LambdaClient({});

  const [dashedWorkflowName] = process.argv.slice(2);

  if (!dashedWorkflowName) {
    console.error("Workspace name is required");
    exit(1);
  }

  const toCamelCase = (str: string) => {
    const [first, ...rest] = str.split("-");
    return [first, ...rest.map((s) => s.charAt(0).toUpperCase() + s.slice(1))].join("");
  };

  const camelCaseWorkflowName = toCamelCase(dashedWorkflowName);

  const workflowFolderPath = "../.github/workflows";
  const functionFolderPath = "../api";
  const templateWorkspaceName = "create-event";
  const templateWorkflowName = toCamelCase(templateWorkspaceName);
  const templateFunctionName = toCamelCase(templateWorkspaceName);

  const newDevWorkflow = `../.github/workflows/dev-party-box-${camelCaseWorkflowName}.yml`;
  const newProdWorkflow = `../.github/workflows/prod-party-box-${camelCaseWorkflowName}.yml`;

  const devWorkflowText = fs.readFileSync(`${workflowFolderPath}/dev-party-box-${templateWorkflowName}.yml`, "utf8");
  const prodWorkflowText = fs.readFileSync(`${workflowFolderPath}/prod-party-box-${templateWorkflowName}.yml`, "utf8");

  consola.success("Existing workflows read");

  const newDevText = devWorkflowText.replace(new RegExp(`${templateWorkflowName}`, "g"), camelCaseWorkflowName);
  const newProdText = prodWorkflowText.replace(new RegExp(`${templateWorkflowName}`, "g"), camelCaseWorkflowName);

  fs.writeFileSync(newDevWorkflow, newDevText);
  fs.writeFileSync(newProdWorkflow, newProdText);

  consola.success("New workflows created");

  fs.mkdirSync(`${functionFolderPath}/party-box-${camelCaseWorkflowName}`);
  consola.success("New API folder created");

  fs.readdirSync(`${functionFolderPath}/party-box-${templateFunctionName}`).forEach((fileName) => {
    const newFilePath = `${functionFolderPath}/party-box-${camelCaseWorkflowName}/${fileName}`;
    const oldFilePath = `${functionFolderPath}/party-box-${templateFunctionName}/${fileName}`;

    if (fs.lstatSync(oldFilePath).isDirectory()) return;

    fs.copyFileSync(oldFilePath, newFilePath);
  });

  consola.success("Files copied to new folder");

  return;

  consola.info("Creating IAM role");

  const newRoleName = `party-box-${camelCaseWorkflowName}-${randomBytes(8).toString("hex").slice(0, 8)}`;

  const createRoleCommand = new CreateServiceLinkedRoleCommand({
    AWSServiceName: "lambda.amazonaws.com",
  });

  // AssumeRolePolicyDocument: JSON.stringify({
  //   Version: "2012-10-17",
  //   Statement: [
  //     {
  //       Effect: "Allow",
  //       Principal: {
  //         Service: "lambda.amazonaws.com",
  //       },
  //       Action: "sts:AssumeRole",
  //     },
  //   ],
  // }),
  const createRoleOutput = await iam.send(createRoleCommand);
  if (!createRoleOutput?.Role?.Arn) throw new Error("Role creation failed");
  console.log(createRoleOutput);
  await iam.send(
    new AttachRolePolicyCommand({
      RoleName: newRoleName,
      PolicyArn: "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole",
    })
  );

  consola.success("Created IAM role");

  const newFunctionName = `party-box-${camelCaseWorkflowName}`;

  consola.info("Creating Lambda function");
  const createFunctionCommand = new CreateFunctionCommand({
    Code: {
      ImageUri: "356466505463.dkr.ecr.us-east-1.amazonaws.com/conorroberts:party-box-createEvent",
    },
    PackageType: "Image",
    FunctionName: newFunctionName,
    Role: createRoleOutput?.Role?.Arn,
  });

  await lambda.send(createFunctionCommand);

  consola.success("Created Lambda function");

  consola.info("Creating Lambda alias");

  // Create Lambda function aliases
  for (const alias of ["dev", "prod"]) {
    const createAliasCommand = new CreateAliasCommand({
      FunctionName: newFunctionName,
      FunctionVersion: "$LATEST",
      Name: alias,
    });

    await lambda.send(createAliasCommand);
  }

  consola.success("Created Lambda aliases");
})();
