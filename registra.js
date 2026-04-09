const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
require('dotenv').config();

module.exports = {
	data: new SlashCommandBuilder()
		.setName('registra')
		.setDescription('Registra un ban su Verona RP')
		.addStringOption(opt => opt.setName('nome_player').setDescription('Nome player').setRequired(true))
		.addStringOption(opt => opt.setName('motivazione').setDescription('Motivo').setRequired(true))
		.addStringOption(opt => opt.setName('provvedimento').setDescription('Es: Ban, Blacklist').setRequired(true))
		.addStringOption(opt => opt.setName('durata').setDescription('Es: 7 giorni, Permanente').setRequired(true)), // Durata ripristinata

	async execute(interaction) {
		const RUOLI_STAFF = ['1484820657836396575', '1490420818797134055'];
		
		if (!interaction.member.roles.cache.some(r => RUOLI_STAFF.includes(r.id))) {
			return interaction.reply({ content: "❌ Non hai i permessi staff per Verona RP.", ephemeral: true });
		}

		const player = interaction.options.getString('nome_player');
		const motivo = interaction.options.getString('motivazione');
		const provv = interaction.options.getString('provvedimento');
		const durata = interaction.options.getString('durata');

		const embed = new EmbedBuilder()
			.setTitle('Verona RP | Moderation Bot')
			.setColor(0x0055ff)
			.setThumbnail(`https://www.roblox.com/headshot-thumbnail/image?width=420&height=420&format=png&username=${player}`)
			.addFields(
				{ name: '👤 | Nome Player', value: `\`\`\`${player}\`\`\`` },
				{ name: '📋 | Motivazione', value: `\`\`\`${motivo}\`\`\`` },
				{ name: '🔨 | Provvedimento', value: `\`\`\`${provv}\`\`\`` },
				{ name: '⏳ | Durata', value: `\`\`\`${durata}\`\`\`` },
				{ name: '🛠️ | Effettuato da', value: `${interaction.user}` }
			)
			.setTimestamp()
			.setFooter({ text: 'vrp | sanzione registrata' });

		const canale = interaction.guild.channels.cache.get(process.env.CANALE_REGISTRA_ID);
		if (canale) {
			await canale.send({ embeds: [embed] });
			await interaction.reply({ content: '✅ Sanzione registrata!', ephemeral: true });
		} else {
			await interaction.reply({ content: '❌ Errore: ID Canale registra non configurato correttamente nel .env', ephemeral: true });
		}
	},
};