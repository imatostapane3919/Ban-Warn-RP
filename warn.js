const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('warn')
		.setDescription('Invia un warn su Verona RP')
		.addStringOption(opt => opt.setName('nome_player').setDescription('Nome player').setRequired(true))
		.addStringOption(opt => opt.setName('motivazione').setDescription('Motivo').setRequired(true)),

	async execute(interaction) {
		const RUOLI_STAFF = ['1484820657836396575', '1490420818797134055'];
		const CANALE_WARN_ID = 'IL_TUO_ID_CANALE_WARN';

		if (!interaction.member.roles.cache.some(r => RUOLI_STAFF.includes(r.id))) {
			return interaction.reply({ content: "❌ Non sei Staff!", ephemeral: true });
		}

		const player = interaction.options.getString('nome_player');
		const motivo = interaction.options.getString('motivazione');

		const embed = new EmbedBuilder()
			.setTitle('Verona RP | Moderation Bot')
			.setColor(0xffff00)
			.setThumbnail(`https://www.roblox.com/headshot-thumbnail/image?width=420&height=420&format=png&username=${player}`)
			.addFields(
				{ name: '👤 | Nome Player', value: `\`\`\`${player}\`\`\`` },
				{ name: '📄 | Motivazione', value: `\`\`\`${motivo}\`\`\`` },
				{ name: '🔨 | Provvedimento', value: `\`\`\`warn + kick\`\`\`` },
				{ name: '🛠️ | Effettuato da', value: `${interaction.user}` }
			)
			.setTimestamp();

		const canale = interaction.guild.channels.cache.get(CANALE_WARN_ID);
		await canale.send({ embeds: [embed] });
		await interaction.reply({ content: '✅ Warn inviato!', ephemeral: true });
	},
};