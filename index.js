
const Discord = require("discord.js");
const random = require("random");
const fs = require("fs");
const jsonfile = require("jsonfile");
const prefix = require("./config.json");
const config = require("./config.json");
 
//saves data in stats.json
const bot = new Discord.Client();
 
var stats = {};
if (fs.existsSync("stats.json")) {
  stats = jsonfile.readFileSync("stats.json");
}
 
//bot status
const activities_list = ["status", "status", "status"]; // creates an arraylist containing phrases you want your bot to switch through.
 
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
 
   const levelEmbed = new Discord.RichEmbed.setTitle(
     `${message.member.username}`
   ).setDescription(
     `<@${message.author.id}>` + " is now level " + userStats.level
   );
 
   const xpToNextLevel =
     5 * Math.pow(userStats.level, 2) + 50 * userStats.level + 100;
   if (userStats.xp >= xpToNextLevel) {
     userStats.level++;
     userStats.xp = userStats.xp - xpToNextLevel;
     message.channel.send(levelEmbed);
   }
 
   jsonfile.writeFileSync("stats.json", stats);
 
   console.log(message.author.username + " now has " + userStats.xp + "XP!");
   console.log(xpToNextLevel + " More Xp Untill The Next Level ");
 }
 //embeds
 const rankEmbed = new Discord.RichEmbed.setTitle(
   `${message.member.username}`
 ).setDescription("Your current level is: " + userStats.level);
 
 const xpEmbed = new Discord.RichEmbed.setTitle(
   `${message.member.username}`
 ).setDescription("You Have " + userStats.xp + "XP!");
 
 const parts = message.content.split(" ");
 
 if (message.content.startsWith(prefix + "xp")) {
   message.channel.send(xpEmbed);
 }
 
 if (message.content.startsWith(prefix + "rank")) {
   message.channel.send(rankEmbed);
 }
});
 
bot.login(config.token);
