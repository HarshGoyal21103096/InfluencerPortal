$(document).ready(function () {
    const activeUser = localStorage.getItem("activeUser");

    if(!activeUser) {
        window.location.href = "/";
    }

    $(".toast-body").html("Welcome " + activeUser);
    const toast = new bootstrap.Toast($("#liveToast"));
    toast.show();

    $("#btnPostBooking").click(function () {
        const obj = {
            type: "get",
            url: "/post-booking",
            data: {
                email: activeUser,
                title: $("#bTitle").val(),
                dos: $("#bDate").val(),
                tos: $("#bTime").val(),
                city: $("#bCity").val(),
                venue: $("#bVenue").val(),
            }
        }

        $.ajax(obj).done(function (resp) {
            $("#spanResp").html(resp).css("color", "blue");
        }).fail(function (resp) {
            alert(resp.status + " " + resp.statusText);
        })
    });

    $("#newPwd").blur(function() {
        const pwdRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;

        if(pwdRegex.test($(this).val())) {
            $(this).addClass("is-valid").removeClass("is-invalid");

            if($(this).val() == $("#confirmPwd").val() ) {
                $("#btnChangePwd").prop("disabled", false);
                $("#confirmPwd").addClass("is-valid").removeClass("is-invalid");
            } else {
                $("#confirmPwd").addClass("is-invalid").removeClass("is-valid");
                $("#btnChangePwd").prop("disabled", true);
            }
        } else {
            $(this).addClass("is-invalid");
            $("#btnChangePwd").prop("disabled", true);
        };
    });

    $("#confirmPwd").keyup(function() {
        const pwdRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;

        if(pwdRegex.test($(this).val()) && ($(this).val() == $("#newPwd").val())) {
            $(this).addClass("is-valid").removeClass("is-invalid");
            $("#btnChangePwd").prop("disabled", false);
        } else {
            $(this).addClass("is-invalid");
            $("#btnChangePwd").prop("disabled", true);
        };
    });

    $("#btnChangePwd").click(function() {
        const obj = {
            type: "get",
            url: "/change-pwd",
            data: {
                email: activeUser,
                oldPwd: $("#oldPwd").val(),
                newPwd: $("#newPwd").val()
            }
        };
        console.log("hi");

        $.ajax(obj).done(function(resp) {
            if(resp == "Password updated...") {
                $("#spanRes").html("Password Updated...").css("color", "green");
            } else if(resp == "Invalid Password") {
                $("#spanRes").html("Invalid Password...").css("color", "red");
            } else {
                alert(resp);
            }
        }).fail(function(resp) {
            alert(resp.status + " " + resp.statusText);
        });
    });

    $("#btnLogout").click(function() {
        const isSure = confirm("Are you sure you want to logout?");

        if(isSure) {
            localStorage.removeItem("activeUser");
            window.location.href = "index.html";
        }
    });
})