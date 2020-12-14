
(function ($, window, document) {
    $(function () {
        try {
            $(".loading").hide();
            // Si el navegador tiene localStorage, se almacena el último usuario autenticado
            $('#username').val(localStorage.getItem("last_user_name"));
            if ($('#username').val().length > 0)
                $("#password").focus();
            else
                $('#username').focus();
        }
        catch (err) {
            console.log(err);
        }
    });
}(window.jQuery, window, document));





function authenticate() {
    $("loading").show();

    var name = $("#username").val();
    var pwd = MD5($("#password").val());
    var baseurl = getwebservicesurl();
    
    getData("Security.asmx/Authenticate", { user: name, password: pwd }, false,beforeSend, onAuthenticateSuccess,error,null);

    //$.ajax({
    //    url: getwebservicesurl() + "Security.asmx/Authenticate",
    //    type: 'POST',
    //    data: { user: name, password: pwd },
    //    dataType: 'json',
    //    async: false,
    //    crossdomain: true,
    //    success: onAuthenticateSuccess,
    //    error: function (result) {
    //        $("#errorLabel").show();
    //        $("#password").val("");

    //    }
    //});
}

function beforeSend(result) {
   // alert("beforesend");
}
function error(result) {
    alert("error");
}
function complete(result) {
    alert("complete");
}
function onAuthenticateSuccess(response) {
    $(".loading").hide();
    $("#errorLabel").hide();
    switch (response.InformationNumber) {
        case 0:
            jsonData = JSON.parse(response.Data);
            var name = $("#username").val()
            console.log('user ' + name + ' logged succesfully');
            localStorage.setItem("last_user_name", name);
            localStorage.setItem("session_id", response.Message);

            $("#lbluser").text(jsonData.Surname + ',' + jsonData.Name);
            $("#lblusermain").text(name);
            $("#lblloggueduser").text(name);

            if (jsonData.MustChangePassword)
                window.location = "Pages/Security/ChangePassword.aspx";
            $("#modalLogin").modal('hide');
            loadMenu();
            $("#password").val("");
            $("#loginButton").hide();
            $("#passwordChangeButton").show();
            $("#logOffButton").show();
            $("#resetPasswordButton").hide();
            break;
        default:
            $("#errorLabel").val(response.Message);
            $("#errorLabel").show();
            $("#password").val("");

            break;
    }

    var avatarImage = "";
    avatarImage = jsonData.Avatar;
    $("#avatarimage").attr("src",  avatarImage);
    $("#avatarimagesmall").attr("src",  avatarImage);
    $("#avatarimageuser").attr("src",  avatarImage);

}

function LogOff() {
    console.log('user logged off');

    localStorage.setItem("session_id", null);

    $("#lbluser").text('Anónimo');
    $("#lblloggueduser").text('Anónimo');
    $("#lblusermain").text('Anónimo');
    $("#password").val("");

    parent.$(parent.document).trigger('sessionend');

    var avatarImage = "/Resources/AdminLTE/img/user2-160x160.jpg";
    $("#avatarimage").attr("src",  avatarImage);
    $("#avatarimagesmall").attr("src",  avatarImage);
    $("#avatarimageuser").attr("src",  avatarImage);

    $("#loginButton").show();
    $("#resetPasswordButton").show();
    $("#passwordChangeButton").hide();
    $("#logOffButton").hide();

}

function changePassword() {
    $("loading").show();

    var name = $("#username").val();
    var oldPwd = MD5($("#oldPassword").val());
    var newPwd = MD5($("#newPassword").val());
    var baseurl = getwebservicesurl();

    $.ajax({
        url: getwebservicesurl() + "Security.asmx/ChangePassword",
        type: 'POST',
        data: { user: name, oldPassword: oldPwd, newPassword: newPwd },
        dataType: 'json',
        async: false,
        crossdomain: true,
        success: onChangePasswordSuccess,
        error: function (result) {
            $("#errorLabel").show();
            $("#password").val("");
        }
    });

}

function onChangePasswordSuccess(response) {
    $("#modalLoginChangePassword").modal('hide');
    raiseEventMessageToParent('SUCCESS', "La clave ha sido cambiada correctamente!");
    $("#oldPassword").val("");
    $("#newPassword").val("");
    $("#newPasswordConfirm").val("");
}
$('#username').keypress(function (event) {
    if (event.keyCode == 13) {
        $('#password').focus();
    }
});

$('#password').keypress(function (event) {
    if (event.keyCode == 13) {
        $('#submitButton').click();
    }
});

$("#password").on("cut copy paste", function (e) {
    alert('No es posible pegar en este campo');
    e.preventDefault();
});

