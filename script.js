document.addEventListener("DOMContentLoaded", () => {
    // Form Pendaftaran
    const registrationForm = document.querySelector("#registrationForm");
    if (registrationForm) {
        registrationForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const formData = new FormData(registrationForm);
            const peserta = {
                nama: formData.get("nama"),
                email: formData.get("email"),
                telepon: formData.get("telepon"),
                usia: formData.get("usia"),
                kelamin: formData.get("kelamin"),
                cabor: formData.get("cabor"),
            };
            savePeserta(peserta);
            alert("Pendaftaran berhasil!");
            registrationForm.reset();
        });
    }

    // Dashboard Admin
    if (window.location.pathname.includes("dashboard.html")) {
        renderPesertaTable();
        setupPagination();
        setupSearch();

        const participantForm = document.getElementById("participantForm");
        if (participantForm) {
            participantForm.addEventListener("submit", (e) => {
                e.preventDefault();
                saveOrUpdateParticipant();
            });
        }
    }

    // Admin Login
    const adminLoginForm = document.querySelector("#adminLoginForm");
    if (adminLoginForm) {
        adminLoginForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const username = adminLoginForm.username.value.trim();
            const password = adminLoginForm.password.value.trim();
            if (username === "admin" && password === "admin123") {
                window.location.href = "dashboard.html";
            } else {
                alert("Username atau password salah!");
            }
        });
    }
});

// Data Peserta (Mengambil dari LocalStorage)
let participants = JSON.parse(localStorage.getItem("peserta")) || [];

// Simpan Peserta ke LocalStorage
function savePeserta(peserta) {
    participants.push(peserta);
    localStorage.setItem("peserta", JSON.stringify(participants));
    if (window.location.pathname.includes("dashboard.html")) {
        renderPesertaTable();
    }
}

// Render Tabel Peserta
function renderPesertaTable(data = participants) {
    const tableBody = document.getElementById("pesertaTable");
    if (!tableBody) return; // Periksa apakah elemen ada

    const itemsPerPage = 5;
    const currentPage = parseInt(localStorage.getItem("currentPage")) || 1;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const pageData = data.slice(startIndex, endIndex);

    tableBody.innerHTML = "";
    pageData.forEach((peserta, index) => {
        tableBody.innerHTML += `
      <tr>
        <td>${startIndex + index + 1}</td>
        <td>${peserta.nama}</td>
        <td>${peserta.email}</td>
        <td>${peserta.telepon}</td>
        <td>${peserta.usia}</td>
        <td>${peserta.kelamin}</td>
        <td>${peserta.cabor}</td>
        <td>
          <button class="btn btn-warning btn-sm" data-bs-toggle="modal" data-bs-target="#participantModal" onclick="openEditForm(${startIndex + index})">Edit</button>
          <button class="btn btn-danger btn-sm" onclick="deletePeserta(${startIndex + index})">Hapus</button>
        </td>
      </tr>`;
    });

    setupPagination(data);
}

// Hapus Data Peserta
function deletePeserta(index) {
    if (confirm("Apakah Anda yakin ingin menghapus peserta ini?")) {
        participants.splice(index, 1);
        localStorage.setItem("peserta", JSON.stringify(participants));
        renderPesertaTable();
    }
}

// Setup Pagination
function setupPagination(data = participants) {
    const pagination = document.querySelector("#pagination");
    if (!pagination) return; // Periksa apakah elemen ada

    const itemsPerPage = 5;
    const totalPages = Math.ceil(data.length / itemsPerPage);
    const currentPage = parseInt(localStorage.getItem("currentPage")) || 1;

    pagination.innerHTML = "";
    for (let i = 1; i <= totalPages; i++) {
        const pageItem = `
      <li class="page-item ${i === currentPage ? "active" : ""}">
        <a class="page-link" href="#" onclick="goToPage(${i})">${i}</a>
      </li>`;
        pagination.innerHTML += pageItem;
    }
}

function goToPage(page) {
    localStorage.setItem("currentPage", page);
    renderPesertaTable();
}

// Setup Search Peserta
function setupSearch() {
    const searchBar = document.getElementById("searchBar");
    if (!searchBar) return; // Periksa apakah elemen ada

    searchBar.addEventListener("input", (e) => {
        const searchValue = e.target.value.toLowerCase();
        const filteredData = participants.filter((peserta) =>
            peserta.nama.toLowerCase().includes(searchValue)
        );
        renderPesertaTable(filteredData);
    });
}

// Tambah/Update Peserta dengan Modal
function saveOrUpdateParticipant() {
    const nama = document.getElementById("participantName").value;
    const email = document.getElementById("participantEmail").value;
    const telepon = document.getElementById("participantPhone").value;
    const usia = document.getElementById("participantAge").value;
    const kelamin = document.getElementById("participantGender").value;
    const cabor = document.getElementById("participantSport").value;
    const index = document.getElementById("participantIndex").value;

    const peserta = { nama, email, telepon, usia, kelamin, cabor };

    if (index) {
        // Update Peserta
        participants[index] = peserta;
    } else {
        // Tambah Peserta Baru
        participants.push(peserta);
    }

    localStorage.setItem("peserta", JSON.stringify(participants));
    renderPesertaTable();

    // Tutup Modal
    const modal = bootstrap.Modal.getInstance(document.getElementById("participantModal"));
    modal.hide();
}

// Buka Form Tambah Peserta
function openAddForm() {
    document.getElementById("participantForm").reset();
    document.getElementById("participantIndex").value = "";
    document.getElementById("participantModalLabel").innerText = "Tambah Peserta";
}

// Buka Form Edit Peserta
function openEditForm(index) {
    const peserta = participants[index];
    document.getElementById("participantName").value = peserta.nama;
    document.getElementById("participantEmail").value = peserta.email;
    document.getElementById("participantPhone").value = peserta.telepon;
    document.getElementById("participantAge").value = peserta.usia;
    document.getElementById("participantGender").value = peserta.kelamin;
    document.getElementById("participantSport").value = peserta.cabor;
    document.getElementById("participantIndex").value = index;
    document.getElementById("participantModalLabel").innerText = "Edit Peserta";
}

// Logout Admin
function logout() {
    window.location.href = "admin.html";
}