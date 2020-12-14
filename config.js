
const webservicesurl = "https://cdcespon.github.io/intranetdemo//WebServices/"

function getwebservicesurl() {
    return 'https://cdcespon.github.io/intranetdemo//WebServices/'
}

function getresourcesurl() {
    return 'https://cdcespon.github.io/intranetdemo/Resources/'
}

function getlocalurl() {
    return 'https://cdcespon.github.io/intranetdemo/'
}

function getwebapiurl() {
   return 'http://localhost:5696/'
}

function loadScripts(group) {
    var res = group.split(',')
    for (var i = 0; i < res.length; i++) {
        switch (res[i]) {
            case 'login':
                $('body').append('<script type="text/javascript" src="Scripts/login.js"/>');
                $('body').append('<script type="text/javascript" src="' + getlocalurl() + 'Scripts/MD5.js"/>');
                $('body').append('<script type="text/javascript" src= "' + getresourcesurl() + 'jQuery/plugins/iCheck/icheck.min.js"/>');
                break;
            default:
                break;
        }
    }
}


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

