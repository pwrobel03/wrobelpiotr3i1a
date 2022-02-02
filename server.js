var express = require("express")
var app = express()
const PORT = process.env.PORT || 3000;
var hbs = require('express-handlebars');
var path = require("path")
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: "login" }));
let status = "logout"
let tab = [
    { id: 1, login: "AAA", pass: "PASS1", wiek: 10, uczen: "checked", plec: "m" },
    { id: 2, login: "BBB", pass: "PASS2", wiek: 60, uczen: "", plec: "m" },
    { id: 3, login: "CCC", pass: "PASS3", wiek: 40, uczen: "", plec: "k" },
    { id: 4, login: "DDD", pass: "PASS4", wiek: 16, uczen: "checked", plec: "k" },
    { id: 5, login: "EEE", pass: "PASS5", wiek: 14, uczen: "checked", plec: "k" },
]
let context = {}
context.logout = ""
let id = 6


app.get("/", function (req, res) {
    if (status == "login") {
        context.logout = "logout"
    }
    res.render('main.hbs', context)
})

app.get("/register", function (req, res) {
    if (status == "login") {
        context.logout = "logout"
    }

    zakres_wiek = []
    for (let i = 1; i <= 100; i++) {
        let wiek = {}
        wiek.i = i
        zakres_wiek.push(wiek)
    }
    context.wiek = zakres_wiek
    res.render("register.hbs", context)
})

app.post("/new_registered", function (req, res) {
    if (status == "login") {
        context.logout = "logout"
    }

    let same_login = "no"
    for (let i = 0; i < tab.length; i++) {
        if (tab[i].login == req.body.login) {
            same_login = "yes"
        }
    }

    if (same_login == "no") {
        let dane = req.body
        dane.id = id
        tab.push(dane)
        id = id + 1
        res.redirect("/login")
    } else {
        res.render("same_login.hbs", context)
    }
})

app.get("/login", function (req, res) {
    if (status == "login") {
        context.logout = "logout"
    }
    res.render("login.hbs", context)
})

app.post("/login_check", function (req, res) {
    user = []
    for (let i = 0; i < tab.length; i++) {
        if (tab[i].login == req.body.login) {
            user.push(i)
        }
    }
    for (let j = 0; j < user.length; j++) {
        if (tab[user[j]].pass == req.body.pass) {
            status = "login"
            res.redirect("/admin")
        }
    }
    if (status == "logout") {
        res.redirect("/login")
    }
})

app.get("/admin", function (req, res) {
    if (status == "login") {
        context.logout = "logout"
        res.render("admin_login.hbs", context)
    } else {
        res.render("admin_nologin.hbs", context)
    }

})

app.get("/logout", function (req, res) {
    status = "logout"
    context.logout = ""
    res.redirect("/")
})

app.get("/sort", function (req, res) {
    context.dane = tab
    context.logout = "logout"

    //console.log(req.query.sortowanie)

    if (req.query.order == "reverse") {
        tab.sort(function (a, b) {
            return parseFloat(a.wiek) - parseFloat(b.wiek);
        }).reverse();
    } else {
        tab.sort(function (a, b) {
            return parseFloat(a.wiek) - parseFloat(b.wiek);
        });
    }
    res.render("sort.hbs", context)
})

app.get("/gender", function (req, res) {
    context.dane = tab
    context.logout = "logout"

    table1 = []
    table2 = []

    for (let i = 0; i < tab.length; i++) {
        if (tab[i].plec == "k") {
            table1.push(tab[i])
        } else {
            table2.push(tab[i])
        }
    }
    context.table1 = table1
    context.table2 = table2

    res.render("gender.hbs", context)
})

app.get("/show", function (req, res) {
    context.dane = tab
    context.logout = "logout"
    tab.sort(function (a, b) {
        return parseFloat(a.wiek) - parseFloat(b.wiek);
    }).reverse();
    res.render("show.hbs", context)
})

app.set('views', path.join(__dirname, 'views'));         // ustalamy katalog views
app.engine('hbs', hbs({ defaultLayout: 'main.hbs' }));   // domyślny layout, potem można go zmienić
app.set('view engine', 'hbs');
app.use(express.static('static'))

app.listen(PORT, function () {
    console.log("start serwera na porcie " + PORT)
})