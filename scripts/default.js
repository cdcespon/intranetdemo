(function ($, window, document) {

    $(function () {

        $.ajax({
            url: getwebservicesurl() + "Security.asmx/GetMenu",
            type: 'POST',
            data: { sessionId: localStorage.getItem("session_id") },
            dataType: 'json',
            crossdomain: true,
            async: true,
			beforeSend:function(){
				$("#loading").show();
			},
	        complete:function(){
				$("#loading").hide();
			},
            success: function (data) {

                if (data.InformationNumber == 0) {
                    var jsondata = JSON.parse(data.Data);

                    for (var item in jsondata) {
                        var node = jsondata[item].Id_Padre.toString();

                        if (jsondata[item].Id_Padre != -1) {
                            var icono = jsondata[item].Icono;

                            if (jsondata[item].Id_Padre == 0) {
                                //Root menu
                                if (icono == undefined || icono == "")
                                    icono = "fa fa-folder";
                                $("#sidemenu").append('<li class="treeview"><a href="#"><i class="' + icono + '"></i> <span>' + jsondata[item].Nombre + '</span> <i class="fa fa-angle-left pull-right"></i></a><ul class="treeview-menu" id="' + jsondata[item].Id.toString() + '"></ul></li>');
                            }
                            else {
                                //Menu leaf
                                if (icono == undefined || icono == "")
                                    icono = "fa fa-link";
                                $("#" + node).append('<li><a href="#" onclick="addtabitem(' + "'" + jsondata[item].Nombre + "', '" + jsondata[item].Referencia + "', '" + icono + "'" + ');"  ><i class="' + icono + '"></i> <span>' + jsondata[item].Nombre + '</span></a></li>');
                            }
                        }
                    }
                }
            },
            error: function (result) {
				$("#errorLabel").text(result.statusText);
                $("#errorLabel").show();
                $("#loading").hide();
            }
        });

        $("#buscadorHome").submit(function (event) {
            event.preventDefault(); //Control enter key. Filter is done with function filtrarMenu defined in search-btn class
        });

        AttachEvent(document, 'click', ResetTime);
        AttachEvent(document, 'mousemove', ResetTime);
        AttachEvent(document, 'keypress', ResetTime);
        AttachEvent(window, 'load', ResetTime);

        if (document.URL.toLowerCase().indexOf('intranettest') > 0)
            $(".skin-blue .main-header .navbar").css('background-color', 'red');


        // Listener to raise report tabs
        $(document).on('reporttab', function (event, param1) {

            var filename = param1.replace(/^.*[\\\/]/, '');

            var filetitle = filename.replace('.rpt', '').replace('.RPT', '');

            var tabs = $('#tabs').bootstrapDynamicTabs();
            tabs.addTab({
                title: 'Reporte: ' + filetitle + '  ',
                iframeurl: 'pages/ReportViewer.aspx?reportname=' + filename,
                loadingimage: getresourcesurl() + 'imagenes/gif/loading.gif',
                closable: true,
                icon: 'fa fa-pie-chart'
            })

        });


        // Listener to raise session end
        $(document).on('sessionend', function (event, param1) {
            var tabs = $('#tabs').bootstrapDynamicTabs();
            tabs.closeAll();
            $("#sidemenu").html('');
        });


        // Listener to raise showLogin
        $(document).on('showLogin', function (event, messageType, mensaje) {

            $('#username').val(localStorage.getItem("last_user_name"));

            $("#modalLogin").modal('show');

            if ($('#username').val().length > 0) {
                setTimeout(
                    function () {
                        $('#password').focus();
                        $('#password').select();
                    }, 500);
            }
            else
                setTimeout(function () { $('#username').focus() }, 500);
            
        });


        // Listener to raise Password Change
        $(document).on('showPasswordChange', function (event, messageType, mensaje) {

            $('#usernameLoginChange').val(localStorage.getItem("last_user_name"));

            $("#modalLoginChangePassword").modal('show');

            setTimeout(function () { $('#oldPassword').focus() }, 500);

        });

        // Listener to raise Password Reset
        $(document).on('showPasswordReset', function (event, messageType, mensaje) {

            $("#modalLogin").modal('hide');

            $("#modalLoginPasswordReset").modal('show');

            //setTimeout(function () { $('#mail').focus() }, 500);

        });

        // Listener to add tabs from an iframe
        $(document).on('tabFromIframe', function (event, urlBase, urlAbsolutPath, urlParametros, title, icono) {

            var url = urlBase + urlAbsolutPath + "?" + urlParametros;

            var urlSecurity;
            if (urlParametros.indexOf("pathReporte") !== -1) {
                urlSecurity = (urlParametros.substring(urlParametros.indexOf("pathReporte="), urlParametros.indexOf(".rdlc") + 5)).replace("//", "/").replace("pathReporte=", "");
            }
            else { urlSecurity = urlAbsolutPath; }

            $.ajax({
                url: getwebservicesurl() + "Security.asmx/ValidateUserResource",  // ValidarUsuarioRecurso
                type: 'POST',
                data: { Referencia: urlSecurity, sessionId: localStorage.getItem("session_id") },
                dataType: 'json',
                async: false,
                crossdomain: true,
                success: function (data) {
                    switch (data.InformationNumber) {
                        case 101:
                            url = getlocalurl() + 'Pages/Error/PermissionDenied.aspx';
                            break;
                        case 1001:
                            $(location).attr('href', getlocalurl() + 'Pages/Security/Logoff.aspx?msg=' + data.Data);
                            varurl = 'Pages/Error/404.aspx';
                            break;
                        default:
                            break;
                    }

                    var tabs = $('#tabs').bootstrapDynamicTabs();
                    tabs.addTab({
                        title: title,
                        iframeurl: url,
                        loadingimage: getresourcesurl() + 'imagenes/gif/loading.gif',
                        closable: true,
                        icon: icono
                    })
                },
                error: function (result) {
                    var answer = JSON.stringify(result);
                    if (answer.indexOf("Maintenance") > 1)
                        $(location).attr('href', getlocalurl() + 'Pages/Error/Maintenance.aspx');
                    //else
                        //alert('ERROR ' + JSON.stringify(result));
                }
            });
        });


        // Listener to raise showMessage
        $(document).on('showMessage', function (event, messageType, mensaje) {
            switch (messageType.toUpperCase()) {
                case 'WARNING':
                    $("#modalAdvertencia .alert .mensajeAdvertencia").html(mensaje);
                    $("#modalAdvertencia").modal('show');
                    break;
                case 'ERROR':
                    $("#modalError .alert .errorMessage").html(mensaje);
                    $("#modalError").modal('show');
                    break;
                case 'SUCCESS':
                    $("#modalExitoso .alert .mensajeExitoso").html(mensaje);
                    $("#modalExitoso").modal('show');
                    break;
                case 'INFO':
                    $("#modalInformacion .alert .mensajeInformacion").html(mensaje);
                    $("#modalInformacion").modal('show');
                    break;
                case 'SESSIONERROR':
                    $(location).attr('href', getlocalurl() + '/Pages/Security/Logoff.aspx?msg=' + mensaje);
                case 'DENIEDPERMISSION':
                    $(location).attr('href', getlocalurl() + '/Pages/Security/Logoff.aspx?msg=' + mensaje);
                case 'SESSIONEND':
                    var tabs = $('#tabs').bootstrapDynamicTabs();
                    tabs.closeById(param1);
                    $("#sidemenu").html('');
                default:
                    //Por defecto es un mensaje de información
                    $("#modalInformacion .alert .mensajeInformacion").html(mensaje);
                    $("#modalInformacion").modal('show');
                    break;
            }
        });

        // Listener to raise edit file end
        $(document).on('editfile', function (e,filename) {

            var filenameUrl = filename.substring(filename.lastIndexOf('\\')+1);
      
            var tabs = $('#tabs').bootstrapDynamicTabs();
            tabs.addTab({
                title: 'Editar:' + filenameUrl,
                iframeurl: 'Resources/jQuery/plugins/ace-editor/editor.html?file=' + filenameUrl + '&Time=' + getDateTime(),
                loadingimage: getresourcesurl() + 'imagenes/gif/loading.gif',
                closable: true,
                icon: 'fa fa-pie-chart'
            })

        });

    });
}(window.jQuery, window, document));


var username = localStorage.getItem("last_user_name");
var sessionId = localStorage.getItem("session_id");
var usr;




/*FUNCIONES VARIAS*/
//Agrega el tab si está habilitado el recurso página en Security
function addtabitem(vartitle, varurl, icono) {
    //$.ajax({
    //    url: getlocalurl() + "WebServices/Security.asmx/ValidarUsuarioRecurso",
    //    type: 'POST',
    //    data: { Referencia: varurl, sessionId: localStorage.getItem("session_id") },
    //    dataType: 'json',
    //    async: false,
    //    crossdomain: true,
    //    success: function (data) {
    //        //Según el resultado modifico o no la URl del tab
    //        switch (data.InformationNumber) {
    //            case 101:
    //                varurl = getlocalurl() + 'Pages/Error/PermisoDenegado.aspx';
    //                break;
    //            case 1001:
    //                $(location).attr('href', getlocalurl() + 'Pages/Security/Logoff.aspx?msg=' + data.Data);
    //                varurl = 'Pages/Error/404.aspx';
    //                break;
    //            default:
    //                break;
    //        }

            var tabs = $('#tabs').bootstrapDynamicTabs();
            tabs.addTab({
                title: vartitle + '  ',
                iframeurl: varurl, //+ '?' + getDateTime(),
                loadingimage: getresourcesurl() + 'imagenes/gif/loading.gif',
                closable: true,
                icon: icono
            })
    //    },
    //    error: function (result) {
    //        var answer = JSON.stringify(result);
    //        if (answer.indexOf("Mantenimiento") > 1)
    //            $(location).attr('href', getlocalurl() + 'Pages/Error/EnMantenimiento.aspx');
    //        else
    //            alert('ERROR ' + JSON.stringify(result));
    //    }
    //});
}

function getDateTime()
{
    var d = new Date();
    return 
        ("00" + (d.getMonth() + 1)).slice(-2) + "/" +
        ("00" + d.getDate()).slice(-2) + "/" +
        d.getFullYear() + " " +
        ("00" + d.getHours()).slice(-2) + ":" +
        ("00" + d.getMinutes()).slice(-2) + ":" +
        ("00" + d.getSeconds()).slice(-2)
    ;
}
//No Security check
function addTabItemNoSecurity(vartitle, varurl, icono) {
    var tabs = $('#tabs').bootstrapDynamicTabs();
    tabs.addTab({
        title: vartitle + '  ',
        iframeurl: varurl, // + '?' + getDateTime(),
        loadingimage: getresourcesurl() + 'imagenes/gif/loading.gif',
        closable: true,
        icon: icono
    })
}

function loadIframe(url) {

    var $iframe = $('#' + 'mainIframe');

    //alert($iframe.selector.length)

    if ($iframe.selector.length) {
        $iframe.attr('src', url);// + '?' + getDateTime());
        return false;
    }
    return true;
}

// Listener to raise cubes tabs
$(document).on('pbitab', function (event, param1) {

    var filename = param1.replace(/^.*[\\\/]/, '');

    var filetitle = filename.replace('.html', '').replace('.HTML', '');

    var tabs = $('#tabs').bootstrapDynamicTabs();
    tabs.addTab({
        title: 'Power Bi: ' + filetitle + '  ',
        iframeurl: param1,
        loadingimage: getresourcesurl() + 'imagenes/gif/loading.gif',
        closable: true,
        icon: 'fa fa-pie-chart'
    })

});


$(document).on('ReloadMenu', function (event, param1) {
    loadMenu();
});


$(document).on('ReloadAvatar', function (event, param1) {
    RefreshCurrentUserData();
});
function RefreshCurrentUserData() {
        var dataparameters = null;
        $.ajax({
            url: getwebservicesurl() + "Security.asmx/GetCurrentUser",
            data: { sessionId: localStorage.getItem("session_id") },
            type: 'POST',
            dataType: 'json',
            async: true,
            crossdomain: true,
            beforeSend: function () {
                showWaitingImage();
            },
            success: function (data) {
                switch (data.InformationNumber) {
                    case 0:
                        var result = JSON.parse(data.Data);
                        avatarImage = result.Avatar;
                        $("#avatarimage").attr("src", avatarImage);
                        $("#avatarimagesmall").attr("src", avatarImage);
                        $("#avatarimageuser").attr("src", avatarImage);
                        break;
                    case 1001:
                        raiseEventMessageToParent('SessionError', data.Data);
                        break;
                    default:
                        raiseEventMessageToParent('Error', data.Data);
                        break;
                }
            },
            error: function (result) {
                raiseEventMessageToParent('Error', 'ERROR: ' + JSON.stringify(result));
            }
        });
        hideWaitingImage();

    
}
function loadMenu() {

    $("#sidemenu").html('');

    $.ajax({
        url: getwebservicesurl() + "almenara/Application/almenara.get_application_function_menu.asmx/items",
      
        type: 'POST',
        data: { sessionId: localStorage.getItem("session_id") },
        dataType: 'json',
        crossdomain: true,
        async: true,
        complete:function(){
            $("#loading").hide();
            NProgress.done();
        },
        beforeSend:function()
        {
            NProgress.start();
            $("#loading").show();
        },
        success: function (data) {

            if (data.InformationNumber == 0) {
                var jsondata = JSON.parse(data.Data);

                for (var item in jsondata) {
                    var node = jsondata[item].Parent_Id.toString();

                    if (jsondata[item].Parent_Id != -1) {
                        var icono = jsondata[item].Icon;

                        if (jsondata[item].Parent_Id == 0) {
                            //Root Menu
                            if (icono == undefined || icono == "")
                                icono = "fa fa-folder";
                            $("#sidemenu").append('<li class="treeview"><a href="#"><i class="' + icono + '"></i> <span>' + jsondata[item].Name + '</span> <i class="fa fa-angle-left pull-right"></i></a><ul class="treeview-menu" id="' + jsondata[item].Id.toString() + '"></ul></li>');
                        }
                        else {
                            //Menu leaf
                            if (icono == undefined || icono == "")
                                icono = "fa fa-link";
                            $("#" + node).append('<li><a href="#" onclick="addtabitem(' + "'" + jsondata[item].Name + "', '" + jsondata[item].Reference + "', '" + icono + "'" + ');"  ><i class="' + icono + '"></i> <span>' + jsondata[item].Name + '</span></a></li>');
                        }
                    }
                }
            }
        },
        error: function (result) {
			$("#errorLabel").text(result.statusText);   
            $("#errorLabel").show();   
            $("#loading").hide();
        }
    });
}

//$("#txtFiltroMenu").val()
function filterMenu() {

    $("#sidemenu").html('');

    $.ajax({
        url: getwebservicesurl() + "almenara/Application/almenara.get_application_function_menu.asmx/items",

        type: 'POST',
        data: { sessionId: localStorage.getItem("session_id") },
        dataType: 'json',
        crossdomain: true,
        async: true,
        complete:function(){
            $("#loading").hide();
        },
        beforeSend:function()
        {
            $("#loading").show();
        },
        success: function (data) {

            if (data.InformationNumber == 0) {
                var jsondata = JSON.parse(data.Data);

                for (var item in jsondata) {
                    var node = jsondata[item].Parent_Id.toString();

                    if (jsondata[item].Parent_Id != -1) {
                        var icono = jsondata[item].Icon;

                        if (jsondata[item].Parent_Id == 0) {
                            //Se trata de un menú raíz
                            if (icono == undefined || icono == "")
                                icono = "fa fa-folder";
                            $("#sidemenu").append('<li class="treeview"><a href="#"><i class="' + icono + '"></i> <span>' + jsondata[item].Name + '</span> <i class="fa fa-angle-left pull-right"></i></a><ul class="treeview-menu" id="' + jsondata[item].Id.toString() + '"></ul></li>');
                        }
                        else {
                            //Se trata de una hoja del menú
                            if (icono == undefined || icono == "")
                                icono = "fa fa-link";
                            if (jsondata[item].Name.toUpperCase().indexOf($("#txtFiltroMenu").val().toUpperCase())> -1)
                                $("#" + node).append('<li><a href="#" onclick="addtabitem(' + "'" + jsondata[item].Name + "', '" + jsondata[item].Reference + "', '" + icono + "'" + ');"  ><i class="' + icono + '"></i> <span>' + jsondata[item].Name + '</span></a></li>');
                        }
                    }
                }
            }

        },
        error: function (result) {
			$("#errorLabel").text(result.statusText);   
            $("#errorLabel").show();   
            $("#loading").hide();
        }
    });
}



/*Session control functions*/
var IDLE_TIMEOUT = 300; //seconds
var _localStorageKey = 'global_countdown_last_reset_timestamp';
var _idleSecondsTimer = null;
var _lastResetTimeStamp = (new Date()).getTime();
var _localStorage = null;
try {
    _localStorage = window.localStorage;
    _idleSecondsTimer = window.setInterval(CheckIdleTime, 1000);
}
catch (ex) {
}
function GetLastResetTimeStamp() {
    var lastResetTimeStamp = 0;
    if (_localStorage) {
        lastResetTimeStamp = parseInt(_localStorage[_localStorageKey], 10);
        if (isNaN(lastResetTimeStamp) || lastResetTimeStamp < 0)
            lastResetTimeStamp = (new Date()).getTime();
    } else {
        lastResetTimeStamp = _lastResetTimeStamp;
    }

    return lastResetTimeStamp;
}
function SetLastResetTimeStamp(timeStamp) {
    if (_localStorage) {
        _localStorage[_localStorageKey] = timeStamp;
    } else {
        _lastResetTimeStamp = timeStamp;
    }
}
function ResetTime() {
    SetLastResetTimeStamp((new Date()).getTime());
}
function AttachEvent(element, eventName, eventHandler) {
    if (element.addEventListener) {
        element.addEventListener(eventName, eventHandler, false);
        return true;
    } else if (element.attachEvent) {
        element.attachEvent('on' + eventName, eventHandler);
        return true;
    } else {
        //nothing to do, browser too old or non standard anyway
        return false;
    }
}
function WriteProgress(msg) {
    var oPanel = document.getElementById("SecondsUntilExpire");
    if (oPanel)
        oPanel.innerHTML = msg;
    //else if (console)
    //    console.log(msg);
}
function CheckIdleTime() {
    var currentTimeStamp = (new Date()).getTime();
    var lastResetTimeStamp = GetLastResetTimeStamp();
    var secondsDiff = Math.floor((currentTimeStamp - lastResetTimeStamp) / 1000);
    if (secondsDiff <= 0) {
        ResetTime();
        secondsDiff = 0;
    }

    $("#lblTimeout").text(secondsToHms(IDLE_TIMEOUT - secondsDiff));

    WriteProgress((IDLE_TIMEOUT - secondsDiff) + "");
    if (secondsDiff >= IDLE_TIMEOUT) {
        window.clearInterval(_idleSecondsTimer);
        ResetTime();
        document.location.href = 'Default.aspx';
    }
}
function secondsToHms(d) {
    d = Number(d);
    var h = Math.floor(d / 3600);
    var m = Math.floor(d % 3600 / 60);
    var s = Math.floor(d % 3600 % 60);
    return ((h > 0 ? h + ":" + (m < 10 ? "0" : "") : "") + m + ":" + (s < 10 ? "0" : "") + s);
}