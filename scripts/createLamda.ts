import fs from "fs";

const [workflowName] = process.argv.slice(2);

if (!workflowName) {
  console.error("Workflow name is required");
  process.exit(1);
}

const workflowFolderPath = "../.github/workflows";
const functionFolderPath = "../api";
const templateWorkflowName = "createEvent";
const templateFunctionName = "createEvent";

const newDevWorkflow = `../.github/workflows/dev-party-box-${workflowName}.yml`;
const newProdWorkflow = `../.github/workflows/prod-party-box-${workflowName}.yml`;

const devWorkflowText = fs.readFileSync(`${workflowFolderPath}/dev-party-box-${templateWorkflowName}.yml`, "utf8");
const prodWorkflowText = fs.readFileSync(`${workflowFolderPath}/prod-party-box-${templateWorkflowName}.yml`, "utf8");

const newDevText = devWorkflowText.replace(new RegExp(`${templateWorkflowName}`, "g"), workflowName);
const newProdText = prodWorkflowText.replace(new RegExp(`${templateWorkflowName}`, "g"), workflowName);

fs.writeFileSync(newDevWorkflow, newDevText);
fs.writeFileSync(newProdWorkflow, newProdText);

fs.mkdirSync(`${functionFolderPath}/party-box-${workflowName}`);

fs.readdirSync(`${functionFolderPath}/party-box-${templateFunctionName}`).forEach((fileName) => {
  const newFilePath = `${functionFolderPath}/party-box-${workflowName}/${fileName}`;
  const oldFilePath = `${functionFolderPath}/party-box-${templateFunctionName}/${fileName}`;

  if (fs.lstatSync(oldFilePath).isDirectory()) return;

  fs.copyFileSync(oldFilePath, newFilePath);
});
