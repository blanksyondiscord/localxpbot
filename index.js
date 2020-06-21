const Discord = require("discord.js");
const random = require("random");
const fs = require("fs");
const jsonfile = require("jsonfile");
const prefix = require("./config.json");
const config = require("./config.json");
 
const bot = new Discord.Client();
 
var stats = {};
if (fs.existsSync("stats.json")) {
  stats = jsonfile.readFileSync("stats.json");
}
 
//bot status
const activities_list = ["Made By Astral", "Made By Blanksy", "twitter.com/BlanksyFN", "twitter.com/astralvz"]; // creates an arraylist containing phrases you want your bot to switch through.
 
bot.on("ready", () => {
  setInterval(() => {
    const index = Math.floor(Math.random() * (activities_list.length - 1) + 1); // generates a random number between 1 and the length of the activities array list (in this case 5).
    bot.user.setActivity(activities_list[index]); // sets bot's activities to one of the phrases in the arraylist.
}, 10000); // Runs this every 10 seconds.
});
 
//xp lines
bot.on("message", message => {
if (message.author.id == bot.user.id) return;
 
if (message.guild.id in stats === false) {
  stats[message.guild.id] = {};
}
 
const guildStats = stats[message.guild.id];
if (message.author.id in guildStats === false) {
  guildStats[message.author.id] = {
    xp: 0,
    level: 0,
    last_message: 0
  };
}
 
const userStats = guildStats[message.author.id];
if (Date.now() - userStats.last_message > 10000) {
  userStats.xp += random.int(15, 25);
  userStats.last_message = Date.now();
 
  const levelEmbed = new Discord.MessageEmbed()
  
  .setTitle("Level Up!")
  .setDescription(message.author.username + " is now level " + userStats.level)
  .setFooter("Created by: Blanksy#0001 and astral#0009")
  .setColor("#ff3c3c")
  .setTimestamp();


 
  const xpToNextLevel =
    5 * Math.pow(userStats.level, 2) + 50 * userStats.level + 100;
  if (userStats.xp >= xpToNextLevel) {
    userStats.level++;
    userStats.xp = userStats.xp - xpToNextLevel;
    message.channel.send(levelEmbed);
  }
 
  jsonfile.writeFileSync("stats.json", stats);
 
  console.log(message.author.username + " now has " + userStats.xp + "XP!");
  console.log(xpToNextLevel + " XP Needed For The Next Level! ");
}

//embeds
const rankEmbed = new Discord.MessageEmbed()
.setTitle (message.member.user.tag)
.addFields(
  { name: 'Level', value: userStats.level, inline: true },
  { name: 'XP', value: userStats.xp, inline: false },
)
.setFooter("Created by: Blanksy#0001 and astral#0009")
.setColor("#ff3c3c")
.setTimestamp()
 
const xpEmbed = new Discord.MessageEmbed()
.setTitle(message.member.user.tag)
.addFields(
  { name: 'XP', value: userStats.xp, inline: true },
)
.setFooter("Created by: Blanksy#0001 and astral#0009")
.setColor("#ff3c3c")
.setTimestamp();

const parts = message.content.split(" ");
 
if (message.content === "*xp") {
  message.channel.send(xpEmbed);
}
 
 
bot.on('message', message => {



 if (message.content === '*rank') {
   message.channel.send(rankEmbed);
 }

})

});

bot.on("message", message => {


  if (message.content === "*commands") {
    message.channel.send("**Commands** \n\n **rank:** Shows your current level in a fancy embed :sparkles: \n\n **xp:** Shows your current level in a fancy embed :sparkles: \n\n *The prefix is **")
  }
})
 
bot.login(config.token);