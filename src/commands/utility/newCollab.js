const { SlashCommandBuilder, MessageFlags } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('newcollab')
		.setDescription('Start a new collab!')
		.addStringOption(option =>
			option.setName('name')
				.setDescription('The name of the collab')
				.setRequired(true)
		)
		.addNumberOption(option =>
			option.setName('duration')
				.setDescription('The duration of the collab in weeks (default 4)')
		)
		.addUserOption(option =>
			option.setName('member')
				.setDescription('Member to add to the collab')
		),
	async execute(interaction) {
		const name = interaction.options.getString('name');
		const duration = interaction.options.getNumber('duration') || 4;
		const member = interaction.options.getUser('member') || interaction.user;

		var dueDate = new Date()
		dueDate.setDate(dueDate.getDate() + duration * 7);

		await interaction.reply({ content: `The collab ${name} has been created\nDuration: ${duration} week(s), due on ${dueDate}\nWith the following members: ${member}`, flags: MessageFlags.Ephemeral});
	},
};