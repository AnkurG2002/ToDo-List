let tasks = [];
const taskList = document.getElementById('list');
const addTaskInput = document.getElementById('add');
const tasksCounter = document.getElementById('tasks-counter');

// show date
const dateElement = document.getElementById("date");
const options = {weekday : "long", month:"short", day:"numeric"};
const today = new Date();
dateElement.innerHTML = today.toLocaleDateString("en-US", options);


async function fetchToDos () {
    // GET request
    // fetch('https://jsonplaceholder.typicode.com/todos')  // it will return a promise
    // .then(function (response) {
    //     return response.json();  // this will give you another promise   
    // }).then(function (data) {
    //     tasks = data.slice(0, 10);
    //     renderList();
    // })
    // .catch(function (error) {
    //     console.log('error', error);
    // }) 

    // async - await
    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/todos');
        const data = await response.json();
        tasks = data.slice(0, 10);
        renderList();
    } catch (error) {
        console.log(error);
    }
}

function addTaskToDOM (task) {
    const li = document.createElement('li');

    li.innerHTML = `
        <input type="checkbox" id="${task.id}" ${task.completed ? 'checked' : ''} class="custom-checkbox">
        <label for="${task.id}">${task.title}</label>
        <img src="https://img.icons8.com/parakeet/48/null/delete.png" class="delete" data-id="${task.id}" />
    `;

    taskList.append(li);
}

function renderList () {
    taskList.innerHTML = ``;

    for(let i = 0; i < tasks.length; i++){
        addTaskToDOM(tasks[i]);
    }
    tasksCounter.innerHTML = tasks.length;
}

function toggleTask (taskId) {
    const task = tasks.filter(function (task) {
        return task.id === Number(taskId);
    });

    if(task.length > 0) {
        const currentTask = task[0];
        currentTask.completed = !currentTask.completed;
        renderList();
        // showNotification('Task toggled successfully');
        return;
    }
    showNotification('could not toggle the task');
}

function deleteTask (taskId) {
    const newTasks = tasks.filter(function (task) {
        return task.id !== Number(taskId);
    });
    tasks = newTasks;
    renderList();
    // showNotification('Task deleted successfully');
}

function addTask (task) {
    if(task) {
        // POST request method
        // doing this we update our local state as well as our server state
        // fetch('https://jsonplaceholder.typicode.com/todos', {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json',
        //     },
        //     body: JSON.stringify(task),
        // }).then(function (response) {
        //     return response.json();   
        // }).then(function (data) {
        //     console.log(data);
        //     tasks.push(task);
        //     renderList();
        // })
        // .catch(function (error) {
        //     console.log('error', error);
        // })


        tasks.push(task);
        renderList();
        // showNotification('Task Added Successfully');
        return;
    }
    showNotification('Task cannot be added');
}

function showNotification(text) {
    alert(text);
}

function handleInputKeypress(e) {
    if(e.key === 'Enter') {
        const text = e.target.value;
        console.log('text: ', text);

        if(!text) {
            showNotification('Task Text cannot be empty');
            return;
        }

        const task = {
            title: text,
            id: Date.now(),
            completed: false
        }
        e.target.value = '';
        addTask(task);
    }
}

function handleClick (e) {
    const target = e.target;

    if(target.className === 'delete') {
        const taskId = target.dataset.id;
        deleteTask(taskId);
    }
    else if(target.className === 'custom-checkbox') {
        const taskId = target.id;
        toggleTask(taskId);
    }
}

function initializeApp () {
    fetchToDos();
    addTaskInput.addEventListener('keyup', handleInputKeypress);
    document.addEventListener('click', handleClick);
}
initializeApp();