// Require the necessary discord.js classes
const { Client, Intents, MessageEmbed, TextChannel } = require('discord.js');
const { token, dev } = require('./config.json');
const codes = require('./codes.json');
const request = require('request');
const fetch = require('node-fetch');
let loop = false;
let check_mins = 5;
if (dev) check_mins = 5;
let check_interval = check_mins * 60 * 1000;

// current version
const ver = "v1.3.7";

// Bot start date
let start_date = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
let start_date_raw = new Date();

// Create a new client instance
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES]});
let channel_id = '917029748192985139'; // Elastos Discord #πβcyber-republic-dao
if (dev) channel_id = '920225673887494157'; // MB Test server #general

// Basic variables
const council = {
  //"5b6cff7a3d173c0089ee5acf": "SUNNYFENGHAN",
  //"60d094eec05ef80078cf689e": "Donald Bullers",
  //"60db5e08c05ef80078cfdb85": "Mark Xing",
  //"5b4e46dbccac490035e4072f": "Brittany Kaiser | Own Your Data",
  //"5c2f5a15f13d65008969be61": "Zhang Feng",
  //"5ee0d99f9e10fd007849e53e": "Orchard Trinity",
  "60cf124660cb2c00781146e2": "Elation Studios",
  "60c444e0a9daba0078a58aed": "Ryan | Starfish Labs",
  "60c4826d77d3640078f4ddfe": "Rebecca Zhu",
  "60cff34cc05ef80078cf60e8": "SJun Song",
  "5ee045869e10fd007849e3d2": "The Strawberry Council",
  "5c738c9a471cb3009422b42e": "Jingyu Niu",
  "5b4e46dbccac490035e4072f": "Sash | Elacity π",
  "62a97bb904223900785a5897": "MButcho β Nenchy",
  "5b481442e3ffea0035f4e6e7": "DR",
  "62b1a5c804223900785aa988": "Infi",
  "62bc8a196705da0078a4e378": "Phantz Club",
  "5d14716f43816e009415219b": "PG BAO",
};

const footer_text = `Support CR Discord Bot ${ver} via donations to EUSMsck3svNiacva9LfwrLfbvNnUU27z77`;
const footer_img = 'https://i.postimg.cc/Yq1g9cWv/avatar.png';

// When the client is ready
client.once('ready', () => {
  console.log(`${start_date} Logged in as ${client.user.tag} on ${ver}`);
});

// Run commands
client.on('interactionCreate', async interaction => {
  if (!interaction.isCommand()) return;
  
  // get date&time
  let command_date = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
  let command_date_raw = new Date();
  let seconds_since_start = (command_date_raw - start_date_raw) / 1000;
  
  const { commandName } = interaction;

  if (commandName === 'ping-cr-bot') {
    console.log(`${command_date} Ping command triggered`);
    await interaction.deferReply();
    
    let days = Math.floor(seconds_since_start / (60 * 60 * 24));
    let hours = Math.floor((seconds_since_start % (60 * 60 * 24)) / (60 * 60));
    let minutes = Math.floor((seconds_since_start % (60 * 60)) / 60);
    
    // calculate next loop run
    let next_loop_round = Math.trunc((parseInt(seconds_since_start)/60)/check_mins)+1;
    let next_loop_raw = ((check_mins*next_loop_round)-(seconds_since_start/60)).toFixed(2);
    let next_loop_mins = Math.floor(next_loop_raw);
    let next_loop_secs = Math.floor((next_loop_raw - next_loop_mins)*60).toString();
    // add leading 0
    if (next_loop_secs.length === 1) next_loop_secs = "0"+next_loop_secs;
    
    // Send embeded message
    const embed = new MessageEmbed()
    .setColor(0x5BFFD0)
    .setAuthor({ name: 'Cyber Republic DAO', iconURL: 'https://i.postimg.cc/13q2rng1/cr1.png', url: 'https://cyberrepublic.org' })
    .setTitle('Cyber Republic - Proposals')
    .setURL('https://www.cyberrepublic.org/proposals')
    .addField(`Bot running for:`, `${days} days, ${hours} hours, ${minutes} minutes\n\n**Next automatic proposals check:** ${next_loop_mins}:${next_loop_secs} mins\n**Bot start:** ${start_date} UTC\n**Source code:** [CR Discord Bot ${ver}](https://github.com/MButcho/discord-cr-bot)\n\u200b`)
    embed.setTimestamp();
    embed.setFooter({text: footer_text, iconURL: footer_img});
    
    //await interaction.reply({ embeds: [embed] });
    interaction.editReply({ embeds: [embed] });
      
  } else if (commandName === 'halving') {
    console.log(`${command_date} Halving command triggered`);
    await interaction.deferReply();
    
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
    embed.setFooter({text: footer_text, iconURL: footer_img});
    
    //await interaction.reply({ embeds: [embed] });
    interaction.editReply({ embeds: [embed] });
    
  } else if (commandName === 'election') {
    console.log(`${command_date} Election command triggered`);
    await interaction.deferReply();
    
    const councilTerm = 262800;
    const firstCouncil = 658930;
    const electionPeriod = 21600;
    const block = await fetch("https://node1.elaphant.app/api/v1/block/height");
    const height = await block.json();
    const block_height = parseInt(height.Result);
    // const block_height = 1184531;   
    
    
    // Get election dates
    const electionClose = parseInt(firstCouncil)+(councilTerm*(Math.trunc((block_height-parseInt(firstCouncil))/parseInt(councilTerm))+1));
    const electionStart = electionClose - electionPeriod;

    let blocksToGo = electionClose - block_height;
    if (blocksToGo > electionPeriod) {
      blocksToGo = electionClose - block_height - electionPeriod;
      electionStatus = "Election Results";
    } else {
      electionStatus = "Election Status";
    }
    const secondsRemaining = blocksToGo < 0 ? 0 : blocksToGo * 2 * 60;
    let days = Math.floor(secondsRemaining / (60 * 60 * 24));
    let hours = Math.floor((secondsRemaining % (60 * 60 * 24)) / (60 * 60));
    let minutes = Math.floor((secondsRemaining % (60 * 60)) / 60);
    let seconds = Math.floor(secondsRemaining % 60);
    
    const crc = await fetch("https://node1.elaphant.app/api/v1/crc/rank/height/9999999999999?state=active");
    const res = await crc.json();

    let ranks = '';
    let ranks2 = '';
    let voted = '';
    let totalVotes = 0;

    res.result.forEach((candidate) => {
      // ranks = ranks + "{0:<20} {1}".format(key, value) + "\n"
      let output = codes.filter(a => a.code == candidate.Location);      
      
      if (candidate.Rank < 13) {
        ranks += `**${candidate.Rank}.** ${candidate.Nickname} (${output[0].name}) *[web](${candidate.Url})* -- **${parseFloat(candidate.Votes).toLocaleString("en", {
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        })}**` + "\n";
      } else {
        ranks2 += `**${candidate.Rank}.** ${candidate.Nickname} (${output[0].name}) *[web](${candidate.Url})* -- **${parseFloat(candidate.Votes).toLocaleString("en", {
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        })}**` + "\n";
      }
      
      totalVotes += parseFloat(candidate.Votes);
      /*if (candidate.Rank === 12) {
        ranks = ranks + "\n";
      }*/
    });
    
    voted += `***Total ELA voted -- ${new Intl.NumberFormat('en-US').format(totalVotes)}***`;
    
    if (ranks2.length > 1024) {
      ranks2 = ranks2.substring(1, 1024);
    }

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
    .addField(electionStatus, ranks);
    if (ranks2.length > 0) {
      embed.addField('----------------------------------------------', ranks2);
    }
    embed.addField('----------------------------------------------', voted);
    if (blocksToGo < electionPeriod) {
      embed.addField('CR Council election in progress', `**Start:** Block height -- **${new Intl.NumberFormat('en-US').format(electionStart)}**\n**Current:** Block height -- **${new Intl.NumberFormat('en-US').format(block_height)}**\n**End:** Block height -- **${new Intl.NumberFormat('en-US').format(electionClose)}**\n**End in:** ${days} days, ${hours} hours, ${minutes} minutes\n`);
      
    } else {
      embed.addField('Next CR Council election', `**Start:** Block height -- **${new Intl.NumberFormat('en-US').format(electionStart)}**\n**Current:** Block height -- **${new Intl.NumberFormat('en-US').format(block_height)}**\n**Start in:** ${days} days, ${hours} hours, ${minutes} minutes\n`);
    }
        
    embed.setTimestamp();
    embed.setFooter({text: footer_text, iconURL: footer_img});
    
    //await interaction.reply({ embeds: [embed] });
    interaction.editReply({ embeds: [embed] });
    
  } else if (commandName === 'proposals') {
    console.log(`${command_date} Proposals command triggered`);
    await interaction.deferReply();
    
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
        
        const secondsRemaining =
          parseFloat(item.proposedEndsHeight) - parseFloat(height.Result) < 0
            ? 0
            : (parseFloat(item.proposedEndsHeight) - parseFloat(height.Result)) * 2 * 60;
        const days = Math.floor(secondsRemaining / (60 * 60 * 24));
        const hours = Math.floor((secondsRemaining % (60 * 60 * 24)) / (60 * 60));
        const minutes = Math.floor((secondsRemaining % (60 * 60)) / 60);

        embed.addField(`${index}. ${item.title}`, `[Link to proposal](https://www.cyberrepublic.org/proposals/${item._id})`)
        embed.addField(`__Proposed by__`, `${item.proposedBy}`);
        embed.addField(`__Time remaining__`, `${days} days, ${hours} hours, ${minutes} minutes\n`)
    
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
        let voting_status = `β  Support - **${support}**\nβ  Reject - **${reject}**\nπ  Abstain - **${abstention}**\nβ   Undecided - **${undecided}**\n\u200b`;
        
        if (unchained.length = 0) voting_status += '\u200b';
        //proposals += `<i><a href='https://www.cyberrepublic.org/proposals/${item._id}'>View on Cyber Republic website</a></i>`;
        embed.addField('__Council Votes__',voting_status);
        
        if (unchained.length > 0) embed.addField('β  __Warnings__ β ',unchainedList+'\n\u200b');
      });
    } else {
      embed.addField("There are currently no proposals in the council voting period", "\u200b");
    }
    
    embed.setTimestamp();
    embed.setFooter({text: footer_text, iconURL: footer_img});
    //embed.setFooter(footer_text, footer_img);
    
		//await interaction.reply({ embeds: [embed] });
		interaction.editReply({ embeds: [embed] });
  }
});

// Respond to messages
/*client.on('messageCreate', async (message) => {
  // get date&time
  //let command_date = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
    
  // old /ping response
  if(message.content.toLowerCase().startsWith('/ping') || message.content.toLowerCase().startsWith('!ping')) {
    console.log(`${command_date} Ping command triggered`);
    
    // Send embeded message
    const embed = new MessageEmbed()
    .setColor(0x5BFFD0)
    .setAuthor({ name: 'Cyber Republic DAO', iconURL: 'https://i.postimg.cc/13q2rng1/cr1.png', url: 'https://cyberrepublic.org' })
    .setTitle('Cyber Republic - Proposals')
    .setURL('https://www.cyberrepublic.org/proposals')
    .addField(`I am up and running since ${start_date} UTC`, '\u200b')
    embed.setTimestamp();
    embed.setFooter({text: footer_text, iconURL: footer_img});
    
    message.channel.send({ embeds: [embed] });
    //client.channels.cache.get(channel_id).send({ embeds: [embed] });
  }*/
    
  // council response
  /*if(message.content.toLowerCase().includes('/council')) {
    console.log(`${command_date} Council command triggered`);

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
  }
});*/

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
      
      let loop_date = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
      //console.log(`${loop_date} Loop - Started`);
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
          
          let voting_status = `β  Support - **${support}**\nβ  Reject - **${reject}**\nπ  Abstain - **${abstention}**\nβ   Undecided - **${undecided}**\n\u200b`;
          
          let unchainedList = '';
          if (unchained.length > 0) {
            unchained.forEach((warning) => {
              unchainedList += `${warning}\n`
            });
          }
          let undecidedList = '';
          let failedList = '';
          if (undecideds.length === 0) {
            undecidedList = 'π Everyone voted! Well done!\n';
            failedList = 'π Everyone voted! Well done!\n';
          } else {
            undecideds.forEach((member) => {
              undecidedList += `${council[member]}\n`;
              failedList += `${council[member]} βΉ\n`;
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
            description = 'βοΈ Whoa! A new proposal is now open for voting! π';
            storedAlerts[item._id] = 7;
          } else if (blocksRemaining < 3600 && blocksRemaining > 3550) {
            if (storedAlerts[item._id] === 5) return;
            description = 'π Reminder! There are *5 days* remaining to vote on proposal';
            storedAlerts[item._id] = 5;
          } else if (blocksRemaining < 2160 && blocksRemaining > 2110) {
            if (storedAlerts[item._id] === 3) return;
            description = 'π Hey you! π There are *3 days* remaining to vote on proposal';
            if (unchained.length > 0) show_unchained = true;
            if (undecidedList.length > 0) show_undecided = true;
            storedAlerts[item._id] = 3;
          } else if (blocksRemaining < 720 && blocksRemaining > 670) {
            if (storedAlerts[item._id] === 1) return;
            description = 'β  Warning! β  There is only *1 day* remaining to vote on proposal';
            if (unchained.length > 0) show_unchained = true;
            if (undecidedList.length > 0) show_undecided = true;
            storedAlerts[item._id] = 1;
          } else if (blocksRemaining < 360 && blocksRemaining > 310) {
            if (storedAlerts[item._id] === 0.5) return;
            description = 'βΌ Alert! βΌ There are only *12 hours* remaining to vote on proposal';
            if (unchained.length > 0) show_unchained = true;
            if (undecidedList.length > 0) show_undecided = true;
            storedAlerts[item._id] = 0.5;
          } else if (blocksRemaining <= 7) {
            if (storedAlerts[item._id] === 0) return;
            description = 'β  The council voting period has elapsed for proposal';
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
          .addField(description, `__**Proposed by**__: ${item.proposedBy}`)
          .addField("__Current voting status__", voting_status);
          if (show_unchained) embed.addField("__Warnings__", unchainedList+'\u200b');
          if (show_undecided) embed.addField("__Council members who have not yet voted__", undecidedList+'\u200b');
          if (show_failed) embed.addField("__Council members who failed to vote__", failedList+'\u200b');
          embed.setTimestamp();
          embed.setFooter({text: footer_text, iconURL: footer_img});
          
          //message.channel.send({ embeds: [embed] });
          client.channels.cache.get(channel_id).send({ embeds: [embed] });
          loop_date = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
          console.log(`${loop_date} Loop - Automatic proposal message sent`);
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
        embed.setFooter({text: footer_text, iconURL: footer_img});
        
        // disabled upon request 30.12.2021
        //client.channels.cache.get(channel_id).send({ embeds: [embed] });
        console.log(`${loop_date} Loop - No proposals active`);
      }
      //loop_date = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
      //console.log(`${loop_date} Loop - Finished`);
    }, check_interval);
  } else {
    console.log('Loop already running');
  }
});

// Login to Discord with your client's token
client.login(token);
