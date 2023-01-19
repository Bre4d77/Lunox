const { EmbedBuilder } = require("discord.js");
const moment = require("moment");
const User = require("../../../settings/models/User.js");

module.exports = {
    name: "profile",
    description: "Show you profile info.",
    category: "Information",
    permissions: {
        bot: [],
        channel: [],
        user: [],
    },
    settings: {
        inVc: false,
        sameVc: false,
        player: false,
        current: false,
        owner: false,
        premium: false,
    },
    run: async (client, interaction) => {
        await interaction.deferReply({ ephemeral: true });

        const user = await User.findOne({ Id: interaction.user.id });
        const timeLeft = moment(user.premium.expiresAt).format("dddd, MMMM Do YYYY HH:mm:ss");

        const embed = new EmbedBuilder()
            .setAuthor({
                name: `${interaction.user.tag} Premium Details`,
                iconURL: client.user.displayAvatarURL({ dynamic: true }),
            })
            .setColor(client.color)
            .setDescription(`Here are the details about your premium status of ${client.user}.`)
            .setThumbnail(interaction.user.displayAvatarURL())
            .setFooter({ text: "Thank You" })
            .setTimestamp();

        if (user.premium.plan === "lifetime") {
            embed.addFields([
                { name: `\`💠\` • Plan:`, value: `\`\`\`${toOppositeCase(user.premium.plan)}\`\`\``, inline: true },
                { name: `\`🕓\` • Expired:`, value: `\`\`\`Never\`\`\``, inline: true },
                { name: `\`💎\` • Features:`, value: `\`\`\`Unlocked\`\`\``, inline: true },
            ]);
        } else {
            embed.addFields([
                { name: `\`💠\` • Plan:`, value: `\`\`\`${toOppositeCase(user.premium.plan || "Free")}\`\`\``, inline: true },
            ]);

            if (user.premium.expiresAt < Date.now()) {
                embed.addFields([
                    { name: `\`🕓\` • Expired:`, value: `\`\`\`Never\`\`\``, inline: true },
                    { name: `\`💎\` • Features:`, value: `\`\`\`Locked\`\`\``, inline: true },
                ]);
            } else {
                embed.addFields([
                    { name: `\`🕓\` • Expired:`, value: `\`\`\`${timeLeft}\`\`\``, inline: true },
                    { name: `\`💎\` • Features:`, value: `\`\`\`Unlocked\`\`\``, inline: true },
                ]);
            }
        }

        return interaction.editReply({ embeds: [embed] });
    },
};

function toOppositeCase(char) {
    return char.charAt(0).toUpperCase() + char.slice(1);
}
