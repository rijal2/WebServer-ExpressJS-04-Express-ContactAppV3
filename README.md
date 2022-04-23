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
    app.get('/contact/:nama', (req, res) => {
        
    })

