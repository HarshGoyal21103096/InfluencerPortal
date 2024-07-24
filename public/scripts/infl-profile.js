doPrev = (refFile, imgPrev) => {
    console.log(refFile.files);
    let [file] = refFile.files;
    if(file) {
        imgPrev.src = URL.createObjectURL(file);
    }
};

$(document).ready(function() {
    $("#txtEmail").val(localStorage.getItem("activeUser")).prop("readonly", true).css("background-color", "lightgray");

    const obj = {
        type: "get",
        url: "/infl-profile-search",
        data: { 
            iemail: $("#txtEmail").val()
        }
    }

    $.ajax(obj).done(function(resp) {
        if(Array.isArray(resp)) {
            $("#btnSave").prop("hidden", true);
            $("#btnSearch").trigger("click");
        } else {
            $("#btnUpdate").prop("hidden", true);
        }
    }).fail(function(resp) {
        alert(resp.status+" "+resp.statusText);
    });


    $("#btnSearch").click(function() {
        const obj = {
            type: "get",
            url: "/infl-profile-search",
            data: { 
                iemail: $("#txtEmail").val()
            }
        }

        $.ajax(obj).done(function(resp) {
            if(Array.isArray(resp)) {
                //alert(JSON.stringify(resp));
                const {iname, ippic, igender, idob, iaddress, iphone, istate, icity, izip, icategory, iinsta, ifb, iyt, iother} = resp[0];

                $("#txtName").val(iname);
                $("#imgPrev").prop("src", "./uploads/" + ippic);
                $("#comboGender").val(igender);
                $("#dateDob").val(idob);
                $("#txtAddress").val(iaddress);
                $("#phone").val(iphone);
                $("#comboState").val(istate);
                $("#txtCity").val(icity);
                $("#inputZip").val(izip);
                //a listbox is an array of strings  [a,b,c,d,e]
                //.split() returns an array of Strings
                $("#listCategory").val(icategory.split(","));//[c,e]
                $("#insta").val(iinsta);
                $("#fb").val(ifb);
                $("#yt").val(iyt);
                $("#txtOther").val(iother);
                $("#hdn").val(ippic);
            } else {
                alert(resp);
            }
        }).fail(function(resp) {
            alert(resp.status+" "+resp.statusText);
        })
    })
})