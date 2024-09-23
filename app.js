// 1st step: get information form User,
// 2nd step: add information to local storage,

// Element selection section
const newTaskForm = document.getElementById("user_form");
const tbody = document.getElementById("tbody");
const searchEl = document.getElementById("search");
const filterEl = document.getElementById("filter");
const sortEl = document.getElementById("sort");
const bulkAction = document.getElementById("bulk_action");
const allSelect = document.getElementById("allSelect");
const dismiss = document.getElementById("dismiss");
const deleteBtn = document.getElementById("delete_btn");
const editSection = document.getElementById("edit_section");
const editBtn = document.getElementById("edit_btn");
const editForm = document.getElementById("edit_form");

// #### utilities
function getUID() {
  return Date.now() + Math.round(Math.random() * 10000).toString();
}

// #### Local storage
// get all tasks from local storage: {1st + 2nd step by local storage}
function getAllTaskFromLocalStorage() {
  let tasks = [];
  const rowTasks = localStorage.getItem("tasks");
  if (rowTasks) {
    tasks = JSON.parse(rowTasks);
  }
  return tasks;
}

// add tasks to local storage: {3rd step by local storage}
function addTasksToLocalStorage(tasks) {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// add task to local storage:  {1st + 2nd step by local storage}
function addTaskToLocalStorage(task) {
  const tasks = getAllTaskFromLocalStorage();
  tasks.push(task);
  addTasksToLocalStorage(tasks);
}

// delete handler
function deleteHandler(id) {
  const tasks = getAllTaskFromLocalStorage();
  const taskAfterDeleting = tasks.filter((task) => task.id !== id);
  addTasksToLocalStorage(taskAfterDeleting);
  updateUI();
}
function editHandler(id) {
  const tasks = getAllTaskFromLocalStorage();
  const task = tasks.find((task) => task.id === id) || {};
  const {
    id: taskId,
    firstName,
    lastName,
    dob,
    gender,
    address,
    religion,
    relationship,
    email,
    phone,
  } = task;

  const taskTr = document.getElementById(id);

  // first name
  const firstNameTd = taskTr.querySelector(".fname");
  const firstNameInp = document.createElement("input");
  firstNameInp.value = firstName;
  firstNameTd.innerHTML = "";
  firstNameTd.appendChild(firstNameInp);

  // last name
  const lastNameTd = taskTr.querySelector(".lname");
  const lastNameInp = document.createElement("input");
  lastNameInp.value = lastName;
  lastNameTd.innerHTML = "";
  lastNameTd.appendChild(lastNameInp);

  // date of birth
  const dobTd = taskTr.querySelector(".dob");
  const dobInp = document.createElement("input");
  dobInp.value = dob;
  dobTd.innerHTML = "";
  dobTd.appendChild(dobInp);

  // gender
  const genderTd = taskTr.querySelector(".gender");
  const genderInp = document.createElement("input");
  genderInp.value = gender;
  genderTd.innerHTML = "";
  genderTd.appendChild(genderInp);

  // address
  const addressTd = taskTr.querySelector(".address");
  const addressInp = document.createElement("input");
  addressInp.value = address;
  addressTd.innerHTML = "";
  addressTd.appendChild(addressInp);

  // religion
  const religionTd = taskTr.querySelector(".religion");
  const religionInp = document.createElement("input");
  religionInp.value = religion;
  religionTd.innerHTML = "";
  religionTd.appendChild(religionInp);

  // relationship
  const relationshipTd = taskTr.querySelector(".relationship");
  const relationshipInp = document.createElement("input");
  relationshipInp.value = relationship;
  relationshipTd.innerHTML = "";
  relationshipTd.appendChild(relationshipInp);

  // email
  const emailTd = taskTr.querySelector(".email");
  const emailInp = document.createElement("input");
  emailInp.value = email;
  emailTd.innerHTML = "";
  emailTd.appendChild(emailInp);

  // phone
  const phoneTd = taskTr.querySelector(".phone");
  const phoneInp = document.createElement("input");
  phoneInp.value = phone;
  phoneTd.innerHTML = "";
  phoneTd.appendChild(phoneInp);

  // action
  const actionTd = taskTr.querySelector(".action");
  const saveBtn = document.createElement("button");
  saveBtn.textContent = "save";
  actionTd.innerHTML = "";

  // saveBtn handler
  actionTd.appendChild(saveBtn);
  saveBtn.addEventListener("click", () => {
    const fName = firstNameInp.value;
    const lName = lastNameInp.value;
    const birth = dobInp.value;
    const gender = genderInp.value;
    const address = addressInp.value;
    const religion = religionInp.value;
    const relationship = relationshipInp.value;
    const email = emailInp.value;
    const phone = phoneInp.value;
    if (
      fName &&
      lName &&
      birth &&
      gender &&
      address &&
      religion &&
      relationship &&
      email &&
      phone
    ) {
      const newTask = {
        fName,
        lName,
        birth,
        gender,
        address,
        religion,
        relationship,
        email,
        phone,
      };
      const taskAfterEditing = { ...task, ...newTask };
      const tasksAfterEditing = tasks.map((task) => {
        if (task.id === taskId) {
          return taskAfterEditing;
        }
        return task;
      });
      addTasksToLocalStorage(tasksAfterEditing);
      updateUI();
    } else {
      alert("Please fill up all the input");
    }
  });
}
// #### handler function

// action handler
function actionHandler(e) {
  const {
    target: { id: actionId, dataset: { id: taskId } = {} },
  } = e;
  if (actionId === "delete") {
    deleteHandler(taskId);
  } else if (actionId === "edit") {
    editHandler(taskId);
  }
}

// search handler && filtering functionality
function handlingSearchWithTimer(searchText) {
  const tasks = getAllTaskFromLocalStorage();
  const searchedTasks = tasks.filter(({ firstName }) => {
    firstName = firstName.toLowerCase();
    searchText = searchText.toLowerCase();
    return firstName.includes(searchText);
  });
  updateUI(searchedTasks);
}

let timer;
function searchHandler(e) {
  const { value: searchText } = e.target;
  clearTimeout(timer);
  timer = setTimeout(() => handlingSearchWithTimer(searchText), 1000);
}

// filter handler
function filterUserBio(filterText) {
  const tasks = getAllTaskFromLocalStorage();
  let tasksAfterFiltering = tasks;
  switch (filterText) {
    case "all":
      tasksAfterFiltering = tasks;
      break;
    case "male":
      tasksAfterFiltering = tasks.filter((task) => task.gender === "male");
      break;
    case "female":
      tasksAfterFiltering = tasks.filter((task) => task.gender === "female");
      break;
    case "single":
      tasksAfterFiltering = tasks.filter(
        (task) => task.relationship === "single"
      );
      break;
    case "married":
      tasksAfterFiltering = tasks.filter(
        (task) => task.relationship === "married"
      );
      break;
    case "islam":
      tasksAfterFiltering = tasks.filter((task) => task.religion === "islam");
      break;
    case "hindu":
      tasksAfterFiltering = tasks.filter((task) => task.religion === "hindu");
      break;
    case "buddhism":
      tasksAfterFiltering = tasks.filter(
        (task) => task.religion === "buddhism"
      );
      break;
    case "christianity":
      tasksAfterFiltering = tasks.filter(
        (task) => task.religion === "christianity"
      );
      break;
    default:
      break;
  }
  updateUI(tasksAfterFiltering);
}
function filterHandler(e) {
  const filterText = e.target.value;
  filterUserBio(filterText);
}

// sort handler
function sortHandler(e) {
  const sortText = e.target.value;
  const tasks = getAllTaskFromLocalStorage();
  let tasksAfterFiltering = tasks.sort((taskA, taskB) => {
    const taskADate = new Date(taskA.date);
    const taskBDate = new Date(taskB.date);
    if (taskADate > taskBDate) {
      return sortText === "new" ? 1 : -1;
    } else if (taskADate > taskBDate) {
      return sortText === "new" ? -1 : 1;
    } else {
      return 0;
    }
  });
  updateUI(tasksAfterFiltering);
}

// new task creation
function newTaskFormHandler(e) {
  e.preventDefault();
  const id = getUID();
  const tasks = {
    id,
  };
  [...newTaskForm.elements].forEach((element) => {
    if (element.name) {
      tasks[element.name] = element.value;
    }
  });
  newTaskForm.reset();
  addTaskToLocalStorage(tasks);
  updateUI();
}

// UI handlers

// create Tr
function createTr(
  {
    firstName: fname,
    lastName: lname,
    dob,
    gender,
    address,
    religion,
    relationship,
    email,
    phone,
    id,
  },
  index
) {
  const formattedDate = new Date(dob).toDateString();
  return `<tr id='${id}'>
                        <td>
                            <input class="checkbox" data-id='${id}' data-checkid='${id}' type="checkbox"/>
                        </td>
                        <td>${index + 1}</td>
                        <td class="fname">${fname}</td>
                        <td class="lname">${lname}</td>
                        <td class="dob">${formattedDate}</td>
                        <td class="gender">${gender}</td>
                        <td class="address">${address}</td>
                        <td class="religion">${religion}</td>
                        <td class="relationship">${relationship}</td>
                        <td class="email">${email}</td>
                        <td class="phone">${phone}</td>
                        <td class="action">
                            <button data-id="${id}" id="edit"><i class="fa-solid fa-pen"></i></button>
                            <button data-id="${id}" id="delete"><i class="fa-solid fa-trash-can"></i></button>
                        </td>
                    </tr>`;
}

// initial state
function getInitialState() {
  return getAllTaskFromLocalStorage().reverse();
}

// update UI
function updateUI(tasks = getInitialState()) {
  const noBio = document.getElementById("noBio");
  if (tasks.length === 0) {
    noBio.style.display = "block";
  } else {
    noBio.style.display = "none";
  }

  const tasksHtmlArray = tasks.map((task, index) => {
    return createTr(task, index);
  });

  const taskLists = tasksHtmlArray.join("");
  tbody.innerHTML = taskLists;
}
updateUI();

// taskSelection handler

let selectedTasks = [];

function taskSelectionHandler(e) {
  const targetEl = e.target;
  if (targetEl.classList.contains("checkbox")) {
    const { id } = targetEl.dataset;
    if (targetEl.checked) {
      selectedTasks.push(id);
    } else {
      const selectedTaskIndex = selectedTasks.findIndex(
        (taskId) => taskId === id
      );
      if (selectedTaskIndex >= 0) {
        selectedTasks.splice(selectedTaskIndex, 1);
      }
    }
  }
  bulkActionToggler();
}

function bulkActionToggler() {
  selectedTasks.length
    ? (bulkAction.style.display = "flex")
    : (bulkAction.style.display = "none");
  const tasks = getAllTaskFromLocalStorage();
  if (tasks.length === selectedTasks.length && tasks.length > 0) {
    allSelect.checked = true;
  } else {
    allSelect.checked = false;
  }
}

// allSelect handler
function allSelectHandler(e) {
  if (e.target.checked) {
    const tasks = getAllTaskFromLocalStorage();
    selectedTasks = tasks.map((task) => task.id);
    selectedTasks.forEach((taskId) => {
      document.querySelector(`[data-checkid='${taskId}']`).checked = true;
    });
  } else {
    selectedTasks.forEach((taskId) => {
      document.querySelector(`[data-checkid='${taskId}']`).checked = false;
    });
    selectedTasks = [];
  }
  bulkActionToggler();
}

// dismiss handler
function dismissHandler() {
  selectedTasks.forEach((taskId) => {
    document.querySelector(`[data-checkid='${taskId}']`).checked = false;
  });
  selectedTasks = [];
  bulkActionToggler();
}

// deleteBtn handler
function deleteBtnHandler() {
  const isConfirm = confirm("Are you sure to delete BioInformation?😳");
  if (isConfirm) {
    const tasks = getAllTaskFromLocalStorage();
    const bioInformationDeleting = tasks.filter((task) => {
      if (selectedTasks.includes(task.id)) return false;
      return true;
    });
    addTasksToLocalStorage(bioInformationDeleting);
    updateUI(bioInformationDeleting);
    selectedTasks = [];
    bulkActionToggler();
  }
}

//  bulkEditAreaBtnToggler
function bulkEditAreaBtnToggler() {
  editSection.style.display === "block"
    ? (editSection.style.display = "none")
    : (editSection.style.display = "block");
}

// editBtn handler
function bulkEditBtnHandler() {
  bulkEditAreaBtnToggler();
}

// // bulkEditFormHandler
function bulkEditFormHandler(e) {
  e.preventDefault();
  const task = {};
  [...editForm.elements].forEach((element) => {
    if (element.name) {
      task[element.name] = element.value;
    }
  });
  editForm.reset();
  const tasks = getAllTaskFromLocalStorage();
  const modifiedInformation = tasks.map((bioInformation) => {
    if (selectedTasks.includes(bioInformation.id)) {
      bioInformation = { ...bioInformation, ...task };
    }
    return bioInformation;
  });
  addTasksToLocalStorage(modifiedInformation);
  updateUI(modifiedInformation);
  bulkEditAreaBtnToggler();
}
// event listeners
newTaskForm.addEventListener("submit", newTaskFormHandler);
tbody.addEventListener("click", actionHandler);
searchEl.addEventListener("input", searchHandler);
filterEl.addEventListener("input", filterHandler);
sortEl.addEventListener("input", sortHandler);
tbody.addEventListener("input", taskSelectionHandler);
allSelect.addEventListener("input", allSelectHandler);
dismiss.addEventListener("click", dismissHandler);
deleteBtn.addEventListener("click", deleteBtnHandler);
editBtn.addEventListener("click", bulkEditBtnHandler);
editForm.addEventListener("submit", bulkEditFormHandler);

// let html = document.body.innerHTML;
// for (let x = 0; x < 1000; x++){
//     html = document.body.innerHTML + x;
// }
// document.body.innerHTML = html;
