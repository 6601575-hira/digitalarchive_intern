//jsonƒtƒ@ƒCƒ‹‚Ì“Ç‚İ‚İ

$(function() {
  $.getJSON("../../json/ekinaka.json" , function(data) {
    var len = data.length;
    var current = "cPano";
	console.log(data);
	document.getElementById("cPano").innerHTML="<a>data[i].name</a>";

	
	/*for(i=0; i<len; i++){
	    if(data[i].id == current){
	  		document.getElementById("cPano").innerHTML="<a>data[i].name</a>";
	    }
	}*/
  });
});

