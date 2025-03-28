const updateStatus = async (interaction) => {
  switch (interaction.customId) {
    case "onhold":
      await interaction.update({
        content: "Status updated to On Hold",
      });
      break;
    case "inprogress":
      await interaction.update({
        content: "Status updated to In Progress",
      });
      break;
    case "done":
      await interaction.update({
        content: "Status updated to Done",
      });
      break;
    default:
      break;
  }
};

module.exports = { updateStatus };
