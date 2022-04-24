const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const req = require('express/lib/request');
const res = require('express/lib/response');
const { loadContact, findContact, addContact, cekDuplikat, deleteContact } = require('./utils/contacts');
const { body, validationResult, check } = require('express-validator');
const session = require('express-session');
const cookieParser = require('cookie-parser')
const flash = require('connect-flash')

const app = express()
const port = 3000

//Menggunakan ejs
app.set('view engine', 'ejs');
app.use(expressLayouts);

//Menggunakan middleware express.static
app.use(express.static('public'))

//Menggunakan middleware express.urlencoded()
app.use(express.urlencoded( {extended: true} ))

//Konfigurasi Flash
app.use(cookieParser('secret'));
app.use(session({
    cookie: { maxAge: 6000},
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));
app.use(flash())


//Setting halaman root (home)
app.get('/', (req, res) => {
    // res.sendFile('./index.html', {root: __dirname})
    const mhs = [
        {
            nama: "mhs1",
            email: "emailmhs1@gmail.com"
        },
        {
            nama: "mhs2",
            email: "emailmhs2@gmail.com"
        },
        {
            nama: "mhs3",
            email: "emailmhs2@gmail.com"
        },
        {
            nama: "mhs4",
            email: "emailmhs2@gmail.com"
        }
    ]
    res.render('index', {
        title: "Halaman Home",
        mhs,
        layout: "layouts/main-layout"
    });
})

//Setting halaman about
app.get('/about', (req, res) => {
    // res.sendFile('./about.html', {root: __dirname})
    res.render('about', {
        title: "Halaman About",
        layout: "layouts/main-layout"
    })
})

//Setting halaman Contact
app.get('/contact', (req, res) => {
    // res.sendFile('./contact.html', {root: __dirname})
    const contacts = loadContact()
    console.log(contacts)
    res.render('contact', {
        title: "Halaman Contact",
        layout: "layouts/main-layout",
        contacts,
        msg: req.flash('pesan')
    })
})

//Halaman Form Tambah data kontak
app.get('/contact/add', (req, res) => {
    res.render('add-contact', {
        title: "Form Tambah Data Contact",
        layout: "layouts/main-layout"
    })
})

//Proses penyimpanan data
app.post('/contact', [
    body('nama').custom((value) => {
        const duplikat = cekDuplikat(value)
        if(duplikat){
            throw new Error('Nama yang diinput sudah ada. Silahkan gunakan nama lain!')
        }
        return true
    }),
    check('email', 'Email yang diinput tidak valid!').isEmail(),
    check('nohp', 'No HP yang diinput tidak valid!').isMobilePhone('id-ID')
], (req, res) => {
    const errors = validationResult(req);

    //Lakukan pengecekan errors, apakah ada isinya atau tidak
    if(!errors.isEmpty()){
        // return res.status(400).json({ errors: errors.array() });
        res.render('add-contact', {
            title: "Form Tambah Data Contact",
            layout: "layouts/main-layout",
            errors: errors.array()
        })
    
    } else{
        addContact(req.body);
        req.flash('pesan', 'Data contact berhasil ditambahkan') // Setting flash massage
        res.redirect('/contact') //Setelah data disimpan maka langsung tampil halaman '/contact'
    }
})

//Proses hapus / delet data
app.get('/contact/delete/:nama', (req, res) => {
    // Cari data yang dikirim didalam contacts.json, dimana data yang dikirim adalah data nama
    const contact = findContact(req.params.nama)

    //Jika data yang dikirim TIDAK ADA di database, sehingga 'const contact' tidak ada isinya, maka proses selanjutnya adalah
    if(!contact){
        res.status(404)
        res.send(`<h1>404<br>Data yang akan dihapus tidak ada</h1>`)
    }
    // Jiika Berhasil (ada isinya)
    else{
        // Hapus data yang dikirim, dimana data yang dikirim ditangkap oleh req.params.nama
        deleteContact(req.params.nama)

        //Kasih Notifikasi bahwa data berhasil dihapus. Bisa menggunakan flash message yang sudah pernah dibuat
        req.flash('pesan', 'Data contact berhasil dihapus')

        // Kemudian kembalikan kehalaman contact.ejs
        res.redirect('/contact') //Setelah data disimpan maka langsung tampil halaman '/contact'
    }
})

// Edit data contact (Ada dua rout)
// 01. Rout Halaman Form Edit data kontak
app.get('/contact/edit/:nama', (req, res) => {
    //Tangkap data nama yang dikirim melalui url diatas. Kemudian lakukan pencarian berdasarkan data nama tersebut di database menggunakan function yang telah dibuat, yaitu findContact(nama)
    const contact = findContact(req.params.nama);

    res.render('edit-contact', {
        title: "Form Edit Data Contact",
        layout: "layouts/main-layout",

        // Selain mengirimkan tittle dan layout, kirimkan juga data contact yang ada pada variable const contact diatas
        contact,
    })
})

// 02. Roust Proses Ubah / edit data
app.post('/contact/update', [
    body('nama').custom((value, {req}) => {
        const duplikat = cekDuplikat(value)
        console.log(req.body.oldName)
        console.log(value)
        console.log(duplikat)
        if( value !== req.body.oldName && duplikat){
            throw new Error('Nama yang diinput sudah ada. Silahkan gunakan nama lain!')
        }
        return true
    }),
    check('email', 'Email yang diinput tidak valid!').isEmail(),
    check('nohp', 'No HP yang diinput tidak valid!').isMobilePhone('id-ID')
], (req, res) => {
    const errors = validationResult(req);

    //Lakukan pengecekan errors, apakah ada isinya atau tidak
    if(!errors.isEmpty()){
        // return res.status(400).json({ errors: errors.array() });
        res.render('edit-contact', {
            title: "Form Edita Data Contact",
            layout: "layouts/main-layout",
            errors: errors.array(),
            contact: req.body
        })
    
    } else{
        console.log(`tidak ada error`)
        res.send(req.body)
        // addContact(req.body);
        // req.flash('pesan', 'Data contact berhasil ditambahkan') // Setting flash massage
        // res.redirect('/contact') //Setelah data disimpan maka langsung tampil halaman '/contact'
    }
})

//Setting halaman Detail Contact
app.get('/contact/:nama', (req, res) => {
    // res.sendFile('./contact.html', {root: __dirname})
    const contact = findContact(req.params.nama)

    res.render('detail', {
        title: "Halaman Detail Contact",
        layout: "layouts/main-layout",
        contact,
    })
})


//Metode use(), menangkap apupun yang direquest kemudian mengeksekusi function yang ada di dalamnya. Oleh karena itu jangan letakkan metode ini di paling atas agar requestnya tidak selalu ditangkap oleh metode use() ini. Pada umumnya metode ini nerfungsi untuk menghandle request halaman yang tidak ada.

app.use('/', (req, res) => {
    res.status(404) //res.status(404) akan mengirimkan status pada webbrowser 404 (Page Not Found). Apabila metode ini tidak dikirimkan maka web akan mengirimkan status yang lain.
    res.send(`<h1>404</>`)
})

app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`)
})
