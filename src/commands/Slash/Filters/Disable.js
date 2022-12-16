const { EmbedBuilder } = require("discord.js");
const delay = require("delay");

module.exports = {
	name: "disable",
	description: "Clear the current player filters.",
	category: "Filters",
	permissions: {
		bot: [],
		user: [],
	},
	settings: {
		inVc: true,
		sameVc: true,
		player: true,
		current: true,
		owner: false,
	},
	run: async (client, interaction) => {
		await interaction.deferReply({ ephemeral: true });

		const player = client.poru.players.get(interaction.guild.id);

		await player.filters.clearFilters();
		await player.setVolume(1.0);

		const embed = new EmbedBuilder().setDescription(`\`☑️\` | Filters has been: \`Cleared\``).setColor(client.color);

		await delay(2000);
		return interaction.editReply({ embeds: [embed] });
	},
};
