const {
  SlashCommandBuilder,
  MessageFlags,
  ChannelType,
  ThreadAutoArchiveDuration,
  ButtonBuilder,
  ActionRowBuilder,
  ButtonStyle,
  ComponentType,
  Component,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("newcollab")
    .setDescription("Start a new collab!")
    .addStringOption((option) =>
      option
        .setName("name")
        .setDescription("The name of the collab")
        .setRequired(true)
    )
    .addNumberOption((option) =>
      option
        .setName("duration")
        .setDescription("The duration of the collab in weeks (default 4)")
    )
    .addStringOption((option) =>
      option.setName("members").setDescription("Member to add to the collab")
    ),
  async execute(interaction) {
    await interaction.deferReply({ flags: MessageFlags.Ephemeral });

    const name = interaction.options.getString("name");
    const duration = interaction.options.getNumber("duration") || 4;
    var members = [];

    //calculate due date time stamp
    var dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + duration * 7);
    const timeStamp = Math.floor(dueDate.getTime() / 1000);

    //extract member id from mention
    const users = interaction.options.getString("members").split(" ");
    users.forEach((resolvable) => {
      const memberId = resolvable.match(/\d+/)?.[0];
      const member = interaction.guild.members.cache.get(memberId);
      members.push(member);
      if (!member) return;
    });

    //create thread
    const thread = await interaction.channel.threads.create({
      name: name,
      autoArchiveDuration: ThreadAutoArchiveDuration.OneWeek,
      reason: `due <t:${timeStamp}:R>`,
      type: ChannelType.PrivateThread,
    });

    // //add members to thread
    await Promise.all(members.map((member) => thread.members.add(member)));

    //build buttons
    const onHold = new ButtonBuilder()
      .setCustomId("onhold")
      .setLabel("On Hold")
      .setStyle(ButtonStyle.Danger);

    const inProgress = new ButtonBuilder()
      .setCustomId("inprogress")
      .setLabel("In Progress")
      .setStyle(ButtonStyle.Secondary);

    const mainsDone = new ButtonBuilder()
      .setCustomId("mainsdone")
      .setLabel("Mains Done")
      .setStyle(ButtonStyle.Primary);

    const done = new ButtonBuilder()
      .setCustomId("done")
      .setLabel("Done")
      .setStyle(ButtonStyle.Success);

    const row = new ActionRowBuilder().addComponents(
      onHold,
      inProgress,
      mainsDone,
      done
    );

    //pin member status and due date
    const pinMsg = await thread.send({
      content:
        `***Due <t:${timeStamp}:R>***\n` +
        "**" +
        members.join(`: Not Started\n`) +
        `: Not Started**`,
      components: [row],
    });

    pinMsg.pin();

    await interaction.editReply({
      content: `The collab ${name} has been created successfully\nDuration: ${duration} week(s), due <t:${timeStamp}:R>\nWith the following members: ${members}`,
      flags: MessageFlags.Ephemeral,
    });
  },
};
