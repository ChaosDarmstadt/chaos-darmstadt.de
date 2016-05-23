function $(id) {
    return document.querySelector(id);
}

window.onload = function() {
	 getHttpRequest();
	 setTimeout(() => {
     var xml = new XMLHttpRequest();
     xml.open("GET", "progress", true);
     xml.onreadystatechange = function() {
if(xml.readyState == 4) {
       var resp = xml.responseText.replace(/^\s+|\s+$/g, '') + "%";
       $('.progress').style.width = resp;
       $('#description-text').innerHTML = "Umzug at " + resp;
       $('#description-text').style.opacity = "1";
     }}
     xml.send();
 }, 500);

}

function getHttpRequest() {

    var xmlhttp = null;
    // Mozilla
    if (window.XMLHttpRequest) {
        xmlhttp = new XMLHttpRequest();
    }
    // IE
    else if (window.ActiveXObject) {
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }

    xmlhttp.open("GET", '//api.chaos-darmstadt.de/', true);
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.responseText == '1') {
            $('.status #ergebnis').innerHTML = 'Die Höhle ist <span class="status-open">offen</span>.';
        } else {
            $('.status #ergebnis').innerHTML = 'Die Höhle ist <span class="status-closed">geschlossen</span>.';
        }
    }
    xmlhttp.send(null);
}
