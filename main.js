document.addEventListener("DOMContentLoaded", function(){
    let books = [];
    const main_event = 'renderBuku';
    const save_event = 'saved-bookshelf';
    const storage_key = 'bookshelf';

    document.addEventListener(save_event, function(){
        console.log(localStorage.getItem(storage_key));
        alert('Data anda tersimpan di browser!');
    });

    function renderBuku() {
        const dataBuku = localStorage.getItem(storage_key);
        let data = JSON.parse(dataBuku);

        if (data !== null) {
            for (const buku of data) {
                books.push(buku)
            }
        }

        document.dispatchEvent(new Event(main_event));
    }

    function verifikasiBrowser() {
        if (typeof (Storage) === undefined) {
            alert('Maaf Browser kamu tidak mendukung Web Storage.')
            return false;
        }
        return true;
    }

    const submitBuku = document.getElementById('bookForm');
    submitBuku.addEventListener('submit', function(event) {
        event.preventDefault();
        addBuku();
    });

    function saveData() {
        if (verifikasiBrowser()) {
            const parsed = JSON.stringify(books);
            localStorage.setItem(storage_key, parsed);
            document.dispatchEvent(new Event(save_event));
        }
    }

    function addBuku() {
        const judul = document.getElementById('bookFormTitle').value;
        const penulis = document.getElementById('bookFormAuthor').value;
        const tahun = document.getElementById('bookFormYear').value;

        const buatID = generateID();
        const objectBuku = generateBook(buatID, judul, penulis, tahun, false);
        books.push(objectBuku);

        document.dispatchEvent(new Event(main_event));
        saveData();
    }

    function generateID() {
        return +new Date();
    }

    function generateBook(id, judul, penulis, tahun, isCompleted) {
        return {
            id,
            judul,
            penulis,
            tahun,
            isCompleted
        }
    }

    function buatListBuku(objectBuku) {
        const judulBuku = document.createElement('h2');
        judulBuku.setAttribute('data-testid', 'bookItemTitle');
        judulBuku.innerText = objectBuku.judul;

        const penulisBuku = document.createElement('p');
        penulisBuku.setAttribute('data-testid', 'bookItemAuthor');
        penulisBuku.innerText = objectBuku.penulis;

        const tahunBuku = document.createElement('p');
        tahunBuku.setAttribute('data-testid', 'bookItemYear')
        tahunBuku.innerText = objectBuku.tahun;

        const kontainerTeks = document.createElement('div');
        kontainerTeks.classList.add('inner');
        kontainerTeks.append(judulBuku, penulisBuku, tahunBuku);

        const container = document.createElement('div');
        container.setAttribute('data-testid', 'bookItem');
        container.setAttribute('data-bookid', 'id');
        container.append(kontainerTeks);

        if (objectBuku.isCompleted) {
            const belumSelesaiDibaca = document.createElement('button');
            belumSelesaiDibaca.classList.add('belum-selesai');
            belumSelesaiDibaca.setAttribute('data-testid', 'bookItemUnCompleteButton')
            belumSelesaiDibaca.innerHTML = 'Pindah ke Belum Selesai'; 

            belumSelesaiDibaca.addEventListener('click', function () {
                pindahKeBelumSelesai(objectBuku.id);
            });

            const hapusBuku = document.createElement('button');
            hapusBuku.setAttribute('data-testid', 'bookItemDeleteButton');
            hapusBuku.classList.add('hapus-buku');
            hapusBuku.innerHTML = 'Hapus Buku';

            hapusBuku.addEventListener('click', function() {
                removeBookFromCompleted(objectBuku.id);
            });

            container.append(belumSelesaiDibaca, hapusBuku);
        } else {
            const TandaiSelesai = document.createElement('button');
            TandaiSelesai.setAttribute('data-testid', 'bookItemIsCompleteButton');
            TandaiSelesai.classList.add('tandai-selesai');
            TandaiSelesai.innerHTML = 'Tandai Selesai';

            TandaiSelesai.addEventListener('click', function(){
                tambahBukuKeSelesai(objectBuku.id);
            });
            container.append(TandaiSelesai);

            const hapusBukuSatu = document.createElement('button');
            hapusBukuSatu.setAttribute('data-testid', 'bookItemDeleteButton');
            hapusBukuSatu.classList.add('hapus-buku');
            hapusBukuSatu.innerHTML = 'Hapus Buku';

            hapusBukuSatu.addEventListener('click', function() {
                removeBookFromCompleted(objectBuku.id);
            });
            container.append(hapusBukuSatu);
        }
        
        return container;
    }

    document.addEventListener(main_event, function () {
        const belumDibaca = document.getElementById('incompleteBookList');
        belumDibaca.innerHTML = '';

        const sudahDibaca = document.getElementById('completeBookList');
        sudahDibaca.innerHTML = '';

        for (const bukuBuku of books) {
            const elementBuku = buatListBuku(bukuBuku);
            if (!bukuBuku.isCompleted) {
                belumDibaca.append(elementBuku);
            } else {
                sudahDibaca.append(elementBuku);
            }
        }
    });

    function tambahBukuKeSelesai (bookID) {
        const bukuSaya = findBook(bookID);

        if (bukuSaya == null) return; 

        bukuSaya.isCompleted = true;
        document.dispatchEvent(new Event(main_event));
        saveData();
    }

    function findBook(bookID) {
        for (const bookItem of books) {
            if (bookItem.id == bookID) {
                return bookItem;
            }
        }
        return null;
    }

    function findBookIndex(bookID) {
        for (const index of books) {
            if (books[index].id == bookID) {
                return index;
            }
        }
        return -1;
    }

    function removeBookFromCompleted (bookID) {
        const bukuSaya = findBook(bookID);

        if (bukuSaya === -1) return; 
        
        books.splice(bukuSaya, 1);
        document.dispatchEvent(new Event(main_event));
        saveData();
    }

    function pindahKeBelumSelesai(bookID) {
        const book = findBook(bookID);

        if (book == null) return;

        book.isCompleted = false;
        document.dispatchEvent(new Event(main_event));
        saveData();
    }

    if (verifikasiBrowser) {
        renderBuku();
    }

    
    
});
