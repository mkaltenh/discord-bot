const Discord = require('discord.js');
const tmdb = require('./tmdb.js');
const fbdb = require('./fbdb.js');
const ytdl = require('ytdl-core');
const client = new Discord.Client();
var auth = require('./auth.json');
var tmdb_logo ="https://www.themoviedb.org/static_cache/v4/logos/208x226-stacked-green-9484383bd9853615c113f020def5cbe27f6d08a84ff834f41371f223ebad4a3c.png"

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
  //message = msg.content.split(" ");
  message = msg.content.split(/ (.*)/)
  if (message[0] === '/ping') {
    msg.reply('pong');
    msg.reply(message[1]);
  }
  if (message[0] === '/about'){
    msg.reply('Bob der Baumeister Version 0.1');
  }
  if (message[0] === '/help'){
    msg.reply('Bob der Baumeister Help');
  }
  if(message[0] === '/tv' && message[1]){
    data = tmdb.searchTvShow(message[1]);
    imdb = "https://www.imdb.com/title/" + tmdb.getExternalIdTv(data.results[0].id).imdb_id;
    poster = 'https://image.tmdb.org/t/p/w260_and_h390_bestv2' + data.results[0].poster_path;
    popularity = parseFloat(parseFloat(data.results[0].popularity).toFixed(2))
    const embed = new Discord.RichEmbed()
      .setAuthor(data.results[0].name,"",imdb)
      .setColor(6236315)
      .setDescription(data.results[0].overview)
      .setFooter("Votes " + data.results[0].vote_count + " Score " + data.results[0].vote_average + " Popularity " + popularity, tmdb_logo)
      .setThumbnail(poster)
    msg.reply({embed});
  }
  if (message[0] === '/tv/current' && message[1]){
    data = tmdb.searchTvShow(message[1]);
    poster = 'https://image.tmdb.org/t/p/w260_and_h390_bestv2' + data.results[0].poster_path;
    id = data.results[0].id;
    season = tmdb.getSeasonCount(id);
    episode = tmdb.getLatestEpisode(id, season);
    console.log(episode);
    image = "https://image.tmdb.org/t/p/original" + episode.still_path;
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
    data = tmdb.getPopularShows();
    const embed = new Discord.RichEmbed()
      .setTitle("Popular TV Shows")
      .setColor(6236315)
    for(item in data){
      embed.addField(data[item].name, data[item].genre);
    }
    msg.reply({embed});
  }
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
  if(message[0] === '/sport') {
    console.log('loading');
    console.log(fbdb.getLeagueTable('buli'));
  }
});

client.login(auth.token);
