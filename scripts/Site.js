$(document).bind("ajaxSend", function (args) {
   
    NProgress.start();
}).bind("ajaxComplete", function () {
    NProgress.done();
});


/*SEGURIDAD*/
function seguridad_HabilitarColumnas(pNombreGrilla) {
    //Primero que nada obtengo los permisos del usuario, si todo esta bien sigo...
    $.ajax({
        url: getlocalurl() + "WebServices/Seguridad.asmx/ObtenerUsuarioAutenticado",
        data: { sessionId: localStorage.getItem("session_id") },
        type: 'POST',
        dataType: 'json',
        async: true,
        crossdomain: true,
        success: function (data) {
            switch (data.NumeroInformacion) {
                case 0:
                    var userData = JSON.parse(data.Dato);
                    grid = $('#' + pNombreGrilla).data("ejGrid"); //Vuelvo a cargar el objeto grid, por las dudas que haya cambiado algo en la nueva definicion

                    //Recorro los permisos del usuario y asigno visibilidad a donde corresponda.
                    for (var sectorIndex in userData.Sectores) {
                        for (var recursoIndex in userData.Sectores[sectorIndex].Recursos) {
                            if (userData.Sectores[sectorIndex].Recursos[recursoIndex].Referencia.toString() == pNombreGrilla) {
                                //Encontré la grilla, con el Id busco todos los recursos hijos que serian las columnas
                                var IdPadre = userData.Sectores[sectorIndex].Recursos[recursoIndex].Id;
                                for (var recursoColumnaIndex in userData.Sectores[sectorIndex].Recursos) {
                                    if (userData.Sectores[sectorIndex].Recursos[recursoColumnaIndex].Id_Padre == IdPadre) {
                                        var col = userData.Sectores[sectorIndex].Recursos[recursoColumnaIndex].Referencia;
                                        var columna = grid.getColumnByField(col);
                                        if (columna != undefined) {
                                            //columna.visible = true;
                                            columna.showInColumnChooser = true;
                                            grid.columns(columna, "add"); //En realidad hace un update
                                        }
                                    }
                                }
                                break;
                            }
                        }
                    }
                    break;
                case 101:
                    raiseEventMessageToParent('PermisoDenegado', data.Dato);
                    break;
                case 1001:
                    raiseEventMessageToParent('SessionError', data.Dato);
                    break;
                default:
                    raiseEventMessageToParent('Error', data.Dato);
                    break;
            }
        },
        error: function (result) {
            raiseEventMessageToParent('Error', 'Ocurrió un error al obtener el usuario');
            console.log(result.statusText);
        }
    });


}
function seguridad_HabilitarControles(pNombrePagina) {

    //1 seleccionar controles con clase seguridad
    var controles = $(".seguridad");
    if (controles.length > 0) {
        //2 si hay al menos llamo a Seguridad.asmx/ObtenerUsuarioAutenticado
        $.ajax({
            url: getlocalurl() + "WebServices/Seguridad.asmx/ObtenerUsuarioAutenticado",
            data: { sessionId: localStorage.getItem("session_id") },
            type: 'POST',
            dataType: 'json',
            async: true,
            crossdomain: true,
            success: function (data) {
                switch (data.NumeroInformacion) {
                    case 0:
                        var userData = JSON.parse(data.Dato);
                        //3 Recorro la lista de permisos buscando los controles que tienen que ver con la página
                        for (var sectorIndex in userData.Sectores) {
                            for (var recursoIndex in userData.Sectores[sectorIndex].Recursos) {
                                if (userData.Sectores[sectorIndex].Recursos[recursoIndex].Referencia.toString() == pNombrePagina) {
                                    //Encontré la página, con el Id busco todos los recursos hijos que serian los controles (botones, combos, etc)
                                    var IdPadre = userData.Sectores[sectorIndex].Recursos[recursoIndex].Id;
                                    for (var recursoHijoIndex in userData.Sectores[sectorIndex].Recursos) {
                                        //4 De los recursos, chequeo el permiso de los que obtuve en el paso 1
                                        if (userData.Sectores[sectorIndex].Recursos[recursoHijoIndex].Id_Padre == IdPadre) { //TODO y que el recurso se llame igual que el control que estoy analizando
                                            //Si el recurso esta en la lista 1, agrego clase seguridadVisible sino no hago nada
                                            //IMPORTANTE: tener en cuenta que los controles que tengan la clase security pero que no fueran asignados en seguridad no se van a visualizar
                                            var selector = userData.Sectores[sectorIndex].Recursos[recursoHijoIndex].Referencia;
                                            if ($("#" + selector).length) {
                                                $("#" + selector).addClass("seguridadVisible");
                                            }
                                        }
                                    }
                                    break;
                                }
                            }
                        }
                        break;
                    case 101:
                        raiseEventMessageToParent('PermisoDenegado', data.Dato);
                        break;
                    case 1001:
                        raiseEventMessageToParent('SessionError', data.Dato);
                        break;
                    default:
                        raiseEventMessageToParent('Error', data.Dato);
                        break;
                }
            },
            error: function (result) {
                raiseEventMessageToParent('Error', 'Ocurrió un error al obtener el usuario');
                console.log(result.statusText);
            }
        });
    }
}


/*MENSAJES DEL FRAME AL CONTENEDOR*/
function raiseEventMessageToParent(messageType, message) {
    parent.$(parent.document).trigger('showMessage', [messageType, message]);
}

//$(document).on('showMessage', function (event, tipoMensaje, mensaje) {
//    raiseEventMessageToParent(tipoMensaje, mensaje)
//});

function raiseLogin(e) {
    parent.$(parent.document).trigger('showLogin');
}

function raisePasswordChange(e) {
    parent.$(parent.document).trigger('showPasswordChange');
}

function raisePasswordReset(e) {
    parent.$(parent.document).trigger('showPasswordReset');
}

function raiseReloadMenu(e) {
    parent.$(parent.document).trigger('ReloadMenu');
}

function raiseReloadAvatar(e) {
    parent.$(parent.document).trigger('ReloadAvatar');
}

/*TAB FROM IFRAME*/
function addTabFromIFrame(urlBase, urlAbsolutPath, urlParametros, title, icono) {
    parent.$(parent.document).trigger('tabFromIframe', [urlBase, urlAbsolutPath, urlParametros, title, icono]);
}


/*WAITING IMAGE*/
function showWaitingImage() {
    //$('#loading').show();
    NProgress.start();
}
function hideWaitingImage() {
    //$('#loading').hide();
    NProgress.done();
}

/*FUNCIONES VARIAS*/
function agregarCaracteresAlPrincipio(cadenaOriginal, longitudCadena, caracterAgregar) {
    var Cadena = cadenaOriginal;
    while (Cadena.length < longitudCadena) {
        Cadena = caracterAgregar + Cadena;
    }
    return Cadena;
}
function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}
function evaluatereferer() {
    if (document.referrer.length == 0)
        window.location = "../../Login.aspx";
}
function autoResize(id) {
    var newheight;
    var newwidth;

    if (document.getElementById) {
        newheight = document.getElementById(id).contentWindow.document.body.scrollHeight;
        newwidth = document.getElementById(id).contentWindow.document.body.scrollWidth;
    }

    document.getElementById(id).height = (newheight) + "px";
    document.getElementById(id).width = (newwidth) + "px";
}

/*EVENTOS GRILLA COMUNES*/
function onToolBarClickGenerico(args) {
    if (this.model.selectedRowIndex == -1 && (args.itemName == "Editar" || args.itemName == "Eliminar")) {
        raiseEventMessageToParent('Advertencia', 'Debe seleccionar un registro');
        args.cancel = true;
        return;
    }
}
function dataBoundGenerico(args) {
    var GridID = this._id;
    setTimeout(function (e) {
        $("#" + GridID + "_stringDlg").ejDialog({
            open: function (e) {
                $("#" + GridID + "string_ddinput").ejDropDownList("setSelectedText", "Contiene");
            }
        });
    }, 1);
}
function detailsExpandGenerico(args) {
    $(args.masterRow).addClass("filaEnTrabajo");
}
function detailsCollapseGenerico(args) {
    $(args.masterRow).removeClass("filaEnTrabajo");
}
function changeDDLconValidacion(args) {
    //if ($(".e-ddl").eq(0).hasClass('e-focus'))
    $(".e-ddl").parent('td').find(".e-error").hide();
}