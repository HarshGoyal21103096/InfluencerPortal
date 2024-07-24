$(document).ready(function() {
    const activeUser = localStorage.getItem("activeUser");
    if(activeUser == "") {
        window.location.href = "/";
    }

    $("#txtEmail").val(localStorage.getItem("activeUser")).prop("readonly", true).css("background-color", "lightgray");

    const obj = {
        type: "get",
        url: "/client-profile-search",
        data: { 
            iemail: $("#txtEmail").val()
        }
    }

    $.ajax(obj).done(function(resp) {
        if(Array.isArray(resp)) {
            $("#btnSave").prop("hidden", true);
        } else {
            $("#btnUpdate").prop("hidden", true);
        }
    }).fail(function(resp) {
        alert(resp.status+" "+resp.statusText);
    })

    
    $("#btnSearch").click(function() {
        const obj = {
            type: "get",
            url: "/client-profile-search",
            data: { 
                email: $("#txtEmail").val()
            }
        }

        $.ajax(obj).done(function(resp) {
            if(Array.isArray(resp)) {
                //alert(JSON.stringify(resp));
                const {name, aadhar, address, uType, phone, state, city, other} = resp[0];

                $("#txtName").val(name);
                $("#txtAddress").val(address);
                $("#comboUType").val(uType);
                $("#phone").val(phone);
                $("#comboState").val(state);
                $("#txtCity").val(city);
                $("#txtOther").val(other);
                $("#hdn").val(aadhar);
            } else {
                alert(resp);
            }
        }).fail(function(resp) {
            alert(resp.status + " " + resp.statusText);
        })
    })
})