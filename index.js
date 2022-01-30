require("dotenv").config()
const {MessageEmbed} = require("discord.js")
const discord = require("discord.js")

const client = new discord.Client({
    intents: 32767
})

const redis = require('quickredis-db')
const db = redis.createClient(process.env.redis)
db.once("ready", () => {
    console.log("Connected to Redis!")
})
client.on("ready", () => {
    console.log("Connected to Discord!")
})

let servid = client.guilds.cache.get('930503731974385694');
client.on("guildMemberAdd", m => {
    db.set(`${m.id}_joined`, 'true')
    const user = new MessageEmbed()
    .setTitle("Welcome to Chat And Chill")
    .setDescription("Welcome to Chat And Chill!\nI am the friendly achievement bot that manages achievements for Chat And Chill!\nWow, looks like you already got your first one, impressive!\n**Achievement obtained: Welcome!**\nJoin the server, rarity: common")
    .setColor("PURPLE")

    try {
        m.user.send({
            embeds: [user]
        })
    } catch {
        console.log("Failed to DM" + m.tag)
    }

    const server = new MessageEmbed()
    .setTitle("Achievement obtained!")
    .setDescription(m.user.tag + "Just obtained the achivement: **Welcome**!\nObtained for joining the server, rarity: common")
    .setColor("DARK_PURPLE")
    
    client.channels.cache.get('936678943845654638')
    .send({
        embeds: [server]
    })

    db.add(`${m.id}_achivements`, 1)
})
client.on("guildMemberRemove", async m => {
    db.delete(`${m.id}_joined`)
    db.set(`${m.id}_achivements`, 0)
    const omo = await db.get(`${m.id}_omoSent`)
    if(omo === "true") {
        db.delete(`${m.id}_omoSent`)
    }

    const msgc = await db.get(`${m.id}_messages`)

    if(msgc > 25) {
        db.delete(`${m.id}_25msgs`)
    }
})

//text based achivements and cmd

client.on("messageCreate", async msg => {
    if(msg.channel.id === "930503731974385697") {
        db.add(`${msg.author.id}_messages`, 1)
        const numMsgs = await db.get(`${msg.author.id}_messages`)
        if (numMsgs > 25) {
            const twentyfivemsgsalr = await db.get(`${msg.author.id}_25msgs`)
            if(twentyfivemsgsalr === "true") {
                return;
            } else {
            db.add(`${msg.author.id}_achivements`, 1)
            db.set(`${msg.author.id}_25msgs`, 'true')
            msg.member.roles.add("936929715422371921")
            const servMsg = new MessageEmbed()
            .setTitle("Achievement obtained!")
            .setDescription(msg.author.tag + "Just obtained the achivement: **Kinda active**!\nObtained for sending 25 messages in <#930503731974385697>, rarity: uncommon")
            .setColor("DARK_PURPLE") 
            
            client.channels.cache.get('936678943845654638')
            .send({
                embeds: [servMsg]
            })

            const userMsg = new MessageEmbed()
            .setTitle("Well done!")
            .setDescription("Congratulations, you got another achivement: **Kinda active**!\nObtained for sending 25 messages in <#930503731974385697>, rarity: uncommon")
            .setFooter("GG")
            .setColor("PURPLE")

            try {
                msg.author.send({
                    embeds: [userMsg]
                })
            } catch {
                console.log("Failed to DM" + msg.author.tag)
            }
           }
        }
    }
})
client.on("messageCreate", async msg => {
    if(msg.channel.id === "930503731974385697") {
        if(msg.author.bot) return;
        const numMsgs = await db.get(`${msg.author.id}_messages`)
        if (numMsgs > 50) {
            const fiftymsgsalr = await db.get(`${msg.author.id}_50msgs`)
            if(fiftymsgsalr === "true") {
            } else {
            db.add(`${msg.author.id}_achivements`, 1)
            db.set(`${msg.author.id}_50msgs`, 'true')
            msg.member.roles.add("936929715422371921")
            const servMsg3 = new MessageEmbed()
            .setTitle("Achievement obtained!")
            .setDescription(msg.author.tag + "Just obtained the achivement: **Semi active**!\nObtained for sending 50 messages in <#930503731974385697>, rarity: uncommon")
            .setColor("DARK_PURPLE") 
            
            client.channels.cache.get('936678943845654638')
            .send({
                embeds: [servMsg3]
            })

            const userMsg3 = new MessageEmbed()
            .setTitle("Well done!")
            .setDescription("Congratulations, you got another achivement: **Semi active**!\nObtained for sending 50 messages in <#930503731974385697>, rarity: uncommon")
            .setFooter("GG")
            .setColor("PURPLE")

            try {
                msg.author.send({
                    embeds: [userMsg3]
                })
            } catch {
                console.log("Failed to DM" + msg.author.tag)
            }
           }
        }
    }
})
client.on("messageCreate", async msg => {
    if(msg.content.startsWith("_count")) {
        var u = msg.mentions.users.first()
        if (!u) u = msg.author
        var c = await db.get(`${u.id}_achivements`)
        if(c === null) c = "0"
            const e = new MessageEmbed()
            .setTitle("Achivement count")
            .setDescription(u.tag + ` has ${c} achivements!`)
            .setColor("DARK_BLUE")
    
            msg.reply({
                embeds: [e]
            })

    } else {
        if (msg.content.startsWith("_eval")) {
            const args = msg.content.split(" ").slice(1);
            const evalers = ["593696963061481532", "689173890450194434"]
            if(!evalers.includes(msg.author.id)) return msg.reply("Permission denied!")
            try {
                eval(args.join(" "));
                msg.channel.send("Done")
              } catch (err) {
                msg.channel.send("An error occoured" + "\`\`\`\n"+err+"\n\`\`\`" );
              }
        } else {
            if(msg.content === "_achievements") {
                var joined = await db.get(`${msg.author.id}_joined`)
                if(joined === null) joined = "false"
                var msgsSent = await db.get(`${msg.author.id}_messages`)
                if(msgsSent === null) msgsSent = "0"
                var sent25msgs = await db.get(`${msg.author.id}_25msgs`)
                if(sent25msgs === null) sent25msgs = `No (${msgsSent}\/25)`
                var sent50msgs = await db.get(`${msg.author.id}_50msgs`)
                if(sent50msgs === null) sent50msgs = `No (${msgsSent}\/50)`
                var omo = await db.get(`${msg.author.id}_omoSent`)
                if (omo === null) omo = "No (change that by sending a message in <#934082965774925824>)"
                var c = await db.get(`${msg.author.id}_achivements`)
                if(c === null) c = "0";
                var countSent = await db.get(`${msg.author.id}_counts`)
                if(countSent === null) countSent = '0';
                var sent50count = await db.get(`${msg.author.id}_50counts`)
                if(sent50count === null) sent50count = `No (${countSent}/50)`

                var sent50count = await db.get(`${msg.author.id}_50counts`)
                if(sent50count === null) sent50count = `No (${countSent}/50)`


                const e = new MessageEmbed()
                .setTitle("Your achivements")
                .setDescription(`Joined: ${joined}\nMessages sent: ${msgsSent}\nSent 25 messages: ${sent25msgs}\nSent 50 messages: ${sent50msgs}\nSent a message in one message only: ${omo}\nCounted 50 numbers: ${sent50count}\nTotal obtained: ${c}`)
                .setColor("DARK_BLUE")

                msg.reply({
                    embeds: [e]
                })
            } else {
                if(msg.content === "_achivements"){
msg.reply("It's _achievements")
                }
    } 
}
    }



})

client.on("messageCreate", msg => {
    if(msg.channel.id === "934082965774925824") {
            db.add(`${msg.author.id}_achivements`, 1)
            db.set(`${msg.author.id}_omoSent`, 'true')

            const servMsg2 = new MessageEmbed()
            .setTitle("Achivement obtained!")
            .setDescription(msg.author.tag + "Just obtained the achivement: **One message**!\nObtained for sending a message in <#934082965774925824>, rarity: common")
            .setColor("DARK_PURPLE")

            client.channels.cache.get('936678943845654638')
            .send({
                embeds: [servMsg2]
            })

            const userMsg2 = new MessageEmbed()
            .setTitle("Well done!")
            .setDescription("Congratulations, you got another achivement: **One message**!\nObtained for sending a message in <#934082965774925824>, rarity: common")
            .setColor("PURPLE")

            try {
                msg.author.send({
                embeds: [userMsg2]
                })
            } catch {
                console.log("Failed to DM " + msg.author.tag)
            }
    }
})
client.on("messageCreate", async msg => {
    if(msg.channel.id === "931612320222838825") {
         
          await  db.add(`${msg.author.id}_counts`, 1)
        const numCount = await db.get(`${msg.author.id}_counts`)
        if (numCount >= 50) {
            const fiftycountalr = await db.get(`${msg.author.id}_50counts`)
            if(fiftycountalr === "true") {
                return;
            }  else {
                const servMsg4 = new MessageEmbed()
                .setTitle("Achivement obtained!")
                .setDescription(msg.author.tag + " Just obtained the achivement: **Intermediate Counter**!\nObtained for counting 50 numbers in <#931612320222838825>, rarity: uncommon")
                .setColor("DARK_PURPLE")
                await   db.add(`${msg.author.id}_achivements`, 1)
                db.set(`${msg.author.id}_50counts`, 'true')
                msg.member.roles.add("937312047069298718")
                client.channels.cache.get('936678943845654638')
                .send({
                    embeds: [servMsg3]
                })
    
                const userMsg4 = new MessageEmbed()
                .setTitle("Well done!")
                .setDescription("Congratulations, you got another achivement: **Intermediate Counter**!\nObtained for counting 50 numbers in <#931612320222838825>, rarity: uncommon")
                .setColor("PURPLE")
    
                try {
                    msg.author.send({
                    embeds: [userMsg3]
                    })
                } catch {
                    console.log("Failed to DM " + msg.author.tag)
                }
            }
        } 
            
    }
})
client.login(process.env.token)
