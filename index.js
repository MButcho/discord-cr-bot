// Require the necessary discord.js classes
const { Client, Intents, MessageEmbed } = require('discord.js');
const { token } = require('./config.json');
const request = require('request');
const fetch = require('node-fetch');
let loop = false;
const check_mins = 0.1, check_interval = check_mins * 60 * 1000; //This checks every 10 minutes, change 10 to whatever minute you'd like

// Create a new client instance
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES]});

const channel = client.channels.cache.get('920225673887494157'); // MB Test server #general
const channel_cr = client.channels.cache.get('917029748192985139'); // Elastos Discord #🌎┃cyber-republic-dao

// When the client is ready, run this code (only once)
client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
});

// Basic variables
const council = {
  "5b6cff7a3d173c0089ee5acf": "SUNNYFENGHAN",
  "60d094eec05ef80078cf689e": "Donald Bullers",
  "60cf124660cb2c00781146e2": "Elation Studios",
  "60db5e08c05ef80078cfdb85": "Mark Xing",
  "60dcc3b4c05ef80078cfe9b5": "Brittany Kaiser | Own Your Data",
  "60c444e0a9daba0078a58aed": "Ryan | Starfish Labs",
  "60c4826d77d3640078f4ddfe": "Rebecca Zhu",
  "60cff34cc05ef80078cf60e8": "SJun Song",
  "5ee045869e10fd007849e3d2": "The Strawberry Council",
  "5c2f5a15f13d65008969be61": "Zhang Feng",
  "5c738c9a471cb3009422b42e": "Jingyu Niu",
  "5ee0d99f9e10fd007849e53e": "Orchard Trinity",
};

let storedAlerts = {};

// let storedHeight = 0;
// setInterval(async () => {
//   const block = await fetch("https://node1.elaphant.app/api/v1/block/height");
//   const height = (await block.json()).Result;
//   if (height > storedHeight) {
//     storedHeight = height;
//     bot.sendMessage(chatId, `Mainchain block height increased to ${height}`);
//   }
// }, 5000);



client.on('messageCreate', (message) => {
  if(message.content.toLowerCase().includes('fudge') || message.content.toLowerCase().includes('pudding')){
    message.channel.send('Such language is prohibited!');
    
    // inside a command, event listener, etc.
    const embed = new MessageEmbed()
    /*
    * Alternatively, use "#3498DB", [52, 152, 219] or an integer number.
    */
    .setColor(0x5BFFD0)
    .setAuthor({ name: 'Cyber Republic', iconURL: 'https://i.postimg.cc/13q2rng1/cr1.png', url: 'https://cyberrepublic.org' })
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
    
    setInterval(async () => {
      const res = await fetch("https://api.cyberrepublic.org/api/cvote/list_public?voteResult=all");
      const proposalList = await res.json();

      const block = await fetch("https://node1.elaphant.app/api/v1/block/height");
      const height = await block.json();
      
      //console.log('height.Result - ' + height.Result);
      
      const active = proposalList.data.list.filter((item) => {
        //return item.proposedEndsHeight > height.Result && item.status === "PROPOSED";
        return item.proposedEndsHeight < height.Result && item.status === "ACTIVE";
      });
      
      console.log('active.length - ' + active.length);
      
      if (active.length = 0) {
        active.forEach((item) => {
          let support = 0;
          let reject = 0;
          let abstention = 0;
          let undecided = 0;
          let undecideds = [];
          let unchained = [];

          item.voteResult.forEach((vote) => {
            if (vote.value === "support" && vote.status === "chained") support++;
            if (vote.value === "reject" && vote.status === "chained") reject++;
            if (vote.value === "undecided") {
              undecided++;
              undecideds.push(vote.votedBy);
            }
            if (vote.value === "abstention" && vote.status === "chained") abstention++;
            if (vote.value !== "undecided" && vote.status === "unchain") {
              unchained.push(`${council[vote.votedBy]} voted ${vote.value} but did not chain the vote`);
            }
          });

          //let tally = `<u>Current voting status</u>\n&#9989;  Support - <b>${support}</b>\n&#10060;  Reject - <b>${reject}</b>\n&#128280;  Abstain - <b>${abstention}</b>\n&#9888;  Undecided - <b>${undecided}</b>\n\n`;
          let voting_status = `✅  Support - **${support}**\n❌  Reject - **${reject}**\n🔘  Abstain - **${abstention}**\n⚠  Undecided - **${undecided}**\n\u200b`;
          
          //let unchainedList = `<u>Warnings</u>\n`;
          let unchainedList = '';
          if (unchained.length > 0) {
            unchained.forEach((warning) => {
              unchainedList += `${warning}\n`
            });
          }
          //let undecidedList = `<u>Council members who have not yet voted</u>\n`;
          let undecidedList = '';
          //let failedList = `<u>Council members who failed to vote</u>\n`;
          let failedList = '';
          if (undecideds.length === 0) {
            //undecidedList = `<b>&#128526; Everyone voted! Well done!</b>\n`;
            undecidedList = '😎 Everyone voted! Well done!\n';
            //failedList = `<b>&#128526; Everyone voted! Well done!</b>\n`;
            failedList = '😎 Everyone voted! Well done!\n';
          } else {
            undecideds.forEach((member) => {
              //undecidedList += `${council[member]}\n`;
              undecidedList += `${council[member]}\n`;
              //failedList += `${council[member]} &#9785\n`;
              failedList += `${council[member]} ☹\n`;
            });
          }

          let _message = "";
          let description = "";
          let show_unchained = false;
          let show_undecided = false;
          let show_failed = false;
          
          const blocksRemaining = item.proposedEndsHeight - height.Result;
          //console.log("Blocks remaining: " + blocksRemaining);

          if (blocksRemaining > 4990) {
            if (storedAlerts[item._id] === 7) return;
            //_message = `<strong>&#10055; Whoa! A new proposal is now open for voting! &#128064;</strong>\n\n${item.title}\n\n`;
            description = '❇️ Whoa! A new proposal is now open for voting! 👀';
            storedAlerts[item._id] = 7;
          } else if (blocksRemaining < 3600 && blocksRemaining > 3550) {
            if (storedAlerts[item._id] === 5) return;
            //_message = `<strong>&#128076; Reminder! There are <u>5 days</u> remaining to vote on proposal:</strong>\n\n${item.title}\n\n`;
            description = '👌 Reminder! There are *5 days* remaining to vote on proposal';
            storedAlerts[item._id] = 5;
          } else if (blocksRemaining < 2160 && blocksRemaining > 2110) {
            if (storedAlerts[item._id] === 3) return;
            //_message = `<strong>&#128073; Hey you! &#128072; There are <u>3 days</u> remaining to vote on proposal:</strong>\n\n${item.title}\n\n${tally}`;
            description = '👉 Hey you! 👈 There are *3 days* remaining to vote on proposal';
            //if (unchained.length > 0) _message += `${unchainedList}\n`;
            if (unchained.length > 0) show_unchained = true;
            //if (undecidedList.length > 0) _message += `${undecidedList}\n`;
            if (undecidedList.length > 0) show_undecided = true;
            storedAlerts[item._id] = 3;
          } else if (blocksRemaining < 720 && blocksRemaining > 670) {
            if (storedAlerts[item._id] === 1) return;
            //_message = `<strong>&#9888; Warning! &#9888; There is only <u>1 day</u> remaining to vote on proposal:</strong>\n\n${item.title}\n\n${tally}`;
            description = '⚠ Warning! ⚠ There is only *1 day* remaining to vote on proposal';
            //if (unchained.length > 0) _message += `${unchainedList}\n`;
            if (unchained.length > 0) show_unchained = true;
            //if (undecidedList.length > 0) _message += `${undecidedList}\n`;
            if (undecidedList.length > 0) show_undecided = true;
            storedAlerts[item._id] = 1;
          } else if (blocksRemaining < 360 && blocksRemaining > 310) {
            if (storedAlerts[item._id] === 0.5) return;
            //_message = `<strong>&#8252; Alert! &#8252; There are only <u>12 hours</u> remaining to vote on proposal:</strong>\n\n${item.title}\n\n${tally}`;
            description = '‼ Alert! ‼ There are only *12 hours* remaining to vote on proposal';
            //if (unchained.length > 0) _message += `${unchainedList}\n`;
            if (unchained.length > 0) show_unchained = true;
            //if (undecidedList.length > 0) _message += `${undecidedList}\n`;
            if (undecidedList.length > 0) show_undecided = true;
            storedAlerts[item._id] = 0.5;
          } else if (blocksRemaining <= 7) {
            if (storedAlerts[item._id] === 0) return;
            //_message = `<strong>&#9760; The council voting period has elapsed for proposal:</strong>\n\n${item.title}\n\n${tally}`;
            description = '☠ The council voting period has elapsed for proposal';
            //if (unchained.length > 0) _message += `${unchainedList}\n`;
            if (unchained.length > 0) show_unchained = true;
            //if (undecidedList.length > 0) _message += `${failedList}\n`;
            if (undecidedList.length > 0) show_failed = true;
            storedAlerts[item._id] = 0;
          } else {
            return;
          }

          //_message += `<i><a href='https://www.cyberrepublic.org/proposals/${item._id}'>View the full proposal here</a></i>\n\nUse /proposals to fetch real time voting status`;
          //message.channel.send(_message);
          //console.log(_message);
          
          // Send embeded message
          const embed = new MessageEmbed()
          .setColor(0x5BFFD0)
          .setAuthor({ name: 'Cyber Republic DAO', iconURL: 'https://i.postimg.cc/13q2rng1/cr1.png', url: 'https://cyberrepublic.org' })
          .setTitle(item.title)
          .setURL(`https://www.cyberrepublic.org/proposals/${item._id}`)
          //.setDescription(description)
          .addField(description, "\u200b")
          .addField("__Current voting status__", voting_status);
          if (show_unchained) embed.addField("__Warnings__", unchainedList+'\u200b');
          if (show_undecided) embed.addField("__Council members who have not yet voted__", undecidedList+'\u200b');
          if (show_failed) embed.addField("__Council members who failed to vote__", failedList+'\u200b');
          embed.setTimestamp();
          embed.setFooter("Support bot creator with ELA donation to EUSMsck3svNiacva9LfwrLfbvNnUU27z77", "https://i.postimg.cc/Yq1g9cWv/avatar.png");
          
          message.channel.send({ embeds: [embed] });
        });
      } else {
        // Send embeded message
        const embed = new MessageEmbed()
        .setColor(0x5BFFD0)
        .setAuthor({ name: 'Cyber Republic DAO', iconURL: 'https://i.postimg.cc/13q2rng1/cr1.png', url: 'https://cyberrepublic.org' })
        .setTitle('Cyber Republic - Proposals')
        .setURL('https://www.cyberrepublic.org/proposals')
        .addField("There is currently no active proposal", "\u200b")
        embed.setTimestamp();
        embed.setFooter("Support bot creator with ELA donation to EUSMsck3svNiacva9LfwrLfbvNnUU27z77", "https://i.postimg.cc/Yq1g9cWv/avatar.png");
        
        message.channel.send({ embeds: [embed] });
      }
      
    }, check_interval);
    
    /*setInterval(function() {
      //message.channel.send("hello world");
      //Or anything else
    }, check_interval);*/
  } else {
    //console.log('Loop already running');
  }


});


// Login to Discord with your client's token
client.login(token);
