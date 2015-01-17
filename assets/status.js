function $(id) {
    return document.querySelector(id);
}

window.onload = function() {
	 getHttpRequest();
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

    xmlhttp.open("GET", 'http://api.chaos-darmstadt.de/', true);
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.responseText == '1') {
            $('.row #ergebnis').innerHTML = 'Die Höhle ist offen.';
        } else {
            $('.row #ergebnis').innerHTML = 'Die Höhle ist geschlossen.';
        }
    }
    xmlhttp.send(null);
}
