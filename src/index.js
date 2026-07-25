const readline = require("readline");
const runAgent = require("./agent.js");
const { printHelp } = require("./help.js");
const { handleSlashCommand } = require("./commands.js");

const colorRed = "\x1b[31m";
const reset = "\x1b[0m";
const colorBlue = "\x1b[34m";

const conversation = [];

const args = process.argv.slice(2);
const wantsHelp = args.includes("--help") || args.includes("-h");

if (wantsHelp) {
  printHelp();
  process.exit(0);
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.on("SIGINT", () => {
  console.log(`\n${colorBlue}Agent >${reset}`, "Goodbye! (ʘ‿ʘ)╯");
  rl.close();
  process.exit(0);
});

function ask() {
  rl.question(`${colorRed}You >${reset} `, async (input) => {
    const commandResult = handleSlashCommand(input, { conversation });

    if (commandResult.handled) {
      console.log(`${colorBlue}Agent >${reset}`, commandResult.message);
      ask();
      return;
    }

    const res = await runAgent(input, conversation);
    console.log(`${colorBlue}Agent >${reset}`, res);
    ask();
  });
}

ask();
