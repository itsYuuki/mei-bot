const Commando = require("discord.js-commando");
const modRole = require("../../assets/json/modrole.json");
const fs = require("fs");

module.exports = class ModRoleCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: "modrole",
      group: "mod",
      memberName: "modrole",
      description: "Adds/Removes a role for mod commands. (Can only be used by the server owner)",
      args: [{
        key: "action",
        prompt: "What action would you like to perform? `add` or `remove`",
        type: "string"
      },
      {
        key: "role",
        prompt: "Please enter a role name. (Make sure the role is mentionable for this command to work)",
        type: "role"
      }
      ]
    });
  }

  run(message, args) {
    // adds a mod role
    if (message.author.id !== message.guild.ownerID) return message.reply("You don't have the permission to execute this command");
    if (args.action.toLowerCase() === "add") {
      if (!message.guild.member(message.author).hasPermission("MANAGE_ROLES", false, true, true)) {
        return message.reply("You do not have permission to execute this Command");
      }
      if (!modRole[message.guild.id]) {
        modRole[message.guild.id] = {
          modroles: []
        };
      }
      let id = args.role.id;
      if (modRole[message.guild.id].modroles.includes(id)) {
        return message.reply("The mod role has already been added.");
      } else {
        modRole[message.guild.id].modroles.push(id);
        fs.writeFile("./assets/json/modrole.json", JSON.stringify(modRole, null, 2), (err) => {
          if (err) {
            message.reply("Something went wrong! Contact Eris#6753");
            return console.log(err);
          }
          return message.reply("Mod role added.");
        });
      }
    }

    // removes a mod role
    if (args.action.toLowerCase() === "remove") {
      let roleIndex = modRole[message.guild.id].modroles.indexOf(args.role);

      if (!message.guild.member(message.author).hasPermission("MANAGE_ROLES", false, true, true)) {
        return message.reply("You don't have permissions to execute this command.");
      }
      if (roleIndex === null) {
        return message.reply("Role not found. Perhaps you misspelled it or you didn't list it in");
      }
      modRole[message.guild.id].modroles.splice(roleIndex, 1);
      fs.writeFile("./assets/json/modrole.json", JSON.stringify(modRole, null, 2), (err) => {
        if (err) {
          message.reply("Something went wrong! Contact Eris#6753");
          return console.log(err);
        }
        return message.reply("Mod role removed.");
      });
    }
  }
};