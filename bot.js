const Discord = require('discord.js');
const tmdb = require('./scripts/tmdb.js');
const fbdb = require('./scripts/fbdb.js');
const ytdl = require('ytdl-core');
const client = new Discord.Client();
const auth = require('./data/auth.json');
const attachment = new Discord.Attachment('./img/tmdb.png', 'tmdb.png');
const tmdb_logo ="./img/favicon.jpg";
const fs = require('fs');

// On Ready function at startup of Bot
client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

// On Message functions triggered by user
client.on('message', msg => {
    /**
     * Basic Commands
     */
    let message = msg.content.split(/ (.*)/);
    if (message[0] === '/ping') {
        msg.reply('pong');
        msg.reply(message[1]);
    }
    if (message[0] === '/version') msg.reply('Version 0.1');
    if (message[0] === '/help') msg.reply('Chutulu Bot Help');

    /**
     * TV Show Information pulled from TMDB
     */
    if(message[0] === '/tv' && message[1]){
        try{
            let data = tmdb.searchTvShow(message[1]);
            let imdb = "https://www.imdb.com/title/" + tmdb.getExternalIdTv(data.results[0].id).imdb_id;
            let poster = 'https://image.tmdb.org/t/p/w260_and_h390_bestv2' + data.results[0].poster_path;
            let popularity = parseFloat(parseFloat(data.results[0].popularity).toFixed(2));
            const embed = new Discord.RichEmbed()
                .setAuthor(data.results[0].name,"",imdb)
                .setColor(6236315)
                .setDescription(data.results[0].overview)
                .attachFile(attachment)
                .setFooter("Votes " + data.results[0].vote_count + " Score " + data.results[0].vote_average + " Popularity " + popularity, 'attachment://tmdb.png')
                .setThumbnail(poster)
            msg.reply({embed});
        }
        catch(err){
            console.error(err);
        }
    }
    if (message[0] === '/tv/current' && message[1]){
        let data = tmdb.searchTvShow(message[1]);
        let poster = 'https://image.tmdb.org/t/p/w260_and_h390_bestv2' + data.results[0].poster_path;
        let id = data.results[0].id;
        let season = tmdb.getSeasonCount(id);
        let episode = tmdb.getLatestEpisode(id, season);
        let image = "https://image.tmdb.org/t/p/original" + episode.still_path;
        const embed = new Discord.RichEmbed()
            .setTitle("S" + episode.season_number + "E" + episode.episode_number + " - " + episode.name)
            .setColor(6236315)
            .setDescription(episode.overview)
            .addField("Air Date", episode.air_date, true)
            .setImage(image)
            .setThumbnail(poster)
            .setFooter("Votes " + episode.vote_count + " Score " + episode.vote_average, tmdb_logo)
        msg.reply({embed});
    }
    if (message[0] === '/tv/popular') {
        let data = tmdb.getPopularShows();
        const embed = new Discord.RichEmbed()
            .setTitle("Popular TV Shows")
            .setColor(6236315);
        for(let item in data){
            embed.addField(data[item].name, data[item].genre);
        }
        msg.reply({embed});
    }
    /**
     * Handle Audio playback
     * 
     * @param message Audio to play (either file or youtube link)
     */
    if (message[0] === '/play' && message[1]) {
        if (!msg.guild) return;
        // Only try to join the sender's voice channel if they are in one themselves
        if (msg.member.voiceChannel) {
            msg.member.voiceChannel.join()
                .then(connection => { // Connection is an instance of VoiceConnection
                    if(message[1].includes('youtube')){
                        if (connection.dispatcher) connection.dispatcher.end();
                        const dispatcher = connection.playStream(ytdl(message[1], { filter: 'audioonly', quality: 'highestaudio' }));
                        dispatcher.once('end', () => {
                            connection.disconnect();
                        });
                    }
                    else{
                        connection.playFile('./sounds/' + message[1] +'.mp3').on('end', () => {
                            connection.disconnect();
                        });
                    }
                })
                .catch(console.log);
        } else {
            msg.reply('You need to join a voice channel first!');
        }
    }
    if(message[0] === '/stop') {
        if(msg.member.voiceChannel){
            msg.member.voiceChannel.leave();
        }
    }

    /**
     * Display Champions League Information from FBDB
     */
    if(message[0] === '/cl/group') {
        let groupId = message[1].toUpperCase()
        let res = fbdb.getLeagueTable('cl')
        let table = []

        for(let item in res.standings){
            if (res.standings[item].group == "GROUP_" + groupId && res.standings[item].type == "TOTAL"){
                table = res.standings[item].table
            }
        }

        let img = fbdb.buildTable(table)
        fs.writeFile('./temp/table.png', img, 'base64', (err) => {
            if (err) throw err;
            const att = new Discord.Attachment('./temp/table.png', 'table.png');
            const embed = new Discord.RichEmbed()
                .setTitle("Champions League - Group " + groupId)
                .setColor(51283)
                .attachFile(att)
                .setImage('attachment://table.png')
                .setFooter("UEFA Champions League")
            msg.reply({ embed });
        });
    }
});

client.login(auth.token);
