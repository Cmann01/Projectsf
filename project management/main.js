
document.addEventListener("DOMContentLoaded", function () {
    const createTaskForm = document.getElementById("createTaskForm");
    const taskList = document.getElementById("taskList");
    const chatMessage = document.getElementById("chatMessage");
    const sendButton = document.getElementById("sendButton");
    const chatMessages = document.getElementById("chatMessages");
    const filterButtons = document.querySelectorAll(".filter-button");

    // Sample data for tasks (you can replace this with your data)
    const tasks = [
        { taskName: 'Task 1', assignedTo: 'Pratiksha', dueDate: '2023-09-30', description: 'Description for Task 1' },
    { taskName: 'Task 2', assignedTo: 'Govindraj', dueDate: '2023-10-15', description: 'Description for Task 2' },
    // Add more tasks here
       
    ];

    // Function to add a task to the task list
    function addTask(task) {
        const taskItem = document.createElement("li");
        taskItem.innerHTML = `
            <div class="task-item ${task.status}">
                <h3>${task.taskName}</h3>
                <p><strong>Assigned to:</strong> ${task.assignedTo}</p>
                <p><strong>Due Date:</strong> ${task.dueDate}</p>
                <p><strong>Description:</strong> ${task.description}</p>
                <div class="task-actions">
                    <button class="status-button" data-task-index="${tasks.indexOf(task)}">${task.status === "completed" ? "Reopen" : "Complete"}</button>
                </div>
            </div>
        `;
        taskList.appendChild(taskItem);
    }

    // Function to filter tasks based on status
    function filterTasks(status) {
        const taskItems = document.querySelectorAll(".task-item");
        taskItems.forEach((taskItem) => {
            if (status === "all" || taskItem.classList.contains(status)) {
                taskItem.style.display = "block";
            } else {
                taskItem.style.display = "none";
            }
        });
        // Function to update the active filter button
    function updateActiveFilterButton(activeButton) {
        filterButtons.forEach(button => {
            button.classList.remove("active");
        });
        activeButton.classList.add("active");
    }

    // Event listener for filter buttons
    filterButtons.forEach(button => {
        button.addEventListener("click", function () {
            const filter = this.getAttribute("data-filter");
            filterTasks(filter);
            updateActiveFilterButton(this);
        });
    });

    }

    // Add initial tasks to the task list
    tasks.forEach(addTask);

    // Filter tasks when a filter button is clicked
    filterButtons.forEach((button) => {
        button.addEventListener("click", function () {
            const filter = this.getAttribute("data-filter");
            filterTasks(filter);
        });
    });

    createTaskForm.addEventListener("submit", function (e) {
        e.preventDefault();

        // Get form input values
        const taskName = document.getElementById("taskName").value;
        const assignedTo = document.getElementById("assignedTo").value;
        const dueDate = document.getElementById("dueDate").value;
        const description = document.getElementById("description").value;

        // Create a new task object
        const newTask = {
            taskName,
            assignedTo,
            dueDate,
            description,
            status: "open", // Default status is open
        };

        // Add the new task to the tasks array
        tasks.push(newTask);

        // Add the new task to the task list
        addTask(newTask);

        // Clear form inputs
        createTaskForm.reset();

        // Filter tasks based on the currently selected filter
        const activeFilter = document.querySelector(".filter-button.active");
        if (activeFilter) {
            filterTasks(activeFilter.getAttribute("data-filter"));
        }
    });

    // Update task status (complete/reopen) when the status button is clicked
    taskList.addEventListener("click", function (e) {
        if (e.target.classList.contains("status-button")) {
            const taskIndex = parseInt(e.target.getAttribute("data-task-index"));
            const task = tasks[taskIndex];
            if (task.status === "open") {
                task.status = "completed";
            } else {
                task.status = "open";
            }

            // Update the task's status in the UI
            const taskItem = e.target.closest(".task-item");
            taskItem.classList.toggle("completed");
            e.target.textContent = task.status === "completed" ? "Reopen" : "Complete";
        }
    });

    sendButton.addEventListener("click", function () {
        const writerName = document.getElementById("writerName").value;
        const messageText = chatMessage.value;

        if (writerName && messageText) {
            const message = document.createElement("div");
            message.className = "message";
            message.innerHTML = `<strong>${writerName}:</strong> ${messageText}`;
            chatMessages.appendChild(message);
            chatMessage.value = "";

            // Scroll to the bottom of the chat messages
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }
    });
});
