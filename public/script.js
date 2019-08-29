function itemTemplate(item) {
  return `<li class="list-group-item list-group-item-action d-flex align-items-center justify-content-between">
        <span class="item-text">${item.text}</span>
        <div>
          <button data-id="${item._id}" class="edit-me btn btn-secondary btn-sm mr-1">Edit</button>
          <button data-id="${item._id}" class="delete-me btn btn-danger btn-sm">Delete</button>
        </div>
      </li>`;
}
// Initial page load rendering
let itemsData = items.map(item => itemTemplate(item)).join('');

document.querySelector('#item-list').insertAdjacentHTML('beforeend', itemsData);
//Create Feature
let createField = document.querySelector('#create-field');

document.querySelector('#create-form').addEventListener('submit', e => {
  e.preventDefault();

  axios
    .post('/create-item', {
      text: createField.value,
    })
    .then(response => {
      // Create the HTML for a new field
      document
        .querySelector('#item-list')
        .insertAdjacentHTML('beforeend', itemTemplate(response.data));

      createField.value = '';
      createField.focus();
    })
    .catch(() => {
      console.log('Please try again later');
    });
});
document.addEventListener('click', e => {
  // Delete Feature
  if (e.target.classList.contains('delete-me')) {
    if (confirm('Item will be deleted permanently')) {
      let id = e.target.getAttribute('data-id');
      axios
        .post('/delete-item', {
          id,
        })
        .then(() => {
          e.target.parentElement.parentElement.remove();
        })
        .catch(() => {
          console.log('Please try again later');
        });
    }
  }
  // Update Feature
  if (e.target.classList.contains('edit-me')) {
    const todoElement = e.target.parentElement.parentElement.querySelector(
      '.item-text'
    );
    let userInput = prompt(
      'Enter your desired new text',
      todoElement.innerHTML
    );
    if (userInput) {
      axios
        .post('/update-item', {
          text: userInput,
          id: e.target.getAttribute('data-id'),
        })
        .then(() => {
          todoElement.innerHTML = userInput;
        })
        .catch(() => {
          console.log('Please try again later');
        });
    }
  }
});
