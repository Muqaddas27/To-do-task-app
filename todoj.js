let input = document.querySelector("#taskInput");
let submitButton = document.querySelector("#submitButton");
let list = document.querySelector("#taskList");
let numbers = document.querySelector("#numbers");
let progress = document.querySelector("#progress");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

renderTasks();

submitButton.addEventListener("click", function (e) {
  e.preventDefault();
  let text = input.value.trim();
  if (text !== "") {
    let newTask = { text: text, completed: false };
    tasks.push(newTask);
    saveTasks();
    renderTasks();
  }
  input.value = "";
});

function renderTasks() {
  list.innerHTML = "";
  let totalTask = tasks.length;
  let completedTask = tasks.filter((t) => t.completed).length;

  tasks.forEach((task, index) => {
    let taskDiv = document.createElement("div");
    taskDiv.className = "taskItem";
    taskDiv.innerHTML = `
      <div class="task">
        <input type="checkbox" class="checkbox" ${
          task.completed ? "checked" : ""
        } />
        <p contenteditable="false">${task.text}</p>
      </div>
      <div class="icons">
        <img src="https://img.icons8.com/ios-glyphs/30/ffffff/edit.png" class="editBtn" />
        <img src="https://img.icons8.com/ios-glyphs/30/ffffff/trash.png" class="deleteBtn" />
      </div>`;

    list.appendChild(taskDiv);

    let checkbox = taskDiv.querySelector(".checkbox");
    let deleteBtn = taskDiv.querySelector(".deleteBtn");
    let p = taskDiv.querySelector("p");
    let editBtn = taskDiv.querySelector(".editBtn");

    // checkbox
    checkbox.addEventListener("change", function () {
      tasks[index].completed = checkbox.checked;
      // if (checkbox.checked) {
      //   p.style.textDecoration = "line-through";
      // } else {
      //   p.style.textDecoration = "none";
      // }
      saveTasks();
      renderTasks();
    });

    // delete
    deleteBtn.addEventListener("click", function () {
      tasks.splice(index, 1);
      saveTasks();
      renderTasks();
    });

    // edit (inline)
    editBtn.addEventListener("click", function () {
      if (p.isContentEditable) {
        p.contentEditable = "false";
        tasks[index].text = p.textContent.trim();
        saveTasks();
        editBtn.src = "https://img.icons8.com/ios-glyphs/30/ffffff/edit.png";
      } else {
        p.contentEditable = "true";
        p.focus();
        editBtn.src =
          "https://img.icons8.com/ios-glyphs/30/ffffff/checkmark.png";
      }
    });
  });

  updateStats(completedTask, totalTask);
}

function updateStats(completedTask, totalTask) {
  numbers.textContent = `${completedTask}/${totalTask}`;
  if (totalTask === 0) {
    progress.style.width = "0%";
  } else {
    let percent = (completedTask / totalTask) * 100;
    progress.style.width = percent + "%";
  }
}

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}
