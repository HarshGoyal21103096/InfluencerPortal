const express = require("express");
const mysql2 = require("mysql2");
const fileUploader = require("express-fileupload");
const nodemailer = require("nodemailer");
require('dotenv').config();

let app = express();

const PORT = 2020;

app.listen(PORT, () => {
    console.log(`Server is live at port ${PORT} :)`);
});

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(fileUploader());

//config for mysql
let config = {
    host: process.env.HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DATABASE,
    dateStrings: true,
    keepAliveInitialDelay: 10000,
    enableKeepAlive: true
}

//nodemailer config
const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'lynn.greenholt71@ethereal.email',
        pass: '1jErZJDqrYnKKehu5E'
    }
});

const mysql = mysql2.createConnection(config);
mysql.connect((err) => {
    if (!err)
        console.log("Connected to database successfully...");
    else
        console.log("Error : " + err.message);
});

//-------------------------------------------------------------

app.get("/", (req, res) => {
    //absolute path
    // const path = __dirname + "/public/index.html";
    // res.sendFile(path);
    //relative path
    res.sendFile("/public/index.html");
});

app.get("/signup-process", (req, res) => {
    let email = req.query.email;
    let pwd = req.query.pwd;
    let utype = req.query.utype;

    mysql.query("INSERT INTO users values(?,?,?,1)", [email, pwd, utype], (err, result) => {
        if (err) {
            res.send("ERROR : " + err.message);
        } else {
            res.send("Signup successful");
        }
    })
});

app.get("/login-process", (req, res) => {
    let email = req.query.email;
    let pwd = req.query.pwd;

    mysql.query("SELECT * FROM users WHERE email=? and pwd=?", [email, pwd], (err, result) => {
        if (err) {
            res.send("ERROR : " + err.message);
        } else {
            console.log(result);
            if (result.length == 1) {
                if (result[0].status == 1)
                    res.send(result[0].utype);
                else
                    res.send("Your account has been blocked due to some malicious activities");
            } else {
                res.send("Please fill correct credentials");
            }
        }
    });
});

app.get("/infl-dash", (req, res) => {
    const path = __dirname + "/public/infl-dash.html";
    res.sendFile(path);
});

app.get("/infl-profile", (req, res) => {
    const path = __dirname + "/public/infl-profile.html";
    res.sendFile(path);
});

app.post("/infl-profile-save", (req, res) => {
    //console.log(req.body);
    const { iEmail, iName, iGender, iDob, iAddress, iPhone, iState, iCity, iZip, iCategory, iInsta, iFB, iYT, iOther } = req.body;

    let ppic = "noProfile.png";
    if (req.files?.iPPic) {
        ppic = req.files.iPPic.name;
        //console.log(ppic);
        const path = __dirname + "/public/uploads/" + ppic;
        req.files.iPPic.mv(path);
    }

    mysql.query(
        "INSERT INTO iProfile VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
        [iEmail, iName, ppic, iGender, iDob, iAddress, iPhone, iState, iCity, iZip, iCategory.toString(), iInsta, iFB, iYT, iOther],
        function (err, resut) {
            if (err)
                res.send("ERROR: " + err.message);
            else {
                res.send("Profile details saved successfully...");
            }
        }
    )
});

app.post("/infl-profile-update", (req, res) => {
    //console.log(req.body);
    const { iEmail, iName, iGender, iDob, iAddress, iPhone, iState, iCity, iZip, iCategory, iInsta, iFB, iYT, iOther } = req.body;

    let ppic = req.body.hdn;
    if (req.files?.iPPic) {
        ppic = req.files.iPPic.name;
        //console.log(ppic);
        const path = __dirname + "/public/uploads" + ppic;
        req.files.iPPic.mv(path);
    }

    mysql.query(
        "UPDATE iProfile set iname=?, ippic=?, igender=?, idob=?, iaddress=?, iphone=?, istate=?, icity=?, izip=?, icategory=?, iinsta=?, ifb=?, iyt=?, iother=? WHERE iemail=?",
        [iName, ppic, iGender, iDob, iAddress, iPhone, iState, iCity, iZip, iCategory.toString(), iInsta, iFB, iYT, iOther, iEmail],
        (err, resut) => {
            if (err)
                res.send("ERROR: " + err.message);
            else {
                res.send("Profile details updated successfully...");
            }
        }
    )
});

app.get("/infl-profile-search", (req, res) => {
    const iemail = req.query.iemail;

    mysql.query("SELECT * FROM iProfile WHERE iemail=?", [iemail], (err, resultAry) => {
        if (err) {
            res.send("Error : " + err.message);
            return;
        }
        if (resultAry.length == 1) {
            //console.log(resultAry[0]);
            res.send(resultAry);
        } else {
            res.send("Unable to fetch details\nPlease save profile details");
        }
    })
});

app.get("/post-booking", (req, res) => {
    console.log(req.query);
    const { email, title, dos, tos, city, venue } = req.query;

    mysql.query("INSERT INTO bookings VALUES(null,?,?,?,?,?,?)", [email, title, dos, tos, city, venue], (err) => {
        if (err) {
            res.send("ERROR: " + err.message);
        } else {
            //console.log(result);
            res.send("Event booking posted...");
        }
    })
});

app.get("/event-manager", (req, res) => {
    const path = __dirname + "/public/event-manager.html";
    res.sendFile(path);
});

app.get("/delete-booking", (req, res) => {
    mysql.query("DELETE FROM bookings WHERE recordId=?", [req.query.rid], (err) => {
        if (err) {
            res.send("ERROR: " + err.message); return;
        }
        res.send("Booking deleted...");
    });
});

app.get("/fetch-future-events", (req, res) => {
    const email = req.query.email;

    mysql.query("SELECT * FROM bookings WHERE email=? AND dos>=current_date", [email], (err, resultAry) => {
        if (err) {
            res.send("Error : " + err.message);
            return;
        }
        if (resultAry.length >= 1) {
            //console.log(resultAry[0]);
            res.send(resultAry);
        } else {
            res.send("No Future Event Bookings...");
        }
    })
})

app.get("/change-pwd", (req, res) => {
    const { email, oldPwd, newPwd } = req.query;

    mysql.query("SELECT * FROM users WHERE email=? and pwd=?", [email, oldPwd], (err, result) => {
        if (err) {
            res.send("ERROR : " + err.message);
        } else {
            console.log(result);
            if (result.length == 1) {
                mysql.query("UPDATE users set pwd=? WHERE email=?", [newPwd, email], (err, result) => {
                    if (err) {
                        res.send("ERROR: " + err.message);
                    } else {
                        res.send("Password updated...");
                    }
                })
            } else {
                res.send("Invalid Password");
            }
        }
    })
});

app.get("/forgot-pwd", async (req, res) => {
    const email = req.query.email;
    let pwd;

    mysql.query("SELECT pwd FROM users WHERE email=?", [email], (err, result) => {
        if (err) { res.send("ERROR: " + err.message); return; }
        if (result.length == 1) {
            //console.log(result[0]);
            pwd = result[0].pwd;

            const info = transporter.sendMail({
                from: 'admin@influencio.com',
                to: email,
                subject: "Password Reset Request",
                text: `Dear User, We received a request to reset your password. For security purposes, please use the temporary password provided below to log in and change your password immediately. Temporary Password: ${pwd}. To change your password:
                    1. Log in using the temporary password.
                    2. Navigate to the settings modal.
                    3. Update your password to something secure and memorable.
                    If you did not request a password reset, please ignore this email or contact our support team for assistance.
                    Thank you for your attention to this matter.
                    Best regards,
                    Team Influencio
                    This is an auto-generated email. Please do not reply to this email.`,
                html: ` <div class="container">
                            <p>Dear User,</p>
                            <p>We received a request to reset your password. For security purposes, please use the temporary password provided below to log in and change your password immediately.</p>
                            <p><strong>Temporary Password:</strong> ${pwd}</p>
                            <p>To change your password:</p>
                            <ol>
                                <li>Log in using the temporary password.</li>
                                <li>Navigate to the settings modal.</li>
                                <li>Update your password to something secure and memorable.</li>
                            </ol>
                            <p>If you did not request a password reset, please ignore this email or contact our support team for assistance.</p>
                            <p>Thank you for your attention to this matter.</p>
                            <p>Best regards,<br>[Your Website Name] Team</p>
                            <p class="footer">*This is an auto-generated email. Please do not reply to this email.*</p>
                        </div>`
            });

            res.send("Check your email for password");
        } else {
            res.send("User doesn't exist");
        }
    })
});

app.get("/client-dash", (req, res) => {
    const path = __dirname + "/public/client-dash.html";
    res.sendFile(path);
});

app.get("/client-profile", (req, res) => {
    const path = __dirname + "/public/client-profile.html";
    res.sendFile(path);
});

app.post("/client-profile-save", (req, res) => {
    console.log(req.body);
    const { email, name, aadhar, uType, address, phone, state, city, other } = req.body;

    mysql.query(
        "INSERT INTO cProfile VALUES(?,?,?,?,?,?,?,?,?)",
        [email, name, aadhar, address, uType, phone, state, city, other],
        function (err, resut) {
            if (err)
                res.send("ERROR: " + err.message);
            else {
                res.send("Profile details saved successfully...");
            }
        }
    )
});

app.post("/client-profile-update", (req, res) => {
    console.log(req.body);
    const { email, name, aadhar, address, uType, phone, state, city, other } = req.body;

    mysql.query(
        "UPDATE cProfile set name=?, aadhar=?, address=?, uType=?, phone=?, state=?, city=?, other=? WHERE email=?",
        [email, name, aadhar, address, uType, phone, state, city, other],
        function (err, resut) {
            if (err)
                res.send("ERROR: " + err.message);
            else {
                res.send("Profile details updated successfully...");
            }
        }
    )
});

app.get("/client-profile-search", (req, res) => {
    const email = req.query.email;

    mysql.query("SELECT * FROM cProfile WHERE email=?", [email], (err, resultAry) => {
        if (err) {
            res.send("Error : " + err.message);
            return;
        }
        if (resultAry.length == 1) {
            //console.log(resultAry[0]);
            res.send(resultAry);
        } else {
            res.send("Unable to fetch details\nPlease save profile details");
        }
    })
});

app.get("/admin-dash", (req, res) => {
    const path = __dirname + "/public/admin-dash.html";
    res.sendFile(path);
});

app.get("/user-manager", (req, res) => {
    const path = __dirname + "/public/user-manager.html";
    res.sendFile(path);
});

app.get("/fetch-all-users", (req, res) => {
    mysql.query("SELECT * FROM users", (err, result) => {
        if (err != null) {
            res.send("ERROR: " + err.message); return;
        }
        res.send(result);
    });
});

app.get("/fetch-user", (req, res) => {
    const email = req.query.email;

    mysql.query("SELECT * FROM users WHERE email=?", [email], (err, result) => {
        if (err != null) {
            res.send("ERROR: " + err.message); return;
        }
        res.send(result);
    });
});

app.get("/block-user", (req, res) => {
    mysql.query("UPDATE users SET status=0 WHERE email=?", [req.query.email], (err, result) => {
        if (err) {
            res.send("ERROR: " + err.message); return;
        }
        res.send("User Blocked by admin");
    });
});

app.get("/unblock-user", (req, res) => {
    mysql.query("UPDATE users SET status=1 WHERE email=?", [req.query.email], (err) => {
        if (err) {
            res.send("ERROR: " + err.message); return;
        }
        res.send("User Unblocked by admin");
    });
});

app.get("/delete-user", (req, res) => {
    mysql.query("DELETE FROM users WHERE email=?", [req.query.email], (err) => {
        if (err) {
            res.send("ERROR: " + err.message); return;
        }
        res.send("User data deleted...");
    });
});

app.get("/infl-console", (req, res) => {
    const path = __dirname + "/public/infl-console.html";
    res.sendFile(path);
});

app.get("/fetch-all-infl", (req, res) => {
    mysql.query("SELECT * FROM iprofile", (err, result) => {
        if (err) {
            res.send("ERROR: " + err.message); return;
        }
        res.send(result);
    });
});

app.get("/infl-finder", (req, res) => {
    const path = __dirname + "/public/infl-finder.html";
    res.sendFile(path);
});

app.get("/fetch-cities", (req, res) => {
    const category = "%" + req.query.category + "%";

    mysql.query("SELECT DISTINCT icity FROM iprofile WHERE icategory LIKE ?", [category], (err, result) => {
        if (err) {
            res.send("ERROR: " + err.message); return;
        }
        console.log(result);
        res.send(result);
    });
});

app.get("/find-filtered-infl", (req, res) => {
    const category = "%" + req.query.category + "%";
    const city = req.query.city;

    mysql.query("SELECT * FROM iprofile WHERE icategory LIKE ? and icity=?", [category, city], (err, result) => {
        if (err) {
            res.send("ERROR: " + err.message); return;
        }
        console.log(result);
        res.send(result);
    });
});

app.get("/filter-infl-by-name", (req, res) => {
    const name = "%" + req.query.name + "%";

    mysql.query("SELECT * FROM iprofile WHERE iname LIKE ?", [name], (err, result) => {
        if (err) {
            res.send("ERROR: " + err.message); return;
        }
        console.log(result);
        res.send(result);
    });
});

app.get("/send-email-infl", (req, res) => {
    const inflEmail = req.query.infl;
    const clientEmail = req.query.client;

    const info = transporter.sendMail({
        from: 'admin@influencio.com',
        to: inflEmail,
        subject: "Collaboration Opportunity",
        text: `Dear Influencer, We're excited to inform you that a collaborator has shown interest in your profile and would like to connect for further discussions.Collaborator' Email ${clientEmail}. Please reach out to the collaborator at the provided email address to confirm your availability and willingness to discuss potential collaboration opportunities. Thank you for being a valued member of our community! Best regards, Influencia Team. This is an auto generated email, Please do not reply to this email. `,
        html: `<div class="container" style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px;">
                <p>Dear Influencer,</p>
                <p>We are excited to inform you that a collaborator has shown interest in your profile and would like to connect for further discussions.</p>
                <p><strong>Collaborator's Email:</strong> ${clientEmail}</p>
                <p>Please reach out to the collaborator at the provided email address to confirm your availability and willingness to discuss potential collaboration opportunities.</p>
                <p>Thank you for being a valued member of our community!</p>
                <p>Best regards,<br>Team Influencio</p>
                <p class="footer" style="font-size: 0.9em; color: #888; margin-top: 20px;">
                  *This is an auto-generated email. Please do not reply to this email.*
                </p>
               </div>`
    });

    res.send("Email sent to the influencer!");
})
