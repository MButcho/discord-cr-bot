// Require the necessary discord.js classes
const { Client, Intents, MessageEmbed } = require('discord.js');
const { token } = require('./config.json');
var loop = false;
const checkminutes = 0.1, checkthe_interval = checkminutes * 60 * 1000; //This checks every 10 minutes, change 10 to whatever minute you'd like

// Create a new client instance
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES]});

const channel = client.channels.cache.get('920225673887494157');

// When the client is ready, run this code (only once)
client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on('messageCreate', (message) => {
  if(message.content.toLowerCase().includes('fudge') || message.content.toLowerCase().includes('pudding')){
    message.channel.send('Such language is prohibited!');
    // inside a command, event listener, etc.
    const embed = new MessageEmbed()
    /*
    * Alternatively, use "#3498DB", [52, 152, 219] or an integer number.
    */
    .setColor(0x3498DB)
    .setAuthor("Author Name, it can hold 256 characters", "https://i.imgur.com/lm8s41J.png")
    .setTitle("This is your title, it can hold 256 characters")
    .setURL("https://discord.js.org/#/docs/main/stable/class/MessageEmbed")
    .setDescription("This is the main body of text, it can hold 4096 characters.")
    .setImage("http://i.imgur.com/yVpymuV.png")
    .setThumbnail("http://i.imgur.com/p2qNFag.png")
    .addField("This is a single field title, it can hold 256 characters", "This is a field value, it can hold 1024 characters.")
    /*
     * Inline fields may not display as inline if the thumbnail and/or image is too big.
    */
    .addFields(
      { name: "Inline fields", value: "They can have different fields with small headlines, and you can inline them.", inline: true },
      { name: "Masked links", value: "You can put [masked links](https://discord.js.org/#/docs/main/master/class/MessageEmbed) inside of rich embeds.", inline: true },
      { name: "Markdown", value: "You can put all the *usual* **__Markdown__** inside of them.", inline: true }
    )
    /*
     * Blank field, useful to create some space.
    */
    .addField("\u200b", "\u200b")
    /*
    * Takes a Date object, defaults to current date.
    */
    .setTimestamp()
    .setFooter("This is the footer text, it can hold 2048 characters", "http://i.imgur.com/w1vhFSR.png");
    /*
    * With Discord now allowing messages to contain up to 10 embeds, we need to put it in an array.
    */
    message.channel.send({ embeds: [embed] });
  }
  if (loop === false) {
    loop = true;
    setInterval(function() {
      message.channel.send("hello world");
      //Or anything else
    }, checkthe_interval);
  } else {
    //console.log('Loop already running');
  }


});

// Login to Discord with your client's token
client.login(token);
