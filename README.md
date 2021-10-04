# Steam-Discord-Bot
A bot to compare steam games, optionally other functionality

# Pre-Conditions
## The following is the environment I run it in:
* Windows 10 x64
* Node.js version 16.9.1
* npm version 7.21.1
## I used the following packages:
* discord.js version 13.1.0
* steamapi version 2.1.3

# Usage
## API keys
You will need to create both a [steam api key](http://steamcommunity.com/dev/apikey "steam api") and a [discord api key](https://discord.com/developers/docs/intro "discord developer portal"). Once you make these you will have to put them in /src/auth.json. 

Once that is set up, simply run the command node bot.js from the src directory.

## Installing packages
You might need to include versions if these get upgraded in the future.
* discord.js: ```npm install discord.js @discordjs/rest discord-api-types```
* steamapi: ```npm install steamapi```



# Bot Description
## Commands
The start of the command ">" can be replaced with any prefix placed in the /data/setting.json file.
* search: ">search \<URL\>" searches for your profile page using the steam url you provide. Saves information from this
to your discord ID (used in future commands).
* compare: ">compare @user" prints out all games in common with the @ed discord user.
* comparegenre: ">comparegenre @user" prints out all game genres in common with the @ed discord user.
  * This command is followed up by user entering a genre and then all games in common under that genre will print.

# About Project
I started this project because some friends always posted their steam libraries, as images, in the discord to find games they wanted to play together.
Even then, I don't think any one actually took the time to look through it all.
I thought I could create a bot to do this for them, as well as add some functionality, like outside-of-steam games, special filters, etc.

## Initial goals
 - [x] Discord bot that could respond to text commands.
 - [x] Retrieve games using Steam API.
 - [x] Store user games.
 - [ ] Display user games (may be added in the future, no purpose at the moment).
 - [x] Compare users with each other.