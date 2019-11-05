const botConfig = require('./botconfig.json');
const colors = require('./colors.json');
const Discord = require('discord.js');
const bot = new Discord.Client({ disableveryone: true });
const fs = require('fs');

var events = {
    current: []
};
fs.readFile('events.json', 'utf8', function readFileCallback(err, data) {
    if (err) {
        console.log(err);
    } else {
        events = JSON.parse(data); //now it an object
    }
});

bot.on('ready', async() => {
    console.log('This bot is online');
    bot.user.setActivity("!", { type: "LISTENING" });
});

bot.on('message', async message => {

    let prefix = botConfig.prefix;
    let messageArray = message.content.split(" ");
    let cmd = messageArray[0];
    let args = messageArray;

    switch (cmd) {
        case `${prefix}`:
            let sEmbed = new Discord.RichEmbed()
                .setColor(colors.red)
                .setTitle("Bot Help")
                // .addBlankField()
                .setDescription("**COMMANDS**\n" +
                    "You can also get more help in the help section start here " + message.guild.channels.get('639619273765158981').toString() +
                    "\n\ntest")
                .addField("**Event Commands**", "", false)
                .addField("**!events**", "Shows a list of events", true)
                .addField("**!eventadd**", "Shows a list of events", true)
                .addField("**!eventedit**", "Shows a list of events", true)
                .addField("**!eventdelete**", "Shows a list of events", true)
                .addField("**!eventhelp**", "Shows a list of events", true)
                .addField("**!eventnotify**", "Shows a list of events", true)
                .addBlankField()
            message.channel.send({ embed: sEmbed });
            break;
        case `${prefix}events`:

            if (events.length === 0) {
                console.log("No data");
                message.channel.send("No events at the moment");
            } else {

                events.current.forEach(x => {
                    var name = camelcaseSpacer(x.name);

                    var sEmbed = new Discord.RichEmbed()
                        .setColor(colors.lightgreen)
                        .addField("**Event Name**", name, true)
                        .addField("**Start Date**", x.start, true)
                        .addField("**End Date**", x.end, true)
                    message.channel.send({ embed: sEmbed });
                });
            }
            break;
        case `${prefix}eventadd`:
            var name = args[1];
            var startday = args[2];
            var startmonth = args[3];
            var start = `${startday} ${startmonth}`;
            var endday = args[4];
            var endmonth = args[5];
            var end = `${endday} ${endmonth}`;

            if (!args[1]) {
                message.reply("Please enter the event details");
            } else {

                fs.readFile('events.json', 'utf8', function readFileCallback(err, data) {
                    if (err) {
                        console.log(err);
                    } else {
                        events = JSON.parse(data); //now it an object
                        events.current.push({ name: `${name}`, start: `${start}`, end: `${end}` }); //add some data
                        json = JSON.stringify(events); //convert it back to json
                        fs.writeFile('events.json', json, 'utf8', function(err) {
                            if (err) {
                                console.log(err);
                            }
                            console.log("Added New Event ");
                        }); // write it back 
                    }
                });
                message.channel.send(` **New Event Added**\nName: ${name}\nStart: ${start}\nEnd: ${end}`);
            }
            break;
        case `${prefix}eventedit`:




            break;
        case `${prefix}eventdelete`:

            if (!args[1]) {
                message.reply("Please enter the name of the event you want to delete");
            } else {

                fs.readFile('events.json', 'utf8', function readFileCallback(err, data) {
                    if (err) {
                        console.log(err);
                    } else {
                        events = JSON.parse(data); //now it an object
                        for (var i = events.current.length - 1; i >= 0; i--) {
                            if (events.current[i].name == args[1]) {
                                events.current.splice(i, 1);
                                break;
                            }
                        }
                        json = JSON.stringify(events); //convert it back to json
                        fs.writeFile('events.json', json, 'utf8', function(err) {
                            if (err) {
                                console.log(err);
                            }
                            console.log("Event Deleted");
                        }); // write it back 
                    }
                });
            }

            break;
        case `${prefix}eventhelp`:




            break;
        case `${prefix}eventnotify`:




            break;
        case `${prefix}backupserver`:
            backup(message.sender);
            break;
    }
});

bot.login(botConfig.token);

// Functions

function backup(sender) {
    var json = JSON.stringify(events);
    fs.writeFile("events.json", json, "utf8", function(err) {
        if (err) {
            console.log(err);
        }
        console.log("Backup Complete");
    });
}

function camelcaseSpacer(string) {
    let ret = string.replace(/([a-z0-9])([A-Z])/g, '$1 $2');
    return ret;
}