const updateStatus = async (interaction) => {
  const content = interaction.message.content;
  const member = `<@${interaction.user.id}>`;
  const regex = new RegExp(`${member}: (.*?)(\\n|\\*\\*|$)`, "g");

  let newStatus;
  switch (interaction.customId) {
    case "onhold":
      newStatus = "On Hold";
      break;
    case "inprogress":
      newStatus = "In Progress";
      break;
    case "mainsdone":
      newStatus = "Mains Done";
      break;
    case "done":
      newStatus = "Done";
      break;
    default:
      return; // Exit if the customId is not recognized
  }

  // Replace the user's status line in the message content
  const updatedContent = content.replace(regex, `${member}: ${newStatus}$2`);

  await interaction.update({
    content: updatedContent,
  });
};

module.exports = { updateStatus };
