const {
  SlashCommandBuilder,
  MessageFlags,
  ChannelType,
  ThreadAutoArchiveDuration,
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
	await interaction.deferReply({ Flags: MessageFlags.Ephemeral });

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

    //add members to thread
    //create thread
    const thread = await interaction.channel.threads.create({
      name: name,
      autoArchiveDuration: ThreadAutoArchiveDuration.OneWeek,
      reason: `due <t:${timeStamp}:R>`,
      type: ChannelType.PrivateThread,
    });

    //add members to thread
    await Promise.all(members.map((member) => thread.members.add(member)));

	//pind members and due date
    const webhooks = await interaction.channel.fetchWebhooks();
    const webhook = webhooks.first();

    if (!webhook) {
      webhook = await interaction.channel.createWebhook({
        name: "Collab Webhook",
        avatar: "https://i.imgur.com/AfFp7pu.png", // Example avatar URL
      });
    }

    const pinMsg = await webhook.send({
      content: members.join(" ") + `\nDue <t:${timeStamp}:R>`,
      threadId: thread.id,
    });


    pinMsg.pin();

    await interaction.editReply({
      content: `The collab ${name} has been created successfully\nDuration: ${duration} week(s), due <t:${timeStamp}:R>\nWith the following members: ${members}`,
      flags: MessageFlags.Ephemeral,
    });
  },
};
