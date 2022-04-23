const fs = require('fs');


// Membaca atau mencari folder data apakah ada atau tidak menggunakan fs.existSync, jika tidak ada maka buat menggunakan fs.mkdirSync
const folder = './data'
if(!fs.existsSync(folder)){
    fs.mkdirSync(folder)
}

// Memeriksa apakah file contact.json ada atau tidak menggunakan fs.existsSync, jika tidak ada maka buat menggunakan fs.writeFileSync
const file = './data/contacts.json'
if(!fs.existsSync(file)){
    fs.writeFileSync(file, '[]', 'utf-8')
}

// Ambil semua data contact di file contacts.json
const loadContact = () => {
    const fileBuffer = fs.readFileSync('data/contacts.json', 'utf-8');
    const contacts = JSON.parse(fileBuffer)
    return contacts
}

//Ambil contact berdasarkan nama
const findContact = (nama) => {
    const contacts = loadContact();
    const contact = contacts.find((contact) => contact.nama.toLowerCase() === nama.toLowerCase())
    return contact
}

//Menuliskan / menimpa file contacts.json dengan data yang baru
const saveContacts = (contacts) => {
    fs.writeFileSync('data/contacts.json', JSON.stringify(contacts))
}

//Menambahkan databaru
const addContact = (contact) => {
    const contacts = loadContact()
    contacts.push(contact)
    saveContacts(contacts)
}

const cekDuplikat = (nama) => {
    const cotacts = loadContact()
    return cotacts.find((contact) => contact.nama === nama)
}

// Delete contact
const deleteContact = (nama) => {
    // 01. Load dulu data contactnya dengan function yang sudah dibuat
    const contacts = loadContact()

    //02. Lakukan filter terhadap contacts sesuai dengan data nama yang dikirim
    const filteredContacts = contacts.filter((contact) => contact.nama !== nama)
    // Function diatas akan melakukan filter berdasarkan 'nama' yang dikirim. Kemudian akan mengembalikan kumpulan data berupa array yang didalamnya tidak mengandung unsur 'nama' yang dikirim, hal ini sesuai perintahnya yaitu contact.nama !== nama. Sehingga const filteredContacts akan berisi data baru yang sudah tidak ada data 'nama' yang dikirim

    // 03. Simpan data baru yang ada di 'const filteredContacts' dengan menggunakan function saveContacts() yang sudah dibuat sebelumnya

    saveContacts(filteredContacts)

}

module.exports = { loadContact, findContact, addContact, cekDuplikat, deleteContact }