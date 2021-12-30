# Discord bot for Cyber Republic
Special thanks to @RyanC for letting me use his Telegram bot source @ https://github.com/racollette/elabot

## Installing bot

### Create application and a bot
Use https://discord.com/developers/applications

### Add bot to your server with following rights
#### Scope
+ bot
+ applications.commands

#### Bot Permissions
+ Send Messages
+ Managed Messages
+ Embed Links
+ Read Message History
### Clone repository
```bash
git clone https://github.com/MButcho/discord-cr-bot
```
### Install dependencies
```bash
npm install
```
### Create config.json in cloned folder
```json
{
  "token": "<your bot token>",
  "clientId": "<your application ID>",
  "guildId":  "<your server ID>"
}
```
### Register commands on server
```bash
node deploy-commands.js
```
### Start bot
```bash
node index.js
```
### Thank you and enjoy!

Any donation to ELA address EUSMsck3svNiacva9LfwrLfbvNnUU27z77 or mbutcho (CryptoName) is much appreciated.

