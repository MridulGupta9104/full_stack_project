const express = require("express");
const app = express();
const fileuploader = require("express-fileupload");
const mysql2 = require("mysql2");
app.listen(9999, function () {
    console.log("Hurrahh.. Server Started at port:9999");
})
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(fileuploader());
const congObj = {
    host: "127.0.0.1",
    user: "root",
    password: "Mr@091004",
    database: "prda",
    dateStrings: true
}
const mysql = mysql2.createConnection(congObj);
mysql.connect(function (err) {
    if (err == null) {
        console.log("Connected to Database : prda");
    }
    else {
        console.log(err.message);
    }
})
app.get("/", function (req, resp) {
    /*resp.contentType("text/html");
    resp.write("<h1><b>Hi,Welcome To Index Page<b><h1>");
    resp.end();*/
    let filepath = process.cwd() + "/public/index.html";
    resp.sendFile(filepath);
})
app.get("/custdash", function (req, resp) {
    /*resp.contentType("text/html");
    resp.write("<h1><b>Hi,Welcome To Index Page<b><h1>");
    resp.end();*/
    let filepath = process.cwd() + "/public/customer-dash.html";
    resp.sendFile(filepath);
})
app.get("/admindash", function (req, resp) {
    /*resp.contentType("text/html");
    resp.write("<h1><b>Hi,Welcome To Index Page<b><h1>");
    resp.end();*/
    let filepath = process.cwd() + "/public/admin-dash.html";
    resp.sendFile(filepath);
})
app.get("/serprovdash", function (req, resp) {
    /*resp.contentType("text/html");
    resp.write("<h1><b>Hi,Welcome To Index Page<b><h1>");
    resp.end();*/
    let filepath = process.cwd() + "/public/service-provider-dash.html";
    resp.sendFile(filepath);
})
app.get("/save_record", function (req, resp) {
    const email = req.query.kuchemail;
    const pwd = req.query.kuchpwd;
    const utye = req.query.kuchopt;
    mysql.query("insert into users values(?,?,?,current_date(),1)", [email, pwd, utye], function (err) {
        if (err == null) {
            resp.send("Signed Up Successfully");
        }
        else {
            resp.send(err.message);
        }
    })
})
app.get("/chk_avl", function (req, resp) {
    const email = req.query.kuchemail;
    mysql.query("select * from users where emailid=?", [email], function (err, resultary) {
        if (resultary.length == 1) {
            resp.send("(Not Available)");
        }
        else {
            resp.send("(Available)");
        }
    })
})
app.get("/valid_id", function (req, resp) {
    mysql.query("select * from users where emailid=? and pwd=?", [req.query.kuchemail, req.query.kuchpwd], function (err, resultary) {
        resp.send(resultary);
    })
})
app.get("/find_record", function (req, resp) {
    console.log(req.query);
    mysql.query("select * from custprofile where emailid=?", [req.query.email], function (err, respjsonary) {
        resp.send(respjsonary);
    })
})
app.post("/save_rec", function (req, resp) {
    if (req.body.chkbox) {
        const email = req.body.txtem;
        const name = req.body.txtname;
        const cont = req.body.txtno;
        const adrs = req.body.txtadd;
        const city = req.body.txtct;
        const state = req.body.state;
        let filename;
        if (req.files == null) {
            filename = "user.png";
        }
        else {
            filename = req.files.ppic.name;
            let path = process.cwd() + "/public/uploads/" + filename;
            req.files.ppic.mv(path);
        }
        req.body.ppic = filename;
        mysql.query("insert into custprofile values(?,?,?,?,?,?,?)", [email, name, cont, adrs, city, state, filename], function (err) {
            if (err == null) {
                resp.send("Record Saved Successfully");
            }
            else {
                resp.send(err.message);
            }
        })
    }
    else {
        resp.send("Agree to Terms & Conditions.");
    }
})
app.get("/post-job", function (req, resp) {
    const email = req.query.kuchemail;
    const catg = req.query.kuchcatg;
    const addr = req.query.kuchadrs;
    const city = req.query.kuchcity;
    const date = req.query.kuchuptu;
    const detail = req.query.kuchdetl;
    mysql.query("insert into tasks values(0,?,?,?,?,?,?)", [email, catg, addr, city, date, detail], function (err) {
        if (err == null) {
            resp.send("Requirement Posted Successfully");
        }
        else {
            resp.send(err.message);
        }
    })
})
app.get("/pass-chng", function (req, resp) {
    const email = req.query.email;
    const old = req.query.oldpass;
    const newp = req.query.newpass;
    mysql.query("update users set pwd=? where emailid=? and pwd=?", [newp, email, old], function (err) {
        if (err == null) {
            resp.send("Password Updated Successfully");
        }
        else {
            resp.send(err.message);
        }
    })
})
app.get("/srch-prov", function (req, resp) {
    console.log(req.query);
    mysql.query("select * from providers where emailid=?", [req.query.email], function (err, respary) {
        resp.send(respary);
    })
})
app.post("/save-provv", function (req, resp) {
    //console.log(req.body);
    if (req.body.chkbox) {
        const email = req.body.txtem;
        const name = req.body.txtname;
        const cont = req.body.txtno;
        const adrs = req.body.txtadd;
        const gender = req.body.selgen;
        const catg = req.body.selctg;
        const firm = req.body.txtfrm;
        const website = req.body.txtweb;
        const from = req.body.since;
        const other = req.body.txtar;
        let filename;
        if (req.files == null) {
            filename = "user.png";
        }
        else {
            filename = req.files.ppic.name;
            let path = process.cwd() + "/public/uploads/" + filename;
            req.files.ppic.mv(path);
        }
        req.body.ppic = filename;
        mysql.query("insert into providers values(?,?,?,?,?,?,?,?,?,?,?)", [email, name, cont, gender, catg, firm, website, adrs, from, filename, other], function (err) {
            if (err == null) {
                resp.send("Provider Details Saved Successfully");
            }
            else {
                resp.send(err.message);
            }
        })
    }
    else {
        resp.send("Agree to Terms & Conditions.");
    }
})
app.get("/angular-fetch-all", function (req, resp) {
    mysql.query("select * from users", function (err, resultjsonary) {
        resp.send(resultjsonary);
    })
})
app.get("/angular-fetch-all-req", function (req, resp) {
    mysql.query("select * from providers", function (err, resultjsonary) {
        resp.send(resultjsonary);
    })
})
app.get("/angular-fetch-task", function (req, resp) {
    const email = req.query.emailkuch;
    mysql.query("select * from tasks where emailid=?", [email], function (err, resultjsonary) {
        resp.send(resultjsonary);
    })
})
app.get("/angular-delete", function (req, resp) {
    const rid = req.query.ridkuch;
    mysql.query("delete from tasks where rid=?", [rid], function (err, resultjsonary) {
        resp.send(resultjsonary);
    })
})
app.get("/fetch-pwd", function (req, resp) {
    mysql.query("select distinct pwd from users", function (err, resultjsonary) {
        resp.send(resultjsonary);
    })
})
app.get("/fetch-city", function (req, resp) {
    mysql.query("select distinct location from providers", function (err, resultjsonary) {
        resp.send(resultjsonary);
    })
})
app.get("/fetch-req-city", function (req, resp) {
    mysql.query("select * from providers where location=?", [req.query.city], function (err, resultjsonary) {
        resp.send(resultjsonary);
    })
})
app.get("/fetch-search", function (req, resp) {
    mysql.query("select * from providers where location=? and category=?", [req.query.city, req.query.ctgy], function (err, resultjsonary) {
        resp.send(resultjsonary);
    })
})
app.get("/fetch-ctgy", function (req, resp) {
    mysql.query("select distinct category from providers", function (err, resultjsonary) {
        resp.send(resultjsonary);
    })
})
app.get("/fetch-req-ctgy", function (req, resp) {
    mysql.query("select * from providers where category=?", [req.query.ctgy], function (err, resultjsonary) {
        resp.send(resultjsonary);
    })
})
app.get("/fetch-pwd-rec", function (req, resp) {
    mysql.query("select * from users where pwd=?", [req.query.pwd], function (err, resultjsonary) {
        resp.send(resultjsonary);
    })
})
app.get("/angular-fetch-providers", function (req, resp) {
    mysql.query("select * from providers", function (err, resultjsonary) {
        resp.send(resultjsonary);
    })
})
app.get("/angular-fetch-customers", function (req, resp) {
    mysql.query("select * from custprofile", function (err, resultjsonary) {
        resp.send(resultjsonary);
    })
})
app.get("/angular-block", function (req, resp) {
    const email = req.query.emailkuch;
    mysql.query("update users set status=0 where emailid=?", [email], function (err, result) {
        if (err == null) {
            if (result.affectedRows == 1) {
                resp.send("User Blocked");
            }
        }
        else {
            resp.send(err.message);
        }
    })
})
app.get("/angular-resume", function (req, resp) {
    const email = req.query.emailkuch;
    mysql.query("update users set status=1 where emailid=?", [email], function (err, result) {
        if (err == null) {
            if (result.affectedRows == 1) {
                resp.send("User Resumed");
            }
        }
        else {
            resp.send(err.message);
        }
    })
})
app.post("/edit-prov", function (req, resp) {
    //console.log(req.body);
    if (req.body.chkbox) {
        const email = req.body.txtem;
        const name = req.body.txtname;
        const cont = req.body.txtno;
        const adrs = req.body.txtadd;
        const gender = req.body.selgen;
        const catg = req.body.selctg;
        const firm = req.body.txtfrm;
        const website = req.body.txtweb;
        const from = req.body.since;
        const other = req.body.txtar;
        let filename;
        if (req.files == null) {
            filename = req.body.hdn;
        }
        else {
            filename = req.files.ppic.name;
            let path = process.cwd() + "/public/uploads/" + filename;
            req.files.ppic.mv(path);
        }
        req.body.ppic = filename;
        mysql.query("update providers set name=?,contact=?,gender=?,category=?,firm=?,website=?,location=?,since=?,proofpic=?,otherinfo=? where emailid=?", [name, cont, gender, catg, firm, website, adrs, from, filename, other, email], function (err) {
            if (err == null) {
                resp.send("Provider Details Updated Successfully");
            }
            else {
                resp.send(err.message);
            }
        })
    }
    else {
        resp.send("Agree to Terms & Conditions.");
    }
})
app.post("/update_rec", function (req, resp) {
    if (req.body.chkbox) {
        const email = req.body.txtem;
        const name = req.body.txtname;
        const cont = req.body.txtno;
        const adrs = req.body.txtadd;
        const city = req.body.txtct;
        const state = req.body.state;
        let filename;
        if (req.files == null) {
            filename = req.body.hdn;
        }
        else {
            filename = req.files.ppic.name;
            let path = process.cwd() + "/public/uploads/" + filename;
            req.files.ppic.mv(path);
        }
        req.body.ppic = filename;
        mysql.query("update custprofile set naam=?,contact=?,address=?,city=?,state=?,ppic=? where emailid=?", [name, cont, adrs, city, state, filename, email], function (err) {
            if (err == null) {
                resp.send("Record Updated Successfully");
            }
            else {
                resp.send(err.message);
            }
        })
    }
    else {
        resp.send("Agree to Terms & Conditions.");
    }
})
app.get("/find-adrs", function (req, resp) {
    //console.log(req.query);
    mysql.query("select * from custprofile where emailid=?", [req.query.email], function (err, respary) {
        resp.send(respary);
    })
})