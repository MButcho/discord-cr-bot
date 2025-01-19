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
+ Embed Links
+ Read Message History
### Clone repository
```bash
git clone https://github.com/MButcho/discord-cr-bot
```
### Install latest NodeJS
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```
More on https://github.com/nodesource/distributions/blob/master/README.md#debinstall
### Install dependencies
```bash
npm install
npm install discord.js

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
# Donations

Any donation to BTC LN address **tipme@walletofsatoshi.com** will be appreciated.

### Thank you and enjoy!

