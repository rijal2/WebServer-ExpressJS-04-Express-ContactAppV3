# WebServer-ExpressJS-05-Express-ContactAppV3
Lanjutan dari seri sebelumnya.

PADA SESI KALI INI AKAN DIJELASKAN CARA MENAMBAHKAN FITUR DELETE DAN UPDATE DATA KONTAK.

Pada sesi ini proses penambahan fitur update tidak menggunakan app.put() tapi masih memanfaatkan app.get().

Skenario.
01. Menambahkan tombol HAPUS pada halaman detail.ejs
02. Membuat function hapus data.


MENAMBAH TOMBOL HAPUS
01. Buka file detail.ejs
02. Buat tombol menggunakan tag <a> kemudian hias dengan bootstrap. arahkan href nya ke '/contact/delelte/:nama'.
03. Buat rout nya menggunaka metode app.get().

    app.get('/contact/delete/:nama', (req, res) => {

    })

04. hati-hati dalam meletakkan rout tersebut, jangan sampai berada dibawah metode yang merender halaman detail,
    //Render halaman detail
    app.get('/contact/:nama', (req, res) => {
        const contact = findContact(req.params.nama)
        res.render('detail', {
            title: "Halaman Detail Contact",
            layout: "layouts/main-layout",
            contact,
        }) 
    })

    Ket:
    Jika meletakkan rout delete setelah rout yang merender halaman detail, maka rout delete tidak akan pernah dijalankan, dan request delete dimana url nya mengarah /contact/delete/:nama akan ditangkap dan dieksekusi oleh rout yang merender halaman detail (dimana akan merespon request url /contact/:nama ). Oleh karen itu letakkan rout delete di atas rout halaman detail.

FUNCTION HAPUS DATA
Function ini akan digunakan pada metode
    app.get('/contact/delete/:nama', (req, res) => {

    })

Proses pembuatan function hapus/delete data
01. Lakukan pengecekan terhadap data yang dikirim. Apakah data yang dikirim tersebut ada di dalam database atau tidak. Sebab ada kemungkinan hal terjadi. Pertama, Jika user mengirim request hapus data melalui halaman detail dengan melakukan klik pada tombol hapus, maka bisa dipastikan data yang dikirim tersebut ada didalam database, sebab yang ditampilkan dihalaman detail adalah data-data yang tersimpan didalam database. Tapi, yang Kedua, jika ada user yang iseng dengan mengirim request delete data dengan mengetik url nya secara langsung di tab search browser, maka ada kemungkinan data yang dikirim itu tidak terdapat didalam database. Oleh karena itu perlu pengecekan. seperti pada sesi sebelumnya, cari terlebih dahulu data yang direquest di database kontak yang ada di contacts.json dengan function yang sudah dibuat sebelumnya, yaitu findContact(). Jika tidak ada maka tampilkan informasi bahwa data tidak ada. Jika ada maka lakukan proses penghapusan data

02. PROSES PENGHAPUSAN DATA menggunakan function deletContact()
    Buat dulu function tersebut di dalam contacts.js

    const deleteContact = (nama) => {}

03. Export dan import function tersebut
04. Gunakan didalam metode hapus data
