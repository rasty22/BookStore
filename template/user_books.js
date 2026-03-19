// user_books.js - renders books for normal user dashboard using booksAPI
document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('booksContainer');
    function escapeHtml(s){ if(!s) return ''; return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

    function render(){
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

    render();
});
