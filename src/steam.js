const auth = require("../data/auth.json"); // Grab the auth tokens
GAMES = require("../data/games.json"); // Grab game records
USERS = require("../data/users.json"); // Grab user records

const fs = require("fs"); // Package for file reading/writing

const SteamAPI = require('steamapi'); // Package for Steam
const { create } = require("domain");
const steam = new SteamAPI(auth["steam-token"]); // Create steam object

// Creates a user entry for a specific url
async function createUser(discord_ID, url) {
    user = {};
    
    // Attempt to fetch user ID
    console.log("Attempting to fetch steamID for: " + url);
    return_value = await steam.resolve(url).then(async function (id) {

        // Attempt to fetch user summary
        console.log("Attempting to fetch user summary for: " + id);
        info_promise = steam.getUserSummary(id).then((summary) => {

            // Update user's stats
            user["ID"] = summary["steamID"];
            user["url"] = summary["url"];
            user["nickname"] = summary["nickname"];

            return {status: true, msg: "Successfully retrieved user info"};
        }).catch((err) => { // Print errors
            console.log("createUser had an error on steam.getUserSummary(id)");
            console.log(err);

            return {status: false, msg: "Failed to retrieve user info"};
        });

        // Attempt to fetch user games
        console.log("Attempting to fetch user games for: " + id);
        games_promise = steam.getUserOwnedGames(id).then((games) => {
            
            // Organize games
            games_dict = {};
            for (x = 0; x < games.length; x++) {
                games_dict[games[x]["name"]] = {appID: games[x]["appID"]};
            }
            
            // Update user's games
            user["games"] = games_dict;

            // Call GAMES update
            updateGames(games_dict);

            return {status: true, msg: "Successfully retrieved user games"};
        }).catch((err) => { // Print errors
            console.log("createUser had an error on steam.getUserOwnedGames(id)");
            console.log(err);

            return {status: false, msg: "Failed to retrieve user games"}
        });

        info_promise = await info_promise;
        games_promise = await games_promise;
        
        // Make sure that both data requests worked
        if (info_promise.status && games_promise.status) {

            // Update the global variable USERS
            USERS[discord_ID] = user;
                    
            // Save USERS
            fs.writeFileSync("../data/users.json", JSON.stringify(USERS, null, 4));
            console.log("Saved users");

            return "Successfully added user";
        } else { // For all the failure areas
            if (!info_promise.status && games_promise.status) {
                return info_promise.msg;
            } else if (info_promise.status && !games_promise.status) {
                return games_promise.msg + "\nAre your games private/friends only? Bot will not work.";
            } else {
                return "Failed to retrieve both user info and games"
            }
        }
    }).catch((err) => {
        console.log("createUser had an error on steam.resolve(url)");
        console.log(err);

        return "Failed to find user\nCheck your steam url?";
    });

    return return_value;
}

// Compares two users libraries
async function compare(id1, id2) {
    if (id1 in USERS && id2 in USERS) { // Makes sure both users are in USERS
        both_games = {};
        for (game in USERS[id1]["games"]) { // Loop through all games in user 1
            if (game in USERS[id2]["games"]) { // Compare to user 2
                both_games[game] = USERS[id1]["games"][game]; // Add to output if they both have it
            }
        }
        return both_games;
    } else {
        return "Could not find users";
    }
}

// Sorts by genre
function genreSort(games) {
    genres = {};
    for (game in games) {
        if (games[game]["appID"] in GAMES) {
            for (x = 0; x < GAMES[games[game]["appID"]]["genres"].length; x++) {
                if (GAMES[games[game]["appID"]]["genres"][x]["description"] in genres) {
                    genres[GAMES[games[game]["appID"]]["genres"][x]["description"]].push(game);
                } else {
                    genres[GAMES[games[game]["appID"]]["genres"][x]["description"]] = [game];
                }
            }
        } else {
            console.log("Could not find %s in GAMES", game);
        }
    }
    return genres;
}

async function createGame(id, force=false) {
    if (id in GAMES && !force) {
        //console.log("Did not update because it exists and force is off");
    } else {
        await steam.getGameDetails(id).then((game) => {
            GAMES[id] = {
                name: game["name"],
                genres: game["genres"]};
            
            // Save GAMES
            fs.writeFileSync("../data/games.json", JSON.stringify(GAMES, null, 4));
            console.log("Saved games");

        }).catch((err) => {
            console.log("Had an error collecting game details for %s", id);
        });
    }
}

async function updateGames(games) {
    for (game in games) {
        createGame(games[game]["appID"]);
    }
}

module.exports = { createUser , compare, genreSort };

// createUser("55555", "https://steamcommunity.com/id/SwaggeringDragons/home/");