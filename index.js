// Require the necessary discord.js classes
const { Client, Intents, MessageEmbed, TextChannel } = require('discord.js');
const { token } = require('./config.json');
const request = require('request');
const fetch = require('node-fetch');
let loop = false;
const check_mins = 10, check_interval = check_mins * 60 * 1000; //This checks every 10 minutes, change 10 to whatever minute you'd like

// Create a new client instance
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES]});

const channel_id = '920225673887494157'; // MB Test server #general
//const channel_id = '917029748192985139'; // Elastos Discord #🌎┃cyber-republic-dao

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

const footer_text = 'Support bot creator with ELA donation to EUSMsck3svNiacva9LfwrLfbvNnUU27z77';
const footer_img = 'https://i.postimg.cc/Yq1g9cWv/avatar.png';

// When the client is ready, run this code (only once)
client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
  client.channels.cache.get(channel_id).send('I am up and running!');
  //channel.send('Such language is prohibited!');
});

client.on('messageCreate', async (message) => {
  // get date&time in nice format
  var d = new Date();
  d = new Date(d.getTime() - 3000000);
  var date_now = d.getFullYear().toString()+"-"+((d.getMonth()+1).toString().length==2?(d.getMonth()+1).toString():"0"+(d.getMonth()+1).toString())+"-"+(d.getDate().toString().length==2?d.getDate().toString():"0"+d.getDate().toString())+" "+(d.getHours().toString().length==2?d.getHours().toString():"0"+d.getHours().toString())+":"+((parseInt(d.getMinutes()/5)*5).toString().length==2?(parseInt(d.getMinutes()/5)*5).toString():"0"+(parseInt(d.getMinutes()/5)*5).toString())+":00";
  
  // /halving command
  if(message.content.toLowerCase().includes('/halving')) {
    //console.log(`Halving Command Triggered ${Date()}`);
    console.log(`Halving Command Triggered ${date_now}`);
    
    const halvingBlocks = 1051200;
    const block = await fetch("https://node1.elaphant.app/api/v1/block/height");
    const height = await block.json();
    
    // Get next halving block
    let halvingBlock = halvingBlocks*(Math.trunc(parseInt(height.Result)/halvingBlocks)+1);
    
    const blocksToGo = halvingBlock - parseInt(height.Result);
    const secondsRemaining = blocksToGo * 2 * 60;

    let days = Math.floor(secondsRemaining / (60 * 60 * 24));
    let hours = Math.floor((secondsRemaining % (60 * 60 * 24)) / (60 * 60));
    let minutes = Math.floor((secondsRemaining % (60 * 60)) / 60);

    // Send embeded message
    const embed = new MessageEmbed()
    .setColor(0x5BFFD0)
    .setAuthor({ name: 'Cyber Republic DAO', iconURL: 'https://i.postimg.cc/13q2rng1/cr1.png', url: 'https://cyberrepublic.org' })
    .setTitle('Cyber Republic - Refactoring')
    .setURL('https://www.cyberrepublic.org/proposals/5fe404ea7b3b430078ea4866')
    .addField('Elastos Halving Countdown', `${days} days, ${hours} hours, ${minutes} minutes`)
    embed.setTimestamp();
    embed.setFooter(footer_text, footer_img);
    
    message.channel.send({ embeds: [embed] });
    //client.channels.cache.get(channel_id).send({ embeds: [embed] });
  }
  
  // Command section

  if(message.content.toLowerCase().includes('/election')) {
    console.log(`Election Command Triggered ${date_now}`);
    
    const electionClose = 921730;
    const block = await fetch("https://node1.elaphant.app/api/v1/block/height");
    const height = await block.json();

    const blocksToGo = electionClose - parseInt(height.Result);
    const secondsRemaining = blocksToGo < 0 ? 0 : blocksToGo * 2 * 60;
    let days = Math.floor(secondsRemaining / (60 * 60 * 24));
    let hours = Math.floor((secondsRemaining % (60 * 60 * 24)) / (60 * 60));
    let minutes = Math.floor((secondsRemaining % (60 * 60)) / 60);
    let seconds = Math.floor(secondsRemaining % 60);

    const crc = await fetch("https://node1.elaphant.app/api/v1/crc/rank/height/9999999999999?state=active");
    const res = await crc.json();

    let ranks = '';

    res.result.forEach((candidate) => {
      // ranks = ranks + "{0:<20} {1}".format(key, value) + "\n"
      ranks =
        ranks +
        `${candidate.Rank}. ${candidate.Nickname}  --  ${parseFloat(candidate.Votes).toLocaleString("en", {
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        })}` +
        "\n";

      if (candidate.Rank === 12) {
        ranks = ranks + "\n";
      }
    });

    //ranks = ranks + `\n<b>Election close in ${blocksToGo} blocks</b>\n${days} days, ${hours} hours, ${minutes} minutes`;
    //ranks = ranks + `\n<b>Election closed</b>\n${days} days, ${hours} hours, ${minutes} minutes`;

    //ranks = ranks + `\n \nOnce the election concludes, please use /council to view the official results.`;
    //See <a href="https://elanodes.com">elanodes</a> for more details.`;

    //message.channel.send(ranks);
    const embed = new MessageEmbed()
    .setColor(0x5BFFD0)
    .setAuthor({ name: 'Cyber Republic DAO', iconURL: 'https://i.postimg.cc/13q2rng1/cr1.png', url: 'https://cyberrepublic.org' })
    .setTitle('Cyber Republic Council')
    .setURL('https://www.cyberrepublic.org/council')
    .addField('Election Status', ranks)
    .addField('Election Closed', `${days} days, ${hours} hours, ${minutes} minutes`);
    embed.setTimestamp();
    embed.setFooter(footer_text, footer_img);
    message.channel.send({ embeds: [embed] });
  }
  
  // council command
  /*if(message.content.toLowerCase().includes('/council')) {
    console.log(`Council Command Triggered ${date_now}`);

    const headers = {
      "content-type": "application/json;",
    };
    const dataString = '{"method": "listcurrentcrs","params":{"state":"all"}}';
    const options = {
      url: "http://localhost:20336/",
      method: "POST",
      headers: headers,
      body: dataString,
      auth: {
        user: "9b9182c7fb49418fa36f0c8100a555e0",
        pass: "5e946b99ac9f64b09328ceeb715d732a",
      },
    };

    function callback(error, response, body) {
      if (!error && response.statusCode == 200) {
        let list = JSON.parse(body);
        list = list.error.message.crmembersinfo;

        let council = "<b>Cyber Republic Council Incumbents</b>" + "\n" + "\n";
        list.forEach((member) => {
          council = council + `${member.nickname}  --  ${member.state}` + "\n";
        });
        council =
          council +
          `\nDisplays the active council. Will update once the election closes. Use /election for current status.`;
        bot.sendMessage(chatId, council, { parse_mode: "HTML" });
      }
    }
    request(options, callback);
  }*/
  
  // /proposals command
  if(message.content.toLowerCase().includes('/proposals')) {
    console.log(`Proposals Command Triggered ${date_now}`);
    
    const res = await fetch("https://api.cyberrepublic.org/api/cvote/list_public?voteResult=all");
    const proposalList = await res.json();

    const block = await fetch("https://node1.elaphant.app/api/v1/block/height");
    const height = await block.json();

    const active = proposalList.data.list.filter((item) => {
      return item.proposedEndsHeight > height.Result && item.status === "PROPOSED";
      //return item.proposedEndsHeight < height.Result && item.status === "ACTIVE"; // test
    });
    
    const embed = new MessageEmbed()
    .setColor(0x5BFFD0)
    .setAuthor({ name: 'Cyber Republic DAO', iconURL: 'https://i.postimg.cc/13q2rng1/cr1.png', url: 'https://cyberrepublic.org' })
    .setTitle('Cyber Republic - Proposals')
    .setURL('https://www.cyberrepublic.org/proposals');

    if (active.length > 0) {
      let index = 0;
       
      active.reverse().forEach((item, index) => {
        index++;
        
        //if(index > 15) {
        const secondsRemaining =
          parseFloat(item.proposedEndsHeight) - parseFloat(height.Result) < 0
            ? 0
            : (parseFloat(item.proposedEndsHeight) - parseFloat(height.Result)) * 2 * 60;
        const days = Math.floor(secondsRemaining / (60 * 60 * 24));
        const hours = Math.floor((secondsRemaining % (60 * 60 * 24)) / (60 * 60));
        const minutes = Math.floor((secondsRemaining % (60 * 60)) / 60);

        //embed.addField(`${index}. ${item.title}`, `Proposed by - **${item.proposedBy}**\n**Time remaining** - ${days} days, ${hours} hours, ${minutes} minutes\n\u200b`)
        embed.addField(`${index}. ${item.title}`, `Proposed by - ${item.proposedBy}\n**__Time remaining__** - ${days} days, ${hours} hours, ${minutes} minutes\n`)
    
        let support = 0;
        let reject = 0;
        let undecided = 0;
        let abstention = 0;
        let unchained = [];

        item.voteResult.forEach((vote) => {
          if (vote.value === "support" && vote.status === "chained") support++;
          if (vote.value === "reject" && vote.status === "chained") reject++;
          if (vote.value === "undecided") undecided++;
          if (vote.value === "abstention" && vote.status === "chained") abstention++;
          if (vote.value !== "undecided" && vote.status === "unchain") {
            unchained.push(`${council[vote.votedBy]} voted ${vote.value} but did not chain the vote`);
          }
        });

        let unchainedList = '';
          if (unchained.length > 0) {
          unchained.forEach((warning) => {
            unchainedList += `${warning}\n`
          });
        }
                
        //proposals += `<b><u>Council Votes</u></b>\n&#9989;  Support - <b>${support}</b>\n&#10060;  Reject - <b>${reject}</b>\n&#128280;  Abstain - <b>${abstention}</b>\n&#9888;  Undecided - <b>${undecided}</b>\n\n`;
        let voting_status = `✅  Support - **${support}**\n❌  Reject - **${reject}**\n🔘  Abstain - **${abstention}**\n⚠  Undecided - **${undecided}**\n`;
        
        //proposals += `<i><a href='https://www.cyberrepublic.org/proposals/${item._id}'>View on Cyber Republic website</a></i>`;
        embed.addField('__Council Votes__',voting_status);
        
        if (unchained.length > 0) {
          embed.addField('⚠ __Warnings__ ⚠',unchainedList+'\n\u200b');
        } else {
          embed.addField('\u200b','\u200b');
        }
        //}
      });
      //message.channel.send(proposals);
    } else {
      embed.addField("There are currently no proposals in the council voting period", "\u200b");
      //message.channel.send(proposals);
    }
    
    embed.setTimestamp();
    embed.setFooter(footer_text, footer_img);
    
    message.channel.send({ embeds: [embed] });
  }
});

// Automated check
let storedAlerts = {};

client.on('ready', () => {
  if (loop === false) {
    loop = true;
    
    setInterval(async () => {
      const res = await fetch("https://api.cyberrepublic.org/api/cvote/list_public?voteResult=all");
      const proposalList = await res.json();

      const block = await fetch("https://node1.elaphant.app/api/v1/block/height");
      const height = await block.json();
      
      //console.log('height.Result - ' + height.Result);
      
      const active = proposalList.data.list.filter((item) => {
        return item.proposedEndsHeight > height.Result && item.status === "PROPOSED";
        //return item.proposedEndsHeight < height.Result && item.status === "ACTIVE"; // testing
      });
      
      //console.log('active.length - ' + active.length);
      
      if (active.length > 0) {
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
          
          let voting_status = `✅  Support - **${support}**\n❌  Reject - **${reject}**\n🔘  Abstain - **${abstention}**\n⚠  Undecided - **${undecided}**\n\u200b`;
          
          let unchainedList = '';
          if (unchained.length > 0) {
            unchained.forEach((warning) => {
              unchainedList += `${warning}\n`
            });
          }
          let undecidedList = '';
          let failedList = '';
          if (undecideds.length === 0) {
            undecidedList = '😎 Everyone voted! Well done!\n';
            failedList = '😎 Everyone voted! Well done!\n';
          } else {
            undecideds.forEach((member) => {
              undecidedList += `${council[member]}\n`;
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
            description = '❇️ Whoa! A new proposal is now open for voting! 👀';
            storedAlerts[item._id] = 7;
          } else if (blocksRemaining < 3600 && blocksRemaining > 3550) {
            if (storedAlerts[item._id] === 5) return;
            description = '👌 Reminder! There are *5 days* remaining to vote on proposal';
            storedAlerts[item._id] = 5;
          } else if (blocksRemaining < 2160 && blocksRemaining > 2110) {
            if (storedAlerts[item._id] === 3) return;
            description = '👉 Hey you! 👈 There are *3 days* remaining to vote on proposal';
            if (unchained.length > 0) show_unchained = true;
            if (undecidedList.length > 0) show_undecided = true;
            storedAlerts[item._id] = 3;
          } else if (blocksRemaining < 720 && blocksRemaining > 670) {
            if (storedAlerts[item._id] === 1) return;
            description = '⚠ Warning! ⚠ There is only *1 day* remaining to vote on proposal';
            if (unchained.length > 0) show_unchained = true;
            if (undecidedList.length > 0) show_undecided = true;
            storedAlerts[item._id] = 1;
          } else if (blocksRemaining < 360 && blocksRemaining > 310) {
            if (storedAlerts[item._id] === 0.5) return;
            description = '‼ Alert! ‼ There are only *12 hours* remaining to vote on proposal';
            if (unchained.length > 0) show_unchained = true;
            if (undecidedList.length > 0) show_undecided = true;
            storedAlerts[item._id] = 0.5;
          } else if (blocksRemaining <= 7) {
            if (storedAlerts[item._id] === 0) return;
            description = '☠ The council voting period has elapsed for proposal';
            if (unchained.length > 0) show_unchained = true;
            if (undecidedList.length > 0) show_failed = true;
            storedAlerts[item._id] = 0;
          } else {
            return;
          }

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
          embed.setFooter(footer_text, footer_img);
          
          message.channel.send({ embeds: [embed] });
        });
      } else {
        // Send embeded message
        const embed = new MessageEmbed()
        .setColor(0x5BFFD0)
        .setAuthor({ name: 'Cyber Republic DAO', iconURL: 'https://i.postimg.cc/13q2rng1/cr1.png', url: 'https://cyberrepublic.org' })
        .setTitle('Cyber Republic - Proposals')
        .setURL('https://www.cyberrepublic.org/proposals')
        .addField("There are currently no proposals in the council voting period", "\u200b")
        embed.setTimestamp();
        embed.setFooter(footer_text, footer_img);
        
        client.channels.cache.get(channel_id).send({ embeds: [embed] });
      }
      
    }, check_interval);
  } else {
    console.log('Loop already running');
  }
});

// Login to Discord with your client's token
client.login(token);
