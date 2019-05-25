const Commando = require("discord.js-commando");
const modRole = require("../../assets/json/settings/modrole.json");
const ms = require("ms");

module.exports = class MuteCommand extends Commando.Command {
	constructor(client) {
		super(client, {
			name: "mute",
			group: "mod",
			memberName: "mute",
			description: "Mutes a member",
			clientPermissions: ["MANAGE_ROLES", "MANAGE_CHANNELS"],
			args: [{
				key: "member",
				prompt: "Please mention a member to mute",
				type: "member",
			},
			{
				key: "time",
				prompt: "How long would you like to mute the user for? (Only hours, minutes, or seconds are accepted, no mix of the two or three)",
				type: "string",
				default: "",
			},
			],
		});
	}

	run(message, { member, time }) {
		if (!modRole[message.guild.id]) return message.reply("There are no roles set up for this comamnd to run");
		if (message.member.roles.some(r => modRole[message.guild.id].modroles.includes(r.id)) || message.author.id === message.guild.ownerID) {
			if (!message.guild.roles.find("name", "Muted")) {
				const muteRole = message.guild.createRole({
					name: "Muted",
				});
				member.addRole(muteRole.id);
				message.guild.channels.map((channel) => {
					channel.overwritePermissions(muteRole.id, {
						SEND_MESSAGES: false,
						ADD_REACTIONS: false,
						SPEAK: false,
					});
				});
				if (time) {
					message.reply(`Done. Timeout will end in ${time}`);
					setTimeout(() => {
						member.removeRole(muteRole.id);
						return message.reply(`Tiemout ended, unmuted ${member}`);
					}, ms(time));
				}
				else {return message.reply("Done");}
			}
			else {
				const muteRole = message.guild.roles.find("name", "Muted");
				member.addRole(muteRole.id);
				if (time) {
					setTimeout(() => {
						member.removeRole(muteRole.id);
						return message.reply(`Tiemout ended, unmuted ${member}`);
					}, ms(time));
				}
				else {return message.reply("Done");}
			}
		}
		else {return message.reply("You don't have the permissions to execute this command");}
	}
};