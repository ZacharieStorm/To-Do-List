const form = document.querySelector('#todo-form');
const input = document.querySelector('#todo-input');
const list = document.querySelector('#todo-list');
const filter = document.querySelector('#todo-filter');
const clearBtn = document.querySelector('#clear-completed');

let todos = [];

// Check if there are items in localStorage
if (localStorage.getItem('todos')) {
  todos = JSON.parse(localStorage.getItem('todos'));
}

// Display the todos
displayTodos();

// Add a todo
form.addEventListener('submit', (event) => {
  event.preventDefault();
  addTodo();
});

function addTodo() {
  const todoText = input.value.trim();
  if (todoText === '') return;
  const todo = {
    id: Date.now(),
    text: todoText,
    completed: false
  };
  todos.push(todo);
  input.value = '';
  displayTodos();
  saveTodos();
}

// Display the todos
function displayTodos() {
  list.innerHTML = '';
  let filteredTodos = [];
  const selectedFilter = filter.querySelector('.active').id;
  if (selectedFilter === 'filter-all') {
    filteredTodos = todos;
  } else if (selectedFilter === 'filter-active') {
    filteredTodos = todos.filter(todo => !todo.completed);
  } else if (selectedFilter === 'filter-completed') {
    filteredTodos = todos.filter(todo => todo.completed);
  }
  filteredTodos.forEach(todo => {
    const li = document.createElement('li');
    li.classList.add('todo-item');
    if (todo.completed) {
      li.classList.add('completed');
    }
    li.innerHTML = `
      <span class="task">${todo.text}</span>
      <input class="edit" type="text" value="${todo.text}">
      <div class="actions">
        <button class="complete" data-id="${todo.id}">&#10003;</button>
        <button class="edit-btn" data-id="${todo.id}">Edit</button>
        <button class="delete" data-id="${todo.id}">&times;</button>
      </div>
    `;
    list.appendChild(li);
  });
}

// Complete a todo
list.addEventListener('click', (event) => {
  if (!event.target.matches('button.complete')) return;
  const selectedTodo = todos.find(todo => todo.id === Number(event.target.dataset.id));
  selectedTodo.completed = !selectedTodo.completed;
  displayTodos();
  saveTodos();
});

// Edit a todo
list.addEventListener('click', (event) => {
  if (!event.target.matches('button.edit-btn')) return;
  const selectedTodo = todos.find(todo => todo.id === Number(event.target.dataset.id));
  const taskSpan = event.target.parentNode.previousElementSibling;
  const editInput = event.target.parentNode.parentNode.querySelector('.edit');
  const isEditing = event.target.parentNode.parentNode.classList.contains('editing');
  if (isEditing) {
    const newText = editInput.value.trim();
    if (newText !== '') { // Verify that the new todo text is not empty
      selectedTodo.text = newText;
      taskSpan.textContent = selectedTodo.text;
      saveTodos();
    } else {
      alert('The task cannot be empty');
      editInput.focus();
      return;
    }
    event.target.textContent = 'Edit';
  } else {
    editInput.value = selectedTodo.text;
    taskSpan.textContent = '';
    event.target.textContent = 'Save';
  }
  event.target.parentNode.parentNode.classList.toggle('editing');
  displayTodos();
});


// Delete a todo
list.addEventListener('click', (event) => {
  if (!event.target.matches('button.delete')) return;
  const selectedTodoIndex = todos.findIndex(todo => todo.id === Number(event.target.dataset.id));
  todos.splice(selectedTodoIndex, 1);
  displayTodos();
  saveTodos();
});

// Filter the todos
filter.addEventListener('click', (event) => {
  if (!event.target.matches('button')) return;
  filter.querySelector('.active').classList.remove('active');
  event.target.classList.add('active');
  displayTodos();
  });
  
  // Clear completed todos
  clearBtn.addEventListener('click', () => {
  todos = todos.filter(todo => !todo.completed);
  displayTodos();
  saveTodos();
  });
  
  // Save the todos to localStorage
  function saveTodos() {
  localStorage.setItem('todos', JSON.stringify(todos));
  }
  
  
