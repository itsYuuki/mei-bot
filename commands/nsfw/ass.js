const Commando = require("discord.js-commando");
const { RichEmbed } = require("discord.js");
const Danbooru = require("danbooru");

module.exports = class AssCommand extends Commando.Command {
  constructor (client) {
    super (client,{
      name:"ass",
      group:"nsfw",
      memberName:"ass",
      description:"Posts a random ass hentai image from Danbooru",
    });
  }

  run (message, callback) {
    const db = new Danbooru();

    db.posts({tags: "butt_crack from_behind"}).then(posts => {
      const index = Math.floor(Math.random() * posts.length);
      const post = posts[index];
      const url = db.url(post.file_url);

      const embed = new RichEmbed();
      embed.addField("Source", `${url}`);
      embed.setImage(`${url}`);
      return message.embed(embed).then(callback);
    });
  }
};