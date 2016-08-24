//jsonÉtÉ@ÉCÉãÇÃì«Ç›çûÇ›
$(function(){
	httpObj = new XMLHttpRequest();
	httpObj.open("get", "./json/nishiguchi.json", true);
	httpObj.onload = function(){
	var myData = JSON.parse(this.responseText);
	//var txt = "";
	var cPano = "cPano";
	var aPano = "aPano";
	
	for (var i=0; i<myData.ano.length; i++){
		console.log(myData.ano[i]);
		if(myData.ano[i].val == cPano){
			var txt = "";
			txt = txt + "<a id=\"cPano\">" + myData.ano[i].name+"</a><br>";
			document.getElementById("pAno").innerHTML = txt;
		}
		if(myData.ano[i].val == aPano){
			var txt = "";
			txt = txt + "<a id=\"aPano" + myData.ano[i].id + "\" href=\"" + myData.ano[i].url + "\">" + myData.ano[i].name + "</a><br>";
			document.getElementById("aAno").innerHTML += txt;
		}
	}
	
	//document.getElementById("pAno").innerHTML = txt;
	}
	httpObj.send(null);
});
