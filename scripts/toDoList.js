// Define variables for input and button elements
const input = document.getElementById('input-task');
const addButton = document.getElementById('add-button');

// Define function for adding a new task to the list
function addTask() {
  // Create new li element and text node with input value
  const newTask = document.createElement('li');
  const taskText = document.createTextNode(input.value);

  // Add text node to li element
  newTask.appendChild(taskText);

  // Add li element to ul element
  document.getElementById('task-list').appendChild(newTask);

  // Reset input value
  input.value = '';
}

// Add event listener to button to call addTask function when clicked
addButton.addEventListener('click', addTask);
