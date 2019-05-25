const Commando = require("discord.js-commando");
const stripIndents = require("common-tags").stripIndents;
const modRole = require("../../assets/json/settings/modrole.json");

module.exports = class WarnCommand extends Commando.Command {
	constructor(client) {
		super(client, {
			name: "warn",
			group: "mod",
			memberName: "warn",
			description: "Warns a member",
			args: [{
				key: "member",
				prompt: "Please mention a member to warn",
				type: "member",
			},
			{
				key: "warningMsg",
				prompt: "Please enter a warning message.",
				type: "string",
			},
			],
		});
	}

	run(message, { member, warningMsg }) {
		if (!modRole[message.guild.id]) return message.reply("There are no roles set up for this comamnd to run");
		if (message.member.roles.some(r => modRole[message.guild.id].modroles.includes(r.id)) || message.author.id === message.guild.ownerID) {
			member.send(stripIndents `
      You have been warned in the server: ${message.guild.name}!
      By: "${message.author.tag}" 
      "Reason: "${warningMsg}"
      `);
			return message.say("Done");
		}
		else {
			return message.reply("You don't have the permissions to execute this command");
		}
	}
};