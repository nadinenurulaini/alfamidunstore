const books = [];
const LOAD_BOOK = "render-book";

function makeId() {
  return +new Date();
}

function makeDataBook(id, name, date, expiryDate, quantity, price, image, isComplete) {
  return {
    id,
    name,
    date,
    expiryDate,
    quantity,
    price,
    image,
    isComplete,
  };
}

function getBook(id) {
  return books.find((book) => book.id === id) || null;
}

function getIndex(id) {
  return books.findIndex((book) => book.id === id);
}

function saveData() {
  const dataLocal = JSON.stringify(books);
  localStorage.setItem("STORAGE_BOOK", dataLocal);
}

function deleteBook(id) {
  const target = getIndex(id);
  if (target !== -1) {
    books.splice(target, 1);
    saveData();
    document.dispatchEvent(new Event(LOAD_BOOK));
  }
}

function addAlreadyReadBook(id) {
  const target = getBook(id);
  if (target) {
    target.isComplete = true;
    saveData();
    document.dispatchEvent(new Event(LOAD_BOOK));
  }
}

function undoBook(id) {
  const target = getBook(id);
  if (target) {
    target.isComplete = false;
    saveData();
    document.dispatchEvent(new Event(LOAD_BOOK));
  }
}

// Daftar nama bulan dalam bahasa Indonesia
const bulanIndonesia = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember"
];

function formatTanggal(tanggal) {
  const dateObj = new Date(tanggal);
  const tanggalHari = dateObj.getDate();
  const bulan = dateObj.getMonth();
  const tahun = dateObj.getFullYear();
  return `${tanggalHari} ${bulanIndonesia[bulan]} ${tahun}` ;
}

function makeListBook(itemBook) { 
  const nameTask = document.createElement("h2");
  nameTask.innerText = itemBook.name;

  const dateTask = document.createElement("p");
  dateTask.innerText = `Tanggal Penjualan: ${formatTanggal(itemBook.date)}` ;

  const expiryTask = document.createElement("p");
  expiryTask.innerText = `Tanggal Kadaluarsa: ${formatTanggal(itemBook.expiryDate)}` ;

  const quantityTask = document.createElement("p");
  quantityTask.innerText = `Jumlah Produk: ${itemBook.quantity}` ;

  const priceTask = document.createElement("p");
  priceTask.innerText = `Harga: Rp${parseInt(itemBook.price).toLocaleString()}` ;

  const imageElement = document.createElement("img");
  imageElement.src = itemBook.image;

  const textContainer = document.createElement("div");
  textContainer.append(nameTask, imageElement, dateTask, expiryTask, quantityTask, priceTask);

  const containerListBook = document.createElement("div");
  containerListBook.classList.add("container-list-book");
  containerListBook.append(textContainer);
  containerListBook.setAttribute("id", `BOOK-${itemBook.id}` );

  if (itemBook.isComplete) {
    const buttonUndo = document.createElement("button");
    buttonUndo.classList.add("button-undo");
    buttonUndo.innerHTML = "Belum Selesai";

    buttonUndo.addEventListener("click", function () {
      Swal.fire({
        title: "Apakah kamu yakin?",
        text: "Untuk mengembalikan stok barang ini?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Iya, kembalikan",
        cancelButtonText: "Batal",
      }).then((result) => {
        if (result.isConfirmed) {
          undoBook(itemBook.id);
          Swal.fire("Berhasil", "Stok barang sudah dikembalikan!", "success");
        }
      });
    });

    const buttonHapus = document.createElement("button");
    buttonHapus.classList.add("button-hapus-already-read");
    buttonHapus.innerHTML = "Hapus";

    buttonHapus.addEventListener("click", function () {
      Swal.fire({
        title: "Apakah Kamu Yakin?",
        text: "Yakin menghapus stok barang ini?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Ya, hapus",
        cancelButtonText: "Batal",
      }).then((result) => {
        if (result.isConfirmed) {
          deleteBook(itemBook.id);
          Swal.fire("Terhapus", "Stok barang sudah dihapus.", "success");
        }
      });
    });

    containerListBook.append(buttonUndo, buttonHapus);
  } else {
    const buttonSelesai = document.createElement("button");
    buttonSelesai.classList.add("button-selesai");
    buttonSelesai.innerHTML = "Selesai";

    buttonSelesai.addEventListener("click", function () {
      Swal.fire({
        title: "Apakah Kamu Yakin?",
        text: "Untuk menyelesaikan stok barang ini?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Ya, selesai",
        cancelButtonText: "Batal",
      }).then((result) => {
        if (result.isConfirmed) {
          addAlreadyReadBook(itemBook.id);
          Swal.fire("Selesai", "Stok barang sudah diselesaikan!", "success");
        }
      });
    });

    const buttonHapus = document.createElement("button");
    buttonHapus.classList.add("button-hapus-unread");
    buttonHapus.innerHTML = "Hapus";

    buttonHapus.addEventListener("click", function () {
      Swal.fire({
        title: "Apakah Kamu Yakin?",
        text: "Yakin menghapus stok barang ini?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Ya, hapus",
        cancelButtonText: "Batal",
      }).then((result) => {
        if (result.isConfirmed) {
          deleteBook(itemBook.id);
          Swal.fire("Terhapus", "Stok barang sudah dihapus.", "success");
        }
      });
    });

    containerListBook.append(buttonSelesai, buttonHapus);
  }

  return containerListBook;
}

document.addEventListener(LOAD_BOOK, function () {
  const unreadBook = document.getElementById("books");
  const alreadyreadBook = document.getElementById("alreadyread-books");
  unreadBook.innerHTML = "";
  alreadyreadBook.innerHTML = "";

  for (const itemBook of books) {
    const listBook = makeListBook(itemBook);
    if (!itemBook.isComplete) unreadBook.append(listBook);
    else alreadyreadBook.append(listBook);
  }
});

function addBooks() {
  const nameTask = document.getElementById("name").value;
  const dateTask = document.getElementById("date").value;
  const expiryDate = document.getElementById("expiryDate").value;
  const quantity = document.getElementById("quantity").value;
  const price = document.getElementById("price").value;
  const imageTask = document.getElementById("image").files[0];

  const makeID = makeId();
  const isComplete = false;

  if (imageTask) {
    const reader = new FileReader();
    reader.onload = function (e) {
      const imageUrl = e.target.result;
      const dataBook = makeDataBook(makeID, nameTask, dateTask, expiryDate, quantity, price, imageUrl, isComplete);
      books.push(dataBook);
      saveData();
      document.dispatchEvent(new Event(LOAD_BOOK));
    };
    reader.readAsDataURL(imageTask);
  }
}

function loadDataBookLocalStorage() {
  const allLocalDataBook = localStorage.getItem("STORAGE_BOOK");
  const data = JSON.parse(allLocalDataBook) || [];

  books.push(...data);
  document.dispatchEvent(new Event(LOAD_BOOK));
}

document.addEventListener("DOMContentLoaded", function () {
  const inputForm = document.getElementById("form");
  inputForm.addEventListener("submit", function (event) {
    event.preventDefault();
    addBooks();
  });
  loadDataBookLocalStorage();
});