// admin.js - provides admin CRUD UI for books using booksAPI (localStorage-backed)
document.addEventListener('DOMContentLoaded', () => {
    const booksTableBody = document.querySelector('#adminBooksTable tbody');
    const addForm = document.getElementById('addBookForm');
    const cancelBtn = document.getElementById('cancelEdit');
    const editIdInput = document.getElementById('editId');

    function escapeHtml(s){ if(!s) return ''; return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

    function renderAdminList(){
        const books = window.booksAPI.getBooks() || [];
        booksTableBody.innerHTML = '';
        books.forEach(b => {
            const tr = document.createElement('tr');
            tr.innerHTML = `<td>${b.id}</td><td>${escapeHtml(b.title)}</td><td>$${b.price}</td><td>${b.stock}</td><td><button class="edit" data-id="${b.id}">Edit</button> <button class="del" data-id="${b.id}">Delete</button></td>`;
            booksTableBody.appendChild(tr);
        });
        booksTableBody.querySelectorAll('button.edit').forEach(btn => btn.addEventListener('click', onEdit));
        booksTableBody.querySelectorAll('button.del').forEach(btn => btn.addEventListener('click', onDelete));
        renderUserBooks();
    }

    function renderUserBooks(){
        const container = document.getElementById('booksContainer');
        const books = window.booksAPI.getBooks() || [];
        container.innerHTML = '';
        books.forEach(b => {
            const div = document.createElement('div');
            div.className = 'book';
            div.innerHTML = `<img src="${escapeHtml(b.img||'') || 'https://via.placeholder.com/120x160?text=No+Image'}" alt="${escapeHtml(b.title)}"><h3>${escapeHtml(b.title)}</h3><p class="price">$${b.price}</p><p class="desc">${escapeHtml(b.desc||'')}</p><button class="add-cart">Add to Cart</button>`;
            container.appendChild(div);
            const btn = div.querySelector('button.add-cart');
            btn.addEventListener('click', () => typeof addToCart === 'function' ? addToCart(b.title, b.price) : alert('addToCart not available'));
        });
    }

    function onEdit(e){
        const id = Number(e.target.dataset.id);
        const books = window.booksAPI.getBooks() || [];
        const book = books.find(x => x.id === id);
        if(!book) return;
        document.getElementById('title').value = book.title;
        document.getElementById('price').value = book.price;
        document.getElementById('img').value = book.img || '';
        document.getElementById('stock').value = book.stock;
        document.getElementById('desc').value = book.desc || '';
        editIdInput.value = book.id;
        cancelBtn.style.display = 'inline-block';
    }

    function onDelete(e){
        const id = Number(e.target.dataset.id);
        if(!confirm('Delete book ID ' + id + '?')) return;
        window.booksAPI.removeBook(id);
        renderAdminList();
    }

    addForm.addEventListener('submit', (ev) => {
        ev.preventDefault();
        const id = editIdInput.value ? Number(editIdInput.value) : null;
        const book = {
            title: document.getElementById('title').value.trim(),
            price: Number(document.getElementById('price').value) || 0,
            img: document.getElementById('img').value.trim(),
            stock: Number(document.getElementById('stock').value) || 0,
            desc: document.getElementById('desc').value.trim()
        };
        if(id){
            book.id = id;
            window.booksAPI.updateBook(book);
        } else {
            window.booksAPI.addBook(book);
        }
        addForm.reset();
        editIdInput.value = '';
        cancelBtn.style.display = 'none';
        renderAdminList();
    });

    cancelBtn.addEventListener('click', () => {
        addForm.reset();
        editIdInput.value = '';
        cancelBtn.style.display = 'none';
    });

    renderAdminList();
});
