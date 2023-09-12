document.addEventListener('DOMContentLoaded', function () {
    // Get references to HTML elements
    const articleForm = document.querySelector('#articleForm');
    const titleInput = document.getElementById('title');
    const articlesTable = document.getElementById('articlesTable');
    const articleContent = document.getElementById('articleContent');
    const editorContent = document.getElementById('editor-content');
    const editorToolbar = document.querySelector('.editor-toolbar');
    const linkUrlInput = document.getElementById('linkUrl');
    const imageFileInput = document.getElementById('imageFile');

    // Load existing articles from localStorage
    const storedArticles = JSON.parse(localStorage.getItem('articles')) || [];

    // Update the articles table in the HTML
    function updateArticlesTable() {
        articlesTable.innerHTML = `
            <thead>
                <tr>
                    <th>Title</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody id="articleContent"></tbody>
        `;

        for (const [index, article] of storedArticles.entries()) {
            // Create new rows for title and actions
            const newRow = articlesTable.querySelector('tbody').insertRow();
            const titleCell = newRow.insertCell();
            const actionsCell = newRow.insertCell();

            // Set title and actions content
            titleCell.textContent = article.title;

            actionsCell.innerHTML = `
                <div class="btn-container">
                    <button class="btn-edit" data-index="${index}">Edit</button>
                    <button class="btn-delete" data-index="${index}">Delete</button>
                </div>
            `;

            // Create a row for content
            const contentRow = articlesTable.querySelector('tbody').insertRow();
            const contentCell = contentRow.insertCell();
            contentCell.classList.add('article-content');
            contentCell.colSpan = 2;
            contentCell.innerHTML = article.content;
            contentCell.style.display = 'none';
        }
    }

    // Load articles from localStorage when the page loads
    window.addEventListener('load', function () {
        updateArticlesTable();
    });

    // Handle form submission for adding/editing articles
    articleForm.addEventListener('submit', function (event) {
        event.preventDefault();

        // Get input values
        const title = titleInput.value;
        const content = editorContent.innerHTML;

        // Check if editing or adding a new article
        const editIndex = articleForm.getAttribute('data-edit-index');

        if (editIndex !== null) {
            // Editing an existing article
            storedArticles[editIndex] = { title, content };
            articleForm.removeAttribute('data-edit-index');
        } else {
            // Adding a new article
            storedArticles.push({ title, content });
        }

        // Update localStorage and the article table in the HTML
        localStorage.setItem('articles', JSON.stringify(storedArticles));
        updateArticlesTable();

        // Reset form inputs
        titleInput.value = '';
        editorContent.innerHTML = '';
    });

    // Handle clicks on the articles table
    articlesTable.addEventListener('click', function (event) {
        if (event.target.classList.contains('btn-edit')) {
            // Edit button clicked, populate form for editing
            const index = event.target.getAttribute('data-index');
            const article = storedArticles[index];
            titleInput.value = article.title;
            editorContent.innerHTML = article.content;
            articleForm.setAttribute('data-edit-index', index);
        } else if (event.target.classList.contains('btn-delete')) {
            // Delete button clicked, remove article from array
            const index = event.target.getAttribute('data-index');
            storedArticles.splice(index, 1);

            // Update localStorage and the article table in the HTML
            localStorage.setItem('articles', JSON.stringify(storedArticles));
            updateArticlesTable();
        }
    });

    // Function to add an element to the article's content
    function addToArticle(content) {
        const element = document.createElement('div');
        element.innerHTML = content;
        editorContent.appendChild(element);
    }

    // Handle click events for adding images
    document.getElementById('addImage').addEventListener('click', (event) => {
        event.preventDefault();
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.addEventListener('change', (event) => {
            // Handle image file selection and display
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    addToArticle(`<img src="${e.target.result}" alt="Image">`);
                };
                reader.readAsDataURL(file);
            }
        });
        input.click();
    });

    // Handle click events for adding videos
    document.getElementById('addVideo').addEventListener('click', (event) => {
        event.preventDefault();
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'video/*';
        input.addEventListener('change', (event) => {
            // Handle video file selection and display
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    addToArticle(`<video controls><source src="${e.target.result}" type="video/mp4">Your browser does not support the video tag.</video>`);
                };
                reader.readAsDataURL(file);
            }
        });
        input.click();
    });

    // Handle click events for adding images via URL
    document.getElementById('addImageUrl').addEventListener('click', (event) => {
        event.preventDefault();
        const imageUrl = prompt('Enter image URL:');
        if (imageUrl) {
            addToArticle(`<img src="${imageUrl}" alt="Image">`);
        }
    });

    // Handle click events for adding videos via URL
    document.getElementById('addVideoUrl').addEventListener('click', (event) => {
        event.preventDefault();
        const videoUrl = prompt('Enter video URL:');
        if (videoUrl) {
            addToArticle(`<video controls><source src="${videoUrl}" type="video/mp4">Your browser does not support the video tag.</video>`);
        }
    });

    // Save content to local storage before leaving the page
    window.addEventListener('beforeunload', () => {
        localStorage.setItem('articles', JSON.stringify(storedArticles));
    });

    // Add new editor functionalities
    editorToolbar.addEventListener('click', (event) => {
        const target = event.target;
        if (target.classList.contains('btn-editor')) {
            const tag = target.getAttribute('data-tag');
            if (tag === 'link') {
                linkUrlInput.style.display = 'inline-block';
                linkUrlInput.focus();
            } else if (tag === 'image') {
                imageFileInput.style.display = 'inline-block';
                imageFileInput.click();
            } else {
                document.execCommand(tag);
            }
        }
    });

    linkUrlInput.addEventListener('blur', () => {
        const url = linkUrlInput.value;
        document.execCommand('createLink', false, url);
        linkUrlInput.style.display = 'none';
        linkUrlInput.value = '';
    });

    imageFileInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = `<img src="${e.target.result}" alt="Image">`;
                document.execCommand('insertHTML', false, img);
            };
            reader.readAsDataURL(file);
        }
        imageFileInput.style.display = 'none';
        imageFileInput.value = '';
    });
});

// Drag-and-drop functionality
const dropContainer = document.querySelector('.drop-container');
const editor = document.getElementById('editor-content');

dropContainer.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropContainer.classList.add('drag-over');
});

dropContainer.addEventListener('dragleave', () => {
    dropContainer.classList.remove('drag-over');
});

dropContainer.addEventListener('drop', (e) => {
    e.preventDefault();
    dropContainer.classList.remove('drag-over');

    const files = e.dataTransfer.files;
    for (const file of files) {
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const img = document.createElement('img');
                img.src = event.target.result;
                img.alt = 'Dropped Image';
                img.classList.add('dragged-item');
                editor.appendChild(img);
            };
            reader.readAsDataURL(file);
        }
    }
});
