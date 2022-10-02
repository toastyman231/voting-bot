# voting-bot
Recently a user in a Discord server I'm in suggested making a bot that would let us create polls so we could vote on various things. 
I've always been intrigued by discord bots, and this seemed simple enough, so I decided to give it a try. 
This is what I created. It's a little buggy, so feel free to contribute!

# How to Use
Simply run the following command:
```console:
/create-vote <prompt> <option1> <option2> <option3> <option4>
```
The prompt and first two options to vote on are mandatory, and the second two options are optional.
Once the poll is generated, just click on a button to cast your vote.
Currently you can only vote on each poll once, changing your vote is not supported.

# How to Host Your Own Voting Bot
1. Install node.js and npm. I recommend at least node version 16.x, as that is the only version I have confirmed it works on.
2. Clone the repository somewhere. You will need a server to host it on, there are plenty of options available online such as Amazon Web Services and Google Compute Engine.
3. Set up your Discord Application.
    1. Go to [https://discord.com/developers](https://discord.com/developers) and log in.
    2. Create a new application for your bot, and navigate to the 'Bot' section.
    3. Take a note of your token, which can be found near the bot name and icon. If you forget it and navigate away, you will need to regenerate this.
    4. Go to the OAuth2 section, and take a note of the Client ID.
4. Go to wherever you cloned the repository, and create a new file called .env
    1. Write the following and then save the file:
```console:
DISCORD_TOKEN="Your token here" 
CLIENT_ID="Your client id here"
```
5. If you do not have node_modules in the bot folder already, run npm install in that folder.
6. Run the following command in the bot folder to set up the commands list:

```console: 
> node deploy-commands.js
```
7. Run the following command in the bot folder to turn the bot on:
```console:
> node index.js
```
8. Return to your Discord Developer portal, and go to OAuth2, then URL Generator.
    1. For scopes, choose bot and applications.commands
    2. For permissions, choose Send Messages and Read Messages/View Channels
    3. Copy the generated link
9. Go to the link you copied, and invite the bot to any servers you own/moderate.
10. Enjoy!
