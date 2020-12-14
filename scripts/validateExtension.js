/*VALIDACIONES*/

//Valido que la fecha HASTA sea mayor que DESDE, SOLAMENTE CUANDO TIENE CARGADO UN VALOR
jQuery.validator.addMethod("fechaMayorQue",
    function (value, element, params) {
        if (value.length != 0) {
            var dateTo = value.split("/");
            var fDateTo = new Date(dateTo[2], dateTo[1] - 1, dateTo[0]);

            if (!/Invalid|NaN/.test(fDateTo)) {
                //Si es una fecha fin válida, comparo contra la fecha de inicio

                var dateFrom = $(params).val().split("/");
                var fDateFrom = new Date(dateFrom[2], dateFrom[1] - 1, dateFrom[0]);

                if (!/Invalid|NaN/.test(fDateFrom)) {
                    return fDateTo > fDateFrom;
                } else return false;
            }
            else {
                //Si la fecha fin no es válida, entonces devuelvo false cuando no hay fecha inicio
                return ($(params).val().length != 0);
            }
        } else return true;
    }, 'Debe ser mayor que la fecha inicial');


//Valido que la fecha HASTA sea mayor O IGUAL que DESDE, SOLAMENTE CUANDO TIENE CARGADO UN VALOR
jQuery.validator.addMethod("fechaMayorIgualQue",
    function (value, element, params) {
        if (value.length != 0) {
            var dateTo = value.split("/");
            var fDateTo = new Date(dateTo[2], dateTo[1] - 1, dateTo[0]);

            if (!/Invalid|NaN/.test(fDateTo)) {
                //Si es una fecha fin válida, comparo contra la fecha de inicio

                var dateFrom = $(params).val().split("/");
                var fDateFrom = new Date(dateFrom[2], dateFrom[1] - 1, dateFrom[0]);

                if (!/Invalid|NaN/.test(fDateFrom)) {
                    return fDateTo >= fDateFrom;
                } else return false;
            }
            else {
                //Si la fecha fin no es válida, entonces devuelvo false cuando no hay fecha inicio
                return ($(params).val().length != 0);
            }
        } else return true;
    }, 'Debe ser mayor que la fecha inicial');


$.extend($.validator.messages, {
    required: "Campo obligatorio",
    remote: "Campo con error en el servidor",
    email: "Ingrese un email válido",
    url: "Ingrese una URL válida",
    date: "Ingrese una fecha válida",
    dateISO: "Ingrese una fecha (ISO) válida",
    number: "Ingrese un número entero válido",
    digits: "Ingrese sólo dígitos",
    creditcard: "Ingrese un número de tarjeta válido",
    equalTo: "Ingrese el mismo valor nuevamente",
    extension: "Ingrese un valor con una extensión aceptada",
    maxlength: $.validator.format("Ingrese no más de {0} caracteres"),
    minlength: $.validator.format("Ingrese no menos de {0} caracteres"),
    rangelength: $.validator.format("Ingrese un valor entre {0} y {1} caracteres"),
    range: $.validator.format("Ingrese un valor entre {0} y {1}"),
    max: $.validator.format("Ingrese un valor menor o igual a {0}"),
    min: $.validator.format("Ingrese un valor mayor o igual a {0}"),
    nifES: "Ingrese un NIF válido",
    nieES: "Ingrese un NIE válido",
    cifES: "Ingrese un CIF válido"
});