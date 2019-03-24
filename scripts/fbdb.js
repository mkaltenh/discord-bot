var methods = {};
var competitions = require('../data/fbdb.json');

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
    var request = fbdb + 'v2/competitions',
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
      //id = competitions[shortname].id,
      id = competitions[shortname].id,
      request = fbdb + '/v2/competitions/' + id +'/standings',
      data = JSON.parse(httpGet(request));
    return data;
  },

  buildTable: function(data){
    const { createCanvas, loadImage } = require('canvas')
    const canvas = createCanvas(200, 200)
    const ctx = canvas.getContext('2d')
    var y = 30

    const addTeam = function(obj){
      // Write "Awesome!"
      ctx.font = '10px Arial'
      ctx.fillStyle = "#ffffff";
      ctx.fillText(obj.text, 50, y)
      y += 10
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(200, y);
      ctx.strokeStyle = "#FFFFFF";
      ctx.lineWidth = 1;
      ctx.stroke();
      y += 15
      console.log(obj.img)

      const myimg = loadImage(obj.img)

      myimg.then(() => {
        // do something with image
        ctx.drawImage(myimg, 50, 0, 70, 70)
      }).catch(err => {
        console.log('oh no!', err)
      })
    }

    addTeam({ text: "Ajax", img: "http://upload.wikimedia.org/wikipedia/de/7/79/Ajax_Amsterdam.svg"})

    img = canvas.toDataURL().replace(/^data:image\/png;base64,/, "")
    return img
  }
}

module.exports = methods;
