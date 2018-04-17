BasicGame.Point=function(x,y){
	this.x=x;
	this.y=y;
};
BasicGame.setOffsetCentre = function(sprte, y) {
  sprte.fixedToCamera=true;
	sprte.cameraOffset.setTo(this.game.camera.width/2 - (sprte.width/2), this.game.camera.height/2 + y);
};
BasicGame.setOffsetFromCentre = function(sprte, x, y) {
  sprte.fixedToCamera=true;
	sprte.cameraOffset.setTo(this.game.camera.width/2 - (sprte.width/2) + x, this.game.camera.height/2 - (sprte.height/2) + y);
};
BasicGame.getRandomInt= function(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};
BasicGame.getPointsCoins=function(lenght){
  let varx=(this.maxCoinX-this.minCoinX)/3;
  let vary=(this.maxCoinY-this.minCoinY)/3;
  var points=[];
  for(let i=0;i<3;i++){
    for(let j=0;j<3;j++){
      if(this.getRandomInt(0,1)){
        let x=this.getRandomInt(this.minCoinX+(i*varx),this.minCoinX+((i+1)*varx)-100);
        let y=this.getRandomInt(this.minCoinY+(j*vary),this.minCoinY+((j+1)*vary)-100);
        points.push(new BasicGame.Point(x,y));
      }
    }
  }
  return points;
};
BasicGame.incrementScore=function(increment){
  this.score=this.score+increment;
  console.log('score:'+this.score);
  //call service
};
BasicGame.updateTimeGame=function(timeUpdate){
	this.timeGame+=timeUpdate;
}
BasicGame.gameOver=function(that){
	this.lives--;
  this.sendGamerScoreApi(this.timeGame);
  this.score=0;
	this.timeGame=0;
	that.state.start('MainMenu');
  console.log('score:'+this.score);
};
BasicGame.createCORSRequest =function(method, url) {
  var xhr = new XMLHttpRequest();
  if ("withCredentials" in xhr) {
    // XHR for Chrome/Firefox/Opera/Safari.
    xhr.open(method, url, true);
  } else if (typeof XDomainRequest != "undefined") {
    // XDomainRequest for IE.
    xhr = new XDomainRequest();
    xhr.open(method, url);
  } else {
    // CORS not supported.
    xhr = null;
  }
  return xhr;
};
BasicGame.makeApiRequest=function(url,params,method,callback) {
  var xhr = this.createCORSRequest(method,this.hostApi+url);//GET, POST ,etc
  if (!xhr) {
    console.log('CORS not supported');
    return;
  }
  // Response handlers.
  xhr.onload = function() {
    var text = xhr.responseText;
    callback(text);
  };
  xhr.onerror = function() {
    console.log('Woops, there was an error making the request.');
  };
  xhr.setRequestHeader('Authorization', 'Token '+BasicGame.tokenAuth);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.send(JSON.stringify(params));
};
BasicGame.callActivityGetLive=function(){
  if(window.Android){
      console.info("android");
       window.Android.openGetLives();
  }
  else{
      console.info("web");
  }
};
BasicGame.callActivityExitGame=function(){
  if(window.Android){
      console.info("android");
       window.Android.exitGame();
  }
  else{
      console.info("web");
  }
};
BasicGame.getJsonFromUrl=function(url) {
  var query = url.split("?")[1];
  var result = {};
  query.split("&").forEach(function(part) {
    var item = part.split("=");
    result[item[0]] = decodeURIComponent(item[1]);
  });
  return result;
};
BasicGame.sendGamerScoreApi=function(timeGame){
  //var timeGame=this.timerPlayer.ms;
  var arc=((Math.PI/2)-Math.atan(timeGame/100000));
  var puntaje=arc*0.63661977236+this.score;
  console.log("timeGame:"+timeGame);
  console.log("score:"+puntaje);
  var params={
    challenge:this.idReto,
    score:puntaje
  };
  var callbackScore=function(jsonResp){
    console.log(jsonResp);
  }
  this.makeApiRequest(this.urlApi,params,'POST',callbackScore);
};
