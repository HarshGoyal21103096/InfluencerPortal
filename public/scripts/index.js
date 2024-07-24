$(document).ready(function () {
    $("#txtSignupEmail").blur(function() {
        const emailRegex = /^[a-zA-Z0-9_.±]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$/;

        if(emailRegex.test($(this).val())) {
            const obj = {
                type: "get",
                url: "/fetch-user",
                data: {
                    email: $(this).val()
                }
            }
    
            $.ajax(obj).done(function(resp) {
                if(resp.length!=0) {
                    $("#txtSignupEmail").addClass("is-invalid");
                    $("#errEmail").html("Email already taken").prop("hidden", false);  
                } else {
                    $("#errEmail").prop("hidden", true);
                    $("#txtSignupEmail").addClass("is-valid").removeClass("is-invalid");
                    if($("#txtSignupPwd").val() != "" && $("#errPwd").prop("hidden")) {
                        $("#btnSignup").prop("disabled", false);
                    }
                }
            }).fail(function(resp) {
                alert(resp.status+" "+resp.statusText);
            });

        } else {
            $(this).addClass("is-invalid");
            $("#errEmail").html("Enter valid email").prop("hidden", false);
        };
    })
    
    $("#txtSignupPwd").keyup(function() {
        const pwdRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;

        if(pwdRegex.test($(this).val())) {
            $("#errPwd").prop("hidden", true); 
            $(this).addClass("is-valid").removeClass("is-invalid");

            if ($("#txtSignupEmail").val() != "" && $("#errEmail").prop("hidden")) {
                $("#btnSignup").prop("disabled", false);
            }
        } else {
            $(this).addClass("is-invalid");
            $("#errPwd").prop("hidden", false); 
        };
    })
    
    $("#btnSignup").click(function () {
        let email = $("#txtSignupEmail").val();
        let pwd = $("#txtSignupPwd").val();
        let utype = $("#comboUserType").val();

        let obj = {
            type: "get",
            url: "/signup-process",
            data: {
                email,
                pwd,
                utype
            }
        }
        console.log(obj);

        $.ajax(obj).done(
            function (resp) {
                localStorage.setItem("activeUser", email);
                if(utype == "Influencer")
                    window.location.href = "/infl-dash";
                else 
                    window.location.href = "/client-dash";
            }
        ).fail(
            function (resp) {
                alert(resp.status+ " " +resp.statusText);
            }
        )
    });

    $("#btnLogin").click(function () {
        let email = $("#txtLoginEmail").val();
        let pwd = $("#txtLoginPwd").val();

        let obj = {
            type: "get",
            url: "/login-process",
            data: {
                email,
                pwd,
            }
        }
        console.log(obj);

        $.ajax(obj).done(
            function (resp) {
                if(resp == "Influencer") {
                    localStorage.setItem("activeUser", $("#txtLoginEmail").val());
                    window.location.href = "/infl-dash";
                } else if (resp == "Collaborator") {
                    localStorage.setItem("activeUser", $("#txtLoginEmail").val());
                    window.location.href = "/client-dash";
                }
                else {
                    alert(resp);
                }
            }
        ).fail(
            function (resp) {
                alert(resp.status+ " " +resp.statusText);
            }
        )
    });

    $("#btnForgotPwd").click(function() {
        const obj= {
            type: "get",
            url: "/forgot-pwd",
            data: {
                email: $("#txtLoginEmail").val()
            }
        }

        $.ajax(obj).done(function(resp) {
            $("#forgotPwdResp").html(resp);
        }).fail(function(resp) {
            alert(resp);
        });
    })
})
