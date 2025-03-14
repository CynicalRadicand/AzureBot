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
		.addStringOption(option =>
			option.setName('members')
				.setDescription('Member to add to the collab')
		),
	async execute(interaction) {
		const name = interaction.options.getString('name');
		const duration = interaction.options.getNumber('duration') || 4;
		var members = [];

		//calculate due date time stamp
		var dueDate = new Date()
		dueDate.setDate(dueDate.getDate() + duration * 7);
		const timeStamp = Math.floor(dueDate.getTime() / 1000)

		const users = interaction.options.getString('members').split(' ');

		//extract member id from mention
		users.forEach(resolvable => {
    		const memberId = resolvable.match(/\d+/)?.[0];
			const member = interaction.guild.members.cache.get(memberId);
			members.push(member);
    		if(!member) return;
		})


		await interaction.reply({ content: `The collab ${name} has been created\nDuration: ${duration} week(s), due <t:${timeStamp}:R>\nWith the following members: ${members}`, flags: MessageFlags.Ephemeral});
	},
};