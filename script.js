const taskInput = document.getElementById("taskInput");
const setInput = document.getElementById("setInput");
const addBtn = document.getElementById("addBtn");
const list = document.getElementById("taskList");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function save() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function render() {
  list.innerHTML = "";

  tasks.forEach((task, index) => {
    const li = document.createElement("li");

    const title = document.createElement("strong");
    title.textContent = `${task.text}（${task.sets.length}セット）`;
    li.appendChild(title);

    const setsDiv = document.createElement("div");
    setsDiv.className = "sets";

    task.sets.forEach((done, i) => {
      const label = document.createElement("label");
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = done;

      checkbox.addEventListener("change", () => {
        task.sets[i] = checkbox.checked;
        task.done = task.sets.every(s => s);
        save();
        render();
      });

      label.appendChild(checkbox);
      label.append(` セット ${i + 1}`);
      setsDiv.appendChild(label);
    });

    li.appendChild(setsDiv);

    if (task.done) li.classList.add("done");

    const delBtn = document.createElement("button");
    delBtn.textContent = "削除";
    delBtn.className = "delete";
    delBtn.addEventListener("click", () => {
      tasks.splice(index, 1);
      save();
      render();
    });

    li.appendChild(delBtn);
    list.appendChild(li);
  });
}

addBtn.addEventListener("click", () => {
  const text = taskInput.value;
  const setCount = Number(setInput.value);

  if (!text || setCount < 1) return;

  tasks.push({
    text,
    sets: Array(setCount).fill(false),
    done: false
  });

  taskInput.value = "";
  setInput.value = "";
  save();
  render();
});

render();
