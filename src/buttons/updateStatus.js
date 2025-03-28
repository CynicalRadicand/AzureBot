const updateStatus = async (interaction) => {
const content = interaction.message.content;
const user = interaction.user.id;
const member = interaction.guild.members.cache.get(user);
const regex = new RegExp(String.raw`${member} Status: (.*?)\n`, "g");

  switch (interaction.customId) {
    case "onhold":
      await interaction.update({
        content: content.replace(regex, `${member} Status: On Hold\n`),  
      });
      break;
    case "inprogress":
      await interaction.update({
        content: content.replace(regex, `${member} Status: In Progress\n`),
      });
      break;
    case "done":
      await interaction.update({
        content: content.replace(regex, `${member} Status: Done\n`),
      });
      break;
    default:
      break;
  }
};

module.exports = { updateStatus };
