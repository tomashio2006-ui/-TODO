const taskInput = document.getElementById("taskInput");
const setInput = document.getElementById("setInput");
const addBtn = document.getElementById("addBtn");
const suggestBtn = document.getElementById("suggestBtn");
const list = document.getElementById("taskList");

const workoutSuggestions = [
  "腕立て伏せ 20回",
  "スクワット 30回",
  "腹筋 20回",
  "プランク 60秒",
  "ランジ 20回",
  "もも上げ 50回",
  "ジャンピングジャック 30回"
];

const streakDisplay = document.getElementById("streak");
const character = document.getElementById("character");

let streak = Number(localStorage.getItem("streak")) || 0;
let lastCompletedDate = localStorage.getItem("lastCompletedDate") || null;

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function save() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

suggestBtn.addEventListener("click", () => {
  const random =
    workoutSuggestions[Math.floor(Math.random() * workoutSuggestions.length)];
  taskInput.value = random;
});

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
        if (task.done) {
  const today = new Date().toDateString();

  if (lastCompletedDate !== today) {
    streak++;
    lastCompletedDate = today;
    localStorage.setItem("streak", streak);
    localStorage.setItem("lastCompletedDate", today);
  }
}
        save();
        render();
      });

      label.appendChild(checkbox);
      label.append(` セット ${i + 1}`);
      setsDiv.appendChild(label);
    });

    if (task.done) li.classList.add("done");

    const delBtn = document.createElement("button");
    delBtn.textContent = "削除";
    delBtn.className = "delete";
    delBtn.addEventListener("click", () => {
      tasks.splice(index, 1);
      save();
      render();
    });

    li.appendChild(setsDiv);
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

render();updateCharacter();
const partButtons = document.querySelectorAll(".parts button");

const workoutsByPart = {
  legs: [
    "スクワット 30回",
    "ランジ 20回",
    "カーフレイズ 30回"
  ],
  chest: [
    "腕立て伏せ 20回",
    "ナロープッシュアップ 15回"
  ],
  abs: [
    "腹筋 20回",
    "プランク 60秒",
    "レッグレイズ 15回"
  ]
};

partButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    const part = btn.dataset.part;
    const list = workoutsByPart[part];
    const random = list[Math.floor(Math.random() * list.length)];
    taskInput.value = random;
  });
});
function updateCharacter() {
  character.className = "body";

  let level = 0;

  if (streak >= 3) level = 1;
  if (streak >= 7) level = 2;
  if (streak >= 14) level = 3;
  if (streak >= 30) level = 4;
  if (streak >= 60) level = 5;

  character.classList.add("level" + level);
  streakDisplay.textContent = streak;
}
