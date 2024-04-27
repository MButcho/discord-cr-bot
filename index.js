// Require the necessary discord.js classes
const { Client, Intents, MessageEmbed, TextChannel } = require('discord.js');
const { token, dev } = require('./config.json');
const { crc_members, crc_sec } = require('./council.json');
const codes = require('./codes.json');
const request = require('request');
const fetch = require('node-fetch');
let loop = false;
let check_mins = 5;
let show_date = false;
if (dev) {
  check_mins = 0.1;
  show_date = true;
  show_log_msg = true;
}
let check_interval = check_mins * 60 * 1000;

// basic variables
const ver = "v1.6.1";
const api_official = "https://api.elastos.io/ela";
//const api_official = " https://api.elasafe.com/ela";
const eid_official = "https://api.elastos.io/eid";
const api_proposals = "https://api.cyberrepublic.org/api/cvote/list_public?voteResult=all";
let connection_ok = true;
const err_msg = "API is currently in down, please try again later ...";

// Bot start date
let start_date = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
let start_date_raw = new Date();

// Create a new client instance
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES]});
let channel_id = '917029748192985139'; // Elastos Discord #🌎┃cyber-republic-dao
if (dev) channel_id = '925767750767497216'; // MB Test server #test
let all_voted = '😎 Everyone voted! Well done!\n\u200b';

let days = 0;
let hours = 0;
let minutes = 0;
let seconds = 0;
let height = 0;
let block_height = "";

const footer_text = `Support CR Bot ${ver} creator via EJfW2mCdZPVxHVEv891xDop7hJAsYbKH5R`;
const footer_img = 'https://i.postimg.cc/660rjMR1/avatar-laser-blue.png';

// When the client is ready
client.once('ready', () => {
  console.log((show_date ? start_date + " ":"") + `Logged in as ${client.user.tag} on ${ver}`);
});

// Run commands
client.on('interactionCreate', async interaction => {
  if (!interaction.isCommand()) return;
  
  // get date&time
  let command_date = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
  let command_date_raw = new Date();
  let seconds_since_start = (command_date_raw - start_date_raw) / 1000;
  
  const { commandName } = interaction;

  if (commandName === 'ping') {
    console.log((show_date ? command_date + " ":"") + `Ping command triggered`);
    await interaction.deferReply();
    
    days = Math.floor(seconds_since_start / (60 * 60 * 24));
    hours = Math.floor((seconds_since_start % (60 * 60 * 24)) / (60 * 60));
    minutes = Math.floor((seconds_since_start % (60 * 60)) / 60);
    
    height = await blockHeight();
    
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
    .addFields({name: `Bot running for:`, value: `${days} days, ${hours} hours, ${minutes} minutes\n\n**Next automatic proposals check:** ${next_loop_mins}:${next_loop_secs} mins\n**Bot start:** ${start_date} UTC\n**Elastos block height:** ${height}\n**Source code:** [CR Discord Bot ${ver}](https://github.com/MButcho/discord-cr-bot)\n\u200b`});
    //embed.setTimestamp();
    embed.setFooter({text: footer_text, iconURL: footer_img});
    
    //await interaction.reply({ embeds: [embed] });
    interaction.editReply({ embeds: [embed] });
      
  } else if (commandName === 'halving') {
    console.log((show_date ? command_date + " ":"") + `Halving command triggered`);
    await interaction.deferReply();
    
    const halvingBlocks = 1051200;
    height = await blockHeight();
    
    if (connection_ok) {
      // Get next halving block
      let halvingBlock = halvingBlocks*(Math.trunc(parseInt(height)/halvingBlocks)+1);
      
      const blocksToGo = halvingBlock - parseInt(height);
      const secondsRemaining = blocksToGo * 2 * 60;

      days = Math.floor(secondsRemaining / (60 * 60 * 24));
      hours = Math.floor((secondsRemaining % (60 * 60 * 24)) / (60 * 60));
      minutes = Math.floor((secondsRemaining % (60 * 60)) / 60);
    }

    // Send embeded message
    const embed = new MessageEmbed()
    .setColor(0x5BFFD0)
    .setAuthor({ name: 'Cyber Republic DAO', iconURL: 'https://i.postimg.cc/13q2rng1/cr1.png', url: 'https://cyberrepublic.org' })
    .setTitle('Cyber Republic - Refactoring')
    .setURL('https://www.cyberrepublic.org/proposals/5fe404ea7b3b430078ea4866');
    if (connection_ok) {
      embed.addFields({name: 'Elastos Halving Countdown', value: `${days} days, ${hours} hours, ${minutes} minutes`});
    } else {
      embed.addFields({name: 'Elastos Halving Countdown', value: `${err_msg}`});
    }
    
    embed.addFields({name: 'ELA emission', value: '**Until 12/2025**: 400 000 ELA / Year = ~1.52 ELA / 2 mins\n**Rewards are split**: 35% PoW Miners / 35% DPoS Nodes / 30% CR'});
    //embed.setTimestamp();
    embed.setFooter({text: footer_text, iconURL: footer_img});
    
    //await interaction.reply({ embeds: [embed] });
    interaction.editReply({ embeds: [embed] });
  } else if (commandName === 'bpos') {
    console.log((show_date ? command_date + " ":"") + `BPoS command triggered`);
    await interaction.deferReply();
    
    const bposBlocks = 1405000;
    const reqVotes = 80000;
    
    //let dpos_count = 0;
    //let dpos = {
    //  method: 'listproducers',
    //  params: {"state": "active", "identity":"v1"},
    //};
    
    //const dpos_request = await fetch(api_bpos, {
    // method: 'POST',
    //  body: JSON.stringify(dpos),
    //  headers: {
    //      'Content-Type': 'application/json'
    //      // fyi, NO need for content length
    //  }
    //})
    //.then(res => res.json())
    //.then(json => dpos_count = json.result.totalcounts)
    //.catch (err => console.log(err))
    
    // BPoS
    let producers = "";
    let bpos_count_80 = 0;
    let bpos_count_40 = 0;
    let bpos_count_20 = 0;
    let bpos_count_0 = 0;
    let bpos_count_inactive = 0;
    let bpos_inactive = "";
    let bpos = {
      method: 'listproducers',
      params: {"state": "all", "identity":"v2"},
    };
    
    const bpos_request = await fetch(api_official, {
      method: 'POST',
      body: JSON.stringify(bpos),
      headers: {
          'Content-Type': 'application/json'
          // fyi, NO need for content length
      }
    })
    .then(res => res.json())
    .then(json => producers = json.result.producers)
    //.then(json => producers = json.result.producers)
    .catch (err => console.log(err))
    
    producers.forEach(producer => {
      let dposv2votes = producer.dposv2votes;
      let state = producer.state;
      let nickname = producer.nickname;
      
      if (state == "Active") {
        if (parseInt(dposv2votes) > reqVotes) {
          bpos_count_80 = bpos_count_80 + 1;
        } else if (parseInt(dposv2votes) > reqVotes/2) {
          bpos_count_40 = bpos_count_40 + 1;
        }  else if (parseInt(dposv2votes) > reqVotes/4) {
          bpos_count_20 = bpos_count_20 + 1;
        } else {
          bpos_count_0 = bpos_count_0 + 1;
        }
      
      } else if (state == "Inactive") {
        bpos_count_inactive = bpos_count_inactive + 1;
        bpos_inactive += nickname + "\n"
      }
      
    });
    
    bpos_count = bpos_count_80 + bpos_count_40 + bpos_count_20 + bpos_count_0
    
    // Send embeded message
    const embed = new MessageEmbed()
    .setColor(0x5BFFD0)
    .setAuthor({ name: 'Cyber Republic DAO', iconURL: 'https://i.postimg.cc/13q2rng1/cr1.png', url: 'https://cyberrepublic.org' })
    .setTitle('Bonded Proof of Stake')
    .setURL('https://www.cyberrepublic.org/proposals/61cdad4cb5d3b6007833e15e');
    embed.addFields({name: 'Active BPoS nodes', value: `Total active: **${bpos_count}**\n80k+ votes: **${bpos_count_80}**\n40k+ votes: **${bpos_count_40}** (${bpos_count_80+bpos_count_40})\n20k+ votes: **${bpos_count_20}** (${bpos_count_80+bpos_count_40+bpos_count_20})\nLess than 20k+ votes: **${bpos_count_0}** (${bpos_count})`});
    embed.addFields({name: 'Inactive BPoS nodes', value: `Total inactive: **${bpos_count_inactive}**\n${bpos_inactive}`});
    //embed.addFields({name: 'DPoS 1.0 (old)', value: `Active nodes: **${dpos_count}**`});
    
    height = await blockHeight();
    if (connection_ok) {
      block_height = parseInt(height);
    } else {
      block_height = err_msg;
    }
    embed.addFields({name: `BPoS Initiation`, value: `BPoS was initiated on block ${bposBlocks}\nCurrent block: ${block_height}`});
    //embed.setTimestamp();
    embed.setFooter({text: footer_text, iconURL: footer_img});
    
    //await interaction.reply({ embeds: [embed] });
    interaction.editReply({ embeds: [embed] });
    
  } else if (commandName === 'election') {
    console.log((show_date ? command_date + " ":"") + `Election command triggered`);
    await interaction.deferReply();
    
    const councilTerm = 262800;
    const firstCouncil = 658930;
    const electionPeriod = 21600;
    const transitionPeriod = 10080;
    let electionStateMsg = "";
    let transitionState = false;
    
    let blocksToGo = 0;    
    
    let electionClose = 0;
    let electionStart = 0;
    let ranks = "";
    let totalVotes = 0;
    let voted = "";
    
    height = await blockHeight();
    
    if (connection_ok) {        
      block_height = parseInt(height);
      //block_height = 1437249;
      
      // Get election dates
      electionClose = parseInt(firstCouncil)+(councilTerm*(Math.trunc((block_height-parseInt(firstCouncil))/parseInt(councilTerm))+1))-transitionPeriod;
      electionStart = electionClose - electionPeriod;
      
      if (block_height >= electionClose && block_height <= electionClose+transitionPeriod) transitionState = true; // if transition period
      //console.log(block_height, electionClose, block_height , electionClose+transitionPeriod, transitionState);
      if (block_height > electionStart && block_height < electionClose) {
        blocksToGo = electionClose - block_height;
        electionStatus = "Election Status";
      } else {
        if (!transitionState) {
          blocksToGo = electionStart - block_height;
        } else {
          electionStart = electionClose;
          electionClose = electionClose + transitionPeriod;
          blocksToGo = electionClose - block_height;
        }
        electionStatus = "Election Results";
      }
      
      const secondsRemaining = blocksToGo < 0 ? 0 : blocksToGo * 2 * 60;
      days = Math.floor(secondsRemaining / (60 * 60 * 24));
      hours = Math.floor((secondsRemaining % (60 * 60 * 24)) / (60 * 60));
      minutes = Math.floor((secondsRemaining % (60 * 60)) / 60);
      seconds =Math.floor(secondsRemaining % 60);
      let candidates = "";
    
      if (!transitionState) {
        candidates = await getData("listcrcandidates");
        if (candidates.totalcounts > 0) {
          candidates.crcandidatesinfo.forEach((candidate) => {
            let output = codes.filter(a => a.code == candidate.location);            
            ranks += `**${candidate.index+1}.** ${candidate.nickname} (${output[0].name}) *[web](${candidate.url})* -- **${parseFloat(candidate.votes).toLocaleString("en", {
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            })}**` + "\n";
          
            totalVotes += parseFloat(candidate.votes);
            /*if (candidate.Rank === 12) {
              crcs = crcs + "\n";
            }*/
          });
        } else {
          ranks = "No candidate available yet";
        }
      } else {
        candidates = await getData("listnextcrs");
        if (candidates.totalcounts > 0) {
          candidates.crmembersinfo.forEach((candidate) => {
            let output = codes.filter(a => a.code == candidate.location);
            ranks += `**${candidate.index+1}.** ${candidate.nickname} (${output[0].name}) *[web](${candidate.url})*\n`;
          });
        } else {
          ranks = "No candidate available yet";
        }
      }
      
      if (!transitionState) voted += `***Total ELA voted -- ${new Intl.NumberFormat('en-US').format(totalVotes)}***`;
      
      if (ranks.length > 1024) {
        ranks = ranks.substring(1, 1024);
      }
    }
    const embed = new MessageEmbed()
    .setColor(0x5BFFD0)
    .setAuthor({ name: 'Cyber Republic DAO', iconURL: 'https://i.postimg.cc/13q2rng1/cr1.png', url: 'https://cyberrepublic.org' })
    .setTitle('Cyber Republic Council')
    .setURL('https://www.cyberrepublic.org/council');
    if (connection_ok) {      
      embed.addFields({name: electionStatus, value: ranks});
      if (!transitionState) embed.addFields({name: '-----------------------------------------', value: voted});
      if (!transitionState) {
        if (block_height > electionStart && block_height < electionClose) {
          electionStateMsg = `CR Election in progress`;
          electionStateTime = `**End in:** ${days} days, ${hours} hours, ${minutes} minutes`;
          
        } else {
          electionStateMsg = `Next CR Council election`;
          electionStateTime = `**Start in:** ${days} days, ${hours} hours, ${minutes} minutes`;
        }
      } else {
        electionStateMsg = `Transition period`;
        electionStateTime = `**End in:** ${days} days, ${hours} hours, ${minutes} minutes`;
      }
      
      //console.log(`${block_height} > ${electionStart} && ${block_height} < ${electionClose}`);
      
      embed.addFields({name: `${electionStateMsg}`, value: `**Start:** Block height -- **${new Intl.NumberFormat('en-US').format(electionStart)}**\n**Current:** Block height -- **${new Intl.NumberFormat('en-US').format(block_height)}**\n**End:** Block height -- **${new Intl.NumberFormat('en-US').format(electionClose)}**\n${electionStateTime}\n`});
    } else {
      embed.addFields({name: `CR Election`, value: err_msg});
    }
    //embed.setTimestamp();
    embed.setFooter({text: footer_text, iconURL: footer_img});
    
    //await interaction.reply({ embeds: [embed] });
    interaction.editReply({ embeds: [embed] });
    
  } else if (commandName === 'council') {
    console.log((show_date ? command_date + " ":"") + `Council command triggered`);
    await interaction.deferReply();
    
    const councilTerm = 262800;
    const firstCouncil = 658930;
    let electionStateMsg = "";
    
    let blocksToGo = 0;    
    let currentCouncilEnd = 0;
    let currentCouncilStart = 0;
    let secsCurrentCouncil = 0;
    let days = 0;
    let hours = 0;
    let minutes = 0;
    let seconds = 0;
    let crcs = "";
    
    height = await blockHeight();
    
    if (connection_ok) {        
      block_height = parseInt(height);
      //block_height = 1447331;   
      
      // Get election dates
      currentCouncilEnd = parseInt(firstCouncil)+(councilTerm*(Math.trunc((block_height-parseInt(firstCouncil))/parseInt(councilTerm))+1));
      currentCouncilStart = currentCouncilEnd - councilTerm;
      blocksToGo = currentCouncilEnd - block_height;
      secsCurrentCouncil = blocksToGo < 0 ? 0 : blocksToGo * 2 * 60;
      days = Math.floor(secsCurrentCouncil / (60 * 60 * 24));
      hours = Math.floor((secsCurrentCouncil % (60 * 60 * 24)) / (60 * 60));
      minutes = Math.floor((secsCurrentCouncil % (60 * 60)) / 60);
      seconds = Math.floor(secsCurrentCouncil % 60);
      
      const crc = await getData("listcurrentcrs");
      crc.crmembersinfo.forEach((candidate) => {
        // crcs = crcs + "{0:<20} {1}".format(key, value) + "\n"
        let output = codes.filter(a => a.code == candidate.location);      
        
        crcs += `**${candidate.index+1}.** ${candidate.nickname} (${output[0].name}) *[web](${candidate.url})*\n`;
      });
      
    }
    const embed = new MessageEmbed()
    .setColor(0x5BFFD0)
    .setAuthor({ name: 'Cyber Republic DAO', iconURL: 'https://i.postimg.cc/13q2rng1/cr1.png', url: 'https://cyberrepublic.org' })
    .setTitle('Cyber Republic Council')
    .setURL('https://www.cyberrepublic.org/council');
    if (connection_ok) {      
      embed.addFields({name: `Current CR council`, value: crcs});
      embed.addFields({name: 'Current CR Council', value: `**Start:** Block height -- **${new Intl.NumberFormat('en-US').format(currentCouncilStart)}**\n**Current:** Block height -- **${new Intl.NumberFormat('en-US').format(block_height)}**\n**End:** Block height -- **${new Intl.NumberFormat('en-US').format(currentCouncilEnd)}**\n**End in:** ${days} days, ${hours} hours, ${minutes} minutes\n`});
    } else {
      embed.addFields({name: `CR Election`, value: err_msg});
    }
    //embed.setTimestamp();
    embed.setFooter({text: footer_text, iconURL: footer_img});
    
    //await interaction.reply({ embeds: [embed] });
    interaction.editReply({ embeds: [embed] });
    
  } else if (commandName === 'proposals') {
    console.log((show_date ? command_date + " ":"") + `Proposals command triggered`);
    await interaction.deferReply();
    
    const res = await fetch(api_proposals);
    const proposalList = await res.json();

    height = await blockHeight();
    
    const active = proposalList.data.list.filter((item) => {
      return item.status === "PROPOSED";
      //return item.proposedEndsHeight > height && item.status === "PROPOSED";
      //return item.proposedEndsHeight < height && item.status === "ACTIVE"; // test
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
        
        let secondsRemaining = 0;
        if (connection_ok) {
          secondsRemaining =
            parseFloat(item.proposedEndsHeight) - parseFloat(height) < 0
              ? 0
              : (parseFloat(item.proposedEndsHeight) - parseFloat(height)) * 2 * 60;
        }
        days = Math.floor(secondsRemaining / (60 * 60 * 24));
        hours = Math.floor((secondsRemaining % (60 * 60 * 24)) / (60 * 60));
        minutes = Math.floor((secondsRemaining % (60 * 60)) / 60);

        embed.addFields(
          {name: `${index}. ${item.title}`, value: `[Link to proposal](https://www.cyberrepublic.org/proposals/${item._id})`},
          {name: `__Proposed by__`, value: `${item.proposedBy}`},
          {name: `__Time remaining__`, value: `${days} days, ${hours} hours, ${minutes} minutes\n`}
        )
    
        let support = 0;
        let reject = 0;
        let undecided = 0;
        let abstention = 0;
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
            let value = getCRC(vote.votedBy, "nickname");
            unchained.push(`${value} voted ${vote.value} but did not chain the vote`);
          }
        });

        let unchainedList = '';
          if (unchained.length > 0) {
          unchained.forEach((warning) => {
            unchainedList += `${warning}\n`
          });
        };
        
        let undecidedList = '';
        if (undecideds.length !== 0) {
          undecideds.forEach((member) => {
            let value = getCRC(member, "nickname");
            undecidedList += `${value}\n`;
          });
        };
                
        //proposals += `<b><u>Council Votes</u></b>\n&#9989;  Support - <b>${support}</b>\n&#10060;  Reject - <b>${reject}</b>\n&#128280;  Abstain - <b>${abstention}</b>\n&#9888;  Undecided - <b>${undecided}</b>\n\n`;
        let voting_status = `✅  Support - **${support}**\n❌  Reject - **${reject}**\n🔘  Abstain - **${abstention}**\n⚠  Undecided - **${undecided}**\n\u200b`;
        
        if (unchained.length = 0) voting_status += '\u200b';
        //proposals += `<i><a href='https://www.cyberrepublic.org/proposals/${item._id}'>View on Cyber Republic website</a></i>`;
        embed.addFields({name: '__Council Votes__', value: voting_status});        
        if (undecidedList.length > 0) {
          embed.addFields({name: '⚠ __Not Voted Yet__', value: undecidedList+'\u200b'});
        } else {
          embed.addFields({name: '✅ __Voting__', value: all_voted});
        }
        if (unchained.length > 0) embed.addFields({name: '⚠ __Not Chained__ ⚠', value: unchainedList+'\u200b'});
      });
    } else {
      embed.addFields({name: "There are currently no proposals in the council voting period", value: "\u200b"});
    }
    
    //embed.setTimestamp();
    embed.setFooter({text: footer_text, iconURL: footer_img});
    //embed.setFooter(footer_text, footer_img);
    
		//await interaction.reply({ embeds: [embed] });
		interaction.editReply({ embeds: [embed] });
  }
});

// Automated check
let storedAlerts = {};

client.on('ready', () => {
  if (loop === false) {
    loop = true;
    let loop_date = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
    //console.log(`${loop_date} Loop - Started`);
    //console.log('height - ' + height);
    
    setInterval(async () => {
      const res = await fetch(api_proposals);
      const proposalList = await res.json();
      
      height = await blockHeight();
      
      if (connection_ok) {
        const active = proposalList.data.list.filter((item) => {
          return item.proposedEndsHeight > height && item.status === "PROPOSED";
          //return item.proposedEndsHeight < height && item.status === "ACTIVE"; // testing
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
                let value = getCRC(vote.votedBy, "nickname");
                unchained.push(`${value} voted ${vote.value} but did not chain the vote`);
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
            if (undecideds.length !== 0) {
              undecideds.forEach((member) => {
                let value = getCRC(member, "nickname");
                undecidedList += `${value}\n`;          
                failedList += `${value}\n`;          
              });
            };

            let _message = "";
            let description = "";
            let show_unchained = false;
            let show_undecided = true;
            let show_failed = false;
            
            const blocksRemaining = item.proposedEndsHeight - height;
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
              storedAlerts[item._id] = 3;
            } else if (blocksRemaining < 720 && blocksRemaining > 670) {
              if (storedAlerts[item._id] === 1) return;
              description = '⚠ Warning! ⚠ There is only *1 day* remaining to vote on proposal';
              if (unchained.length > 0) show_unchained = true;
              storedAlerts[item._id] = 1;
            } else if (blocksRemaining < 360 && blocksRemaining > 310) {
              if (storedAlerts[item._id] === 0.5) return;
              description = '‼ Alert! ‼ There are only *12 hours* remaining to vote on proposal';
              if (unchained.length > 0) show_unchained = true;
              storedAlerts[item._id] = 0.5;
            } else if (blocksRemaining <= 7) {
              if (storedAlerts[item._id] === 0) return;
              description = '☠ The council voting period has elapsed for proposal';
              if (unchained.length > 0) show_unchained = true;
              show_failed = true;
              show_undecided = false;
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
            .addFields(
              {name: description, value: `__**Proposed by**__: ${item.proposedBy}`},
              {name: "__Current voting status__", value: voting_status}
            );
            if (show_unchained) embed.addFields({name: "⚠ __Not Chained Yet__", value: unchainedList+'\u200b'});
            if (show_undecided) {
              if (undecidedList.length > 0) {
                embed.addFields({name: '⚠ __Not Voted Yet__', value: undecidedList+'\u200b'});
              } else {
                embed.addFields({name: '✅ __Voting__', value: all_voted});
              }
            }
            if (show_failed) {
              if (failedList.length > 0) {
                embed.addFields({name: "⛔️ __Failed to vote__", value: failedList+'\u200b'});
              } else {
                embed.addFields({name: "✅ __Voting__", value: all_voted});
              }
            }
            //embed.setTimestamp();
            embed.setFooter({text: footer_text, iconURL: footer_img});
            
            //message.channel.send({ embeds: [embed] });
            client.channels.cache.get(channel_id).send({ embeds: [embed] });
            loop_date = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
            console.log((show_date ? loop_date + " ":"") + `Loop - Automatic proposal message sent`);
          });
        } else {
          // Send embeded message
          const embed = new MessageEmbed()
          .setColor(0x5BFFD0)
          .setAuthor({ name: 'Cyber Republic DAO', iconURL: 'https://i.postimg.cc/13q2rng1/cr1.png', url: 'https://cyberrepublic.org' })
          .setTitle('Cyber Republic - Proposals')
          .setURL('https://www.cyberrepublic.org/proposals')
          .addFields({name: "There are currently no proposals in the council voting period", value: "\u200b"});
          //embed.setTimestamp();
          embed.setFooter({text: footer_text, iconURL: footer_img});
          
          // disabled upon request 30.12.2021
          //client.channels.cache.get(channel_id).send({ embeds: [embed] });
          //console.log((show_date ? loop_date + " ":"") + `Loop - No proposals active [${height}]`);
        }
        //loop_date = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
        console.log((show_date ? loop_date + " ":"") + `Loop - Finished, active proposals [${active.length}], height [${height}]`);
      }
    }, check_interval);
  } else {
    console.log('Loop already running');
  }
});

// Login to Discord with your client's token
client.login(token);

async function fetchWithTimeout(resource, options = {}) {
  const { timeout = 8000 } = options;
  
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  
  const response = await fetch(resource, {
    ...options,
    signal: controller.signal  
  });
  clearTimeout(id);
  
  return response;
}

async function blockHeight() {
  let height_params = {
    method: 'getcurrentheight'      
  };
  
  const height_request = await fetchWithTimeout(api_official, {
    timeout: 6000,
    method: 'POST',
    body: JSON.stringify(height_params),
    headers: {
        'Content-Type': 'application/json'
    }
  })
  .then(res => res.json())
  .then(json => height = json.result)
  .catch (err => console.log("Error in getcurrentheight"));
  //height = 1420585;
  return height;
}

async function getData(type) {
  let crc_params = "";
  if (type == "listcrproposalbasestate") {
    crc_params = {
      method: type,
      params: {
        "state": "registered"
      }
    };
  } else {
    crc_params = {
      method: type      
    };
  }
  
  const crc_request = await fetchWithTimeout(api_official, {
    timeout: 6000,
    method: 'POST',
    body: JSON.stringify(crc_params),
    headers: {
        'Content-Type': 'application/json'
    }
  })
  .then(res => res.json())
  .then(json => crc = json.result)
  .catch (err => console.log(`Error in ${type}`));
  return crc;
}

async function getDID(_did) {
  let api_params = {
    id: null,
    method: "did_resolveDID",
    params: [{
      did: `did:elastos:${_did}`,
    }]
  }
  
  const request = await fetchWithTimeout(eid_official, {
    timeout: 6000,
    method: 'POST',
    body: JSON.stringify(api_params),
    headers: {
        'Content-Type': 'application/json'
    }
  })
  .then(res => res.json())
  .then(json => crc = json.result)
  .catch (err => console.log(`Error in ${type}`));  
  return crc;
}

async function getName(_did) {
  let response = await getDID(_did);
  let name = '';
  try {
    let buff = new Buffer.from(response.transaction[0].operation.payload, 'base64');
    let payload = buff.toString();
    let payload_arr = JSON.parse(payload);
    
    let field = payload_arr.verifiableCredential.length - 1;
    name = payload_arr.verifiableCredential[field].credentialSubject.name;
  } catch {
    name = _did;
  }
  
  return name;
}

function getCRC(_id, _field) {
  let arr_found = crc_members.find(crc_member => crc_member.cr_id === _id);
  let value = 'Unknown';
  if (arr_found) {            
    value = arr_found[_field];
  }
  return value;
}