var methods = {};

var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest,
  tmdb = "https://api.themoviedb.org/3/",
  apiKey = "?api_key=e7c7bd78717187a5820b6d90edeab432";

function httpGet(theUrl){
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
    xmlHttp.send( null );
    return xmlHttp.responseText;
}

var methods = {
    searchTvShow: function(query, lang, page){
      var myQuery = encodeURIComponent(query.trim()),
        lang = lang || "en-US",
        page = page || 1,
        request = tmdb +"search/tv"+ apiKey +"&language="+ lang +"&query="+ query +"&page=" + String(page);

      return JSON.parse(httpGet(request));
    },

    getSeasonCount: function(id, lang){
      var lang = lang || "en-US",
        requestUrl = tmdb + "tv/" + String(id) + apiKey + "&language=" + lang,
        data = JSON.parse(httpGet(requestUrl)).seasons,
        latestSeason = 0;

      for(item in data){
        if (data[item].season_number > latestSeason) {
          latestSeason = data[item].season_number;
        }
      }
      return latestSeason;
    },

    getPopularShows: function(){
      var request = tmdb + "tv/popular" + apiKey + "&language=en-US&page=1",
        data = JSON.parse(httpGet(request)),
        list = [];

      for (item in data.results){
        list.push({"name":data.results[item].name, "genre":data.results[item].genre_ids});
      }
      list = list.slice(0,10);
      console.log(list);
      return list
    },

    getLatestEpisode: function(id, latest_season){
      // var show = searchTvShow(show_name).results[0].id,
      //   season = getSeasonCount(show),
      var request = tmdb + "tv/" + id + "/season/" + latest_season + apiKey,
        date = new Date(),
        episode;
        data = JSON.parse(httpGet(request)).episodes;

      for(item in data){
        var air_date = new Date(data[item].air_date);
        if((date - air_date) < 0){
          break;
        }
        else{
          episode = data[item];
        }
      }
      return episode;
    },

    getExternalIdTv: function(id){
      var request = tmdb + "tv/" + id + "/external_ids" + apiKey + "&language=en-US";
      return JSON.parse(httpGet(request));
    }
};

module.exports = methods;
// data = searchTvShow("Mr. Robot");
// console.log("tv_show_id", data.results[0].id);
// console.log("latest_season", getSeasonCount(data.results[0].id));
//console.log("latest_episode", getLatestEpisode("Mr. Robot").episode_number);
// console.log("popular", getPopularShows());
