

function getsession(key) {

    var returnvalue;

    $.ajax({
        url: getwebservicesurl() + "WebServices/Seguridad.asmx/ObtenerSession",
        type: 'POST',
        data: { clave: key },
        dataType: 'json',
        async: false,
        crossdomain: true,
        success: function (data) {
            returnvalue = data;
        },
        error: function (result) {
            returnvalue = null;
        }
    });


    return returnvalue;
}