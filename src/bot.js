const auth = require("../data/auth.json"); // Grab the auth tokens
const settings = require("../data/settings.json"); // Grab the settings

const { Client, Intents, ContextMenuInteraction } = require('discord.js'); // for bot
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] }); // for bot

const steam = require ("./steam"); // Use my steam functions

WAITING_COMMANDS = {};

client.on("ready", () => {
    console.log("Logged in as: " + client.user.tag);
});

client.on("messageCreate", message => {
    if (message.author.bot) return; // Exit if the bot is the author

    
    if (message.content.substring(0,settings.prefix.length) == settings.prefix) { // Prefix of command
        content = message.content.substring(settings.prefix.length);
        console.log(content);
        command = content.substring(0, content.indexOf(" "));
        console.log(command);
        if (command == "search") {
            search(message);
        } else if (command == "add") {
            add(message);
        } else if (command == "compare") {
            compare(message);
        } else if (command = "comparegenre") {
            compareGenre(message);
        }
    } else {
        if (message.author.id in WAITING_COMMANDS) {
            WAITING_COMMANDS[message.author.id]["command"](message);
        }
    }
});

async function add(message) {
    tokens = message.content.split(" "); // Split message by space
    
    // Check if they @ someone
    returned = await steam.createUser(message.author.id, tokens[1]);
    message.channel.send(returned);
}

async function search(message) {
    tokens = message.content.split(" "); // Split message by space
    returned = await steam.createUser(message.author.id, tokens[1]);
    message.channel.send(returned);
}

async function compare(message) {
    tokens = message.content.split(" "); // Split message by space

    id1 = message.author.id;
    
    // Check to make sure that they @ someone
    if (tokens[1].substring(0,3) == "<@!") {
        id2 = tokens[1].substring(3, tokens[1].length - 1);
        console.log(id1);
        console.log(id2);
        games = await steam.compare(id1, id2);
        games = Object.keys(games)
        games.sort();
        games = games.join("\n"); // Return a string of games joined by new line
        message.channel.send(games.substring(0,1000) + "...");        
    } else {
        message.channel.send("Expected @user after command");
    }
}

async function compareGenre(message) {
    tokens = message.content.split(" "); // Split message by space

    id1 = message.author.id;
    
    // Check to make sure that they @ someone
    if (tokens[1].substring(0,3) == "<@!") {
        id2 = tokens[1].substring(3, tokens[1].length - 1);
        console.log(id1);
        console.log(id2);
        games = await steam.compare(id1, id2);
        genres = steam.genreSort(games);
        genres_keys = Object.keys(genres);
        genres_keys.sort();
        genres_keys = genres_keys.join(", ");
        WAITING_COMMANDS[id1] = {genres : genres, command: chooseGenre};
        message.channel.send("Enter a genre: " + genres_keys);        
    } else {
        message.channel.send("Expected @user after command");
    }
}

async function chooseGenre(message) {
    tokens = message.content.split(" "); // Split message by space (SHOULD ONLY HAVE 1 ENTRY)
    if (tokens[0] in WAITING_COMMANDS[message.author.id]["genres"]) {
        games = WAITING_COMMANDS[message.author.id]["genres"][tokens[0]];
        games.sort();
        games = games.join("\n");
        message.channel.send(games);
    }
}

async function help(message) {
    // TODO add help message
    message.channel.send("");

}

client.login(auth['bot-token']);