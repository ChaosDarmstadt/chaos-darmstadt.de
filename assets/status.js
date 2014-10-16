function $(id) {
    return document.getElementById(id);
}

window.onload = function() {
       getHttpRequest();
    }
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

    xmlhttp.open("GET", 'http://chaos.rainbownerds.de/api.html', true);
    xmlhttp.onreadystatechange = function() {
            $('.row #ergebnis').innerHTML = xmlhttp.responseText;
    }
    xmlhttp.send(null);
}
