import fs from "fs";
import { LambdaClient, CreateFunctionCommand } from "@aws-sdk/client-lambda";
import consola from "consola";
import ora from "ora";
import { exit } from "process";

const lambda = new LambdaClient({});

const [workflowName] = process.argv.slice(2);

if (!workflowName) {
  console.error("Workflow name is required");
  exit(1);
}

const workflowFolderPath = "../.github/workflows";
const functionFolderPath = "../api";
const templateWorkflowName = "createEvent";
const templateFunctionName = "createEvent";

const newDevWorkflow = `../.github/workflows/dev-party-box-${workflowName}.yml`;
const newProdWorkflow = `../.github/workflows/prod-party-box-${workflowName}.yml`;

const devWorkflowText = fs.readFileSync(`${workflowFolderPath}/dev-party-box-${templateWorkflowName}.yml`, "utf8");
const prodWorkflowText = fs.readFileSync(`${workflowFolderPath}/prod-party-box-${templateWorkflowName}.yml`, "utf8");

consola.success("Existing workflows read");

const newDevText = devWorkflowText.replace(new RegExp(`${templateWorkflowName}`, "g"), workflowName);
const newProdText = prodWorkflowText.replace(new RegExp(`${templateWorkflowName}`, "g"), workflowName);

fs.writeFileSync(newDevWorkflow, newDevText);
fs.writeFileSync(newProdWorkflow, newProdText);

consola.success("New workflows created");

fs.mkdirSync(`${functionFolderPath}/party-box-${workflowName}`);
consola.success("New API folder created");

fs.readdirSync(`${functionFolderPath}/party-box-${templateFunctionName}`).forEach((fileName) => {
  const newFilePath = `${functionFolderPath}/party-box-${workflowName}/${fileName}`;
  const oldFilePath = `${functionFolderPath}/party-box-${templateFunctionName}/${fileName}`;

  if (fs.lstatSync(oldFilePath).isDirectory()) return;

  fs.copyFileSync(oldFilePath, newFilePath);
});

consola.success("Files copied to new folder");

exit();

(async () => {
  const spinner = ora("Creating Lambda function").start();
  const createFunctionCommand = new CreateFunctionCommand({
    Code: {
      ImageUri: "public.ecr.aws/lambda/nodejs:12.2022.08.22.13",
    },
    FunctionName: `party-box-${workflowName}`,
    Role: "",
  });
  spinner.stop();

  await lambda.send(createFunctionCommand);
})();
