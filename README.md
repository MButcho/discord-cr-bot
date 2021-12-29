# Discord bot for Cyber Republic

## Installing bot

### Create application and a bot
Use https://discord.com/developers/applications

### Add bot to your server with following rights
+ Send Messages
+ Embed Links
+ Read Message History

### Clone repository
```bash
git clone https://github.com/MButcho/discord-cr-bot
```

### Install discord.js
```bash
npm install discord.js
npm install request
npm install node-fetch
```

### Create config.json in cloned folder
```json
{
	"token": "your_bot_token"
}
```

### Start bot
```bash
node index.js
```