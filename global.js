const webservicesurl = "https://cdcespon.github.io/intranetdemo//WebServices/"
const resourcesurl = "https://cdcespon.github.io/intranetdemo//Resources/"
const localurl = "https://cdcespon.github.io/intranetdemo/"
const webapiurl= "http://localhost:5696/"


function getData(serviceUrl, jsonData, isAsync, beforeSendCallback, successCallback, errorCallback, completeCallback) {

    $.ajax({
        url: webservicesurl + serviceUrl,
        data: jsonData,
        type: 'POST',
        dataType: 'json',
        async: isAsync,
        crossdomain: true,
        beforeSend: beforeSendCallback,
        success: successCallback,
        error: errorCallback,
        complete: completeCallback,
    });
}

function getURLParameter(name) {
    return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search) || [null, ''])[1].replace(/\+/g, '%20')) || null;
}


function loadScripts(group) {
    var res = group.split(',')
    for (var i = 0; i < res.length; i++) {
        switch (res[i]) {
            case 'login':
                $('body').append('<script type="text/javascript" src="Scripts/login.js"/>');
                $('body').append('<script type="text/javascript" src="' + localurl + 'Scripts/MD5.js"/>');
                $('body').append('<script type="text/javascript" src= "' + resourcesurl + 'jQuery/plugins/iCheck/icheck.min.js"/>');
                break;
            default:
                break;
        }
    }
}

