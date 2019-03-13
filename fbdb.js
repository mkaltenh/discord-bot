var methods = {};
var competitions = require('./fbdb.json');

var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest,
  fbdb = 'http://api.football-data.org/',
  apiKey = '55752014bb1b49e8bd1524245a548bc8';

function httpGet(theUrl){
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
    xmlHttp.setRequestHeader('X-Auth-Token', apiKey);
    xmlHttp.send( null );
    return xmlHttp.responseText;
}

var methods = {
  getAllCompetitions: function(){
    var request = fbdb + 'v1/competitions',
      data = JSON.parse(httpGet(request)),
      comp_list = [];
    for(item in data){
      var name = data[item].caption,
        id = data[item].id;
      comp_list.push({"name" : name ,"id" : id});
    }
    return comp_list;
  },

  getLeagueTable: function(shortname){
    var name = competitions[shortname].name,
      id = competitions[shortname].id,
      request = fbdb + '/v1/competitions/' + id +'/leagueTable',
      data = JSON.parse(httpGet(request));
    return data;
  }
}

module.exports = methods;
