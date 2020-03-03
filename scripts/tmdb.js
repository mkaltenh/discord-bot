let methods = {};

const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest,
  tmdb = "https://api.themoviedb.org/3/",
  apiKey = "?api_key=e7c7bd78717187a5820b6d90edeab432";

function httpGet(theUrl){
    const xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
    xmlHttp.send( null );
    return xmlHttp.responseText;
}

methods = {
    // Get information about TV show from search query
    searchTvShow: function(query, lang, page){
      var myQuery = encodeURIComponent(query.trim()),
        lang = lang || "en-US",
        page = page || 1,
        request = tmdb +"search/tv"+ apiKey +"&language="+ lang +"&query="+ query +"&page=" + String(page);

      return JSON.parse(httpGet(request));
    },

    // Return amount of seasons
    getSeasonCount: function(id, lang){
      let lang = lang || "en-US",
        requestUrl = tmdb + "tv/" + String(id) + apiKey + "&language=" + lang,
        data = JSON.parse(httpGet(requestUrl)).seasons,
        latestSeason = 0;

      for(let item in data){
        if (data[item].season_number > latestSeason) {
          latestSeason = data[item].season_number;
        }
      }
      return latestSeason;
    },

    // Get trending TV Shows
    getPopularShows: function(){
      let request = tmdb + "tv/popular" + apiKey + "&language=en-US&page=1",
        data = JSON.parse(httpGet(request)),
        list = [];

      for (let item in data.results){
        console.log(data.results[item])
        list.push({"name":data.results[item].name, "genre":data.results[item].genre_ids});
      }
      list = list.slice(0,10);
      console.log(list);
      return list
    },

    // Return latest episode description
    getLatestEpisode: function(id, latest_season){
      let request = tmdb + "tv/" + id + "/season/" + latest_season + apiKey,
        date = new Date(),
        episode,
        data = JSON.parse(httpGet(request)).episodes;

      for(let item in data){
        let air_date = new Date(data[item].air_date);
        if((date - air_date) < 0){
          break;
        }
        else{
          episode = data[item];
        }
      }
      return episode;
    },

    // Get Link to TMDB
    getExternalIdTv: function(id){
      let request = tmdb + "tv/" + id + "/external_ids" + apiKey + "&language=en-US";
      return JSON.parse(httpGet(request));
    }
};

module.exports = methods;

/**
 * Example Usage
 */
// data = searchTvShow("Mr. Robot");
// console.log("tv_show_id", data.results[0].id);
// console.log("latest_season", getSeasonCount(data.results[0].id));
//console.log("latest_episode", getLatestEpisode("Mr. Robot").episode_number);
// console.log("popular", getPopularShows());
