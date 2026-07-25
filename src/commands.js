const commands = {
  clear: {
    description: "Clear conversation history",
    run: ({ conversation }) => {
      conversation.length = 0;
      return "Conversation history cleared.";
    },
  },
};

/* 
In current implementation, runCommand supports simple slash commands with this format:
/commandName optionalArg1 optionalArg2 
No quoted argument parsing
*/
function handleSlashCommand(input, context) {
  const text = input.trim();

  if (!text.startsWith("/")) {
    return { handled: false };
  }

  const [rawName, ...args] = text.slice(1).split(/\s+/);
  const name = (rawName || "").toLowerCase();
  const command = commands[name];

  if (!command) {
    return {
      handled: true,
      message: `Unknown command "/${name}". Available: ${Object.keys(commands)
        .map((c) => "/" + c)
        .join(", ")}`,
    };
  }

  const message = command.run({ ...context, args });
  return { handled: true, message };
}

module.exports = { handleSlashCommand, commands };