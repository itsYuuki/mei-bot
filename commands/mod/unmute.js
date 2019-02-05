const Commando = require("discord.js-commando");
const modRole = require("../../assets/json/settings/modrole.json");

module.exports = class unmuteCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: "unmute",
      group: "mod",
      memberName: "unmute",
      description: "Unmutes a member",
      clientPermissions: ["MANAGE_ROLES"],
      args: [{
        key: "member",
        prompt: "Please mention a member to unmute",
        type: "member",
      }]
    });
  }

  run(message, {member}) {
    if (!modRole[message.guild.id]) return message.reply("There are no roles set up for this comamnd to run");
    if (message.member.roles.some(r => modRole[message.guild.id].modroles.includes(r.id)) || message.author.id === message.guild.ownerID) {
      let muteRole = message.guild.roles.find("name", "Muted");
      member.removeRole(muteRole.id);
      return message.reply("Done");
    } else return message.reply("You don't have the permissions to execute this command");
  }
};