const table_list = document.getElementById("table_list");
const searchBox = document.getElementById("search-Box");

const userNameInput = document.getElementById("userNameId");
const locationInput = document.getElementById("locationId");
const ageInput = document.getElementById("ageId");
const submitForm = document.getElementById("submitForm");
const studentModel = document.getElementById("studentModel");
const closeModel = document.getElementById("closeModel");
const studentIntro = document.getElementById("studentIntro");
const modelTitle = document.getElementById("modelTitle");
const addGrade = document.getElementById("addGrade");
const gradeTable = document.getElementById("gradeTable");
const noGradeTitle = document.getElementById("noGradeTitle");
const deleteStudent = document.getElementById("deleteStd");
const editStudent = document.getElementById("editStudent");

//global valiables
let userName = "";
let userLocation = "";
let userAge = "";
let clickedStudentId;
const API_URL = `http://localhost:10000`

if (userNameInput && locationInput && ageInput) {
  userNameInput.addEventListener("keyup", (event) => {
    userName = event.target.value;
  });

  locationInput.addEventListener("keyup", (event) => {
    userLocation = event.target.value;
  });

  ageInput.addEventListener("keyup", (event) => {
    userAge = event.target.value;
  });

  submitForm.addEventListener("submit", (e) => {
    e.preventDefault();
    saveUserData();
    window.location.replace("/");
  });
}

if (addGrade) {
  addGrade.addEventListener("click", () => {
    window.location.replace(
      `http://127.0.0.1:5501/add-grade/?${clickedStudentId}`
    );
  });
}

function saveUserData() {
  if ((userName == "") | (userLocation == "") | (userAge == "")) {
    return console.log("you must provide all field");
  }

  fetch(`${API_URL}/api/save`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userName, userLocation, userAge }),
  }).then((res) => {
    console.log(res, "this is the response");
  });
}

getAllData();

function getAllData() {
  fetch(`${API_URL}/api/attendance`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  }).then((res) => {
    res.json().then((data) => {
      data.forEach((item, idx) => {
        const list = document.createElement("tr");
        list.className = "table_row";
        list.addEventListener("click", () => {
          window.location.replace(`http://127.0.0.1:5501?${item.id}`);
          console.log();
        });
        const idTdata = document.createElement("td");
        idTdata.className = "user_list";
        const userNameTdata = document.createElement("td");
        userNameTdata.className = "user_list";
        const locationTdata = document.createElement("td");
        locationTdata.className = "user_list";
        const ageTdata = document.createElement("td");
        ageTdata.className = "user_list";

        idTdata.innerText = `${idx + 1}`;
        userNameTdata.innerHTML = `${item.username}`;
        userNameTdata.id = "user_Tdata";
        locationTdata.innerText = `${item.location}`;
        ageTdata.innerText = `${item.age}`;

        list.appendChild(idTdata);
        list.appendChild(userNameTdata);
        list.appendChild(locationTdata);
        list.appendChild(ageTdata);
        if (table_list) {
          table_list.appendChild(list);
        }
      });
    });
  });
}

const studentData = () => {
  fetch(`${API_URL}/student/${clickedStudentId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  }).then((res) => {
    res.json().then((data) => {
      console.log("this is data :", data[0]);
      if (data[0] == undefined) {
        studentModel.classList = "hideTable";
        window.location.replace("/");
      }
      studentName = document.createElement("p");
      studentName.innerText = `Name: ${data[0].username}`;

      studentLocation = document.createElement("p");
      studentLocation.innerText = `Location: ${data[0].location}`;

      studentAge = document.createElement("p");
      studentAge.innerText = `Age: ${data[0].age}`;

      studentId = document.createElement("p");
      studentId.innerText = `student Id: 0${data[0].id}`;

      studentIntro.appendChild(studentName);
      studentIntro.appendChild(studentLocation);
      studentIntro.appendChild(studentAge);
      studentIntro.appendChild(studentId);
    });
  });
};

const getshowGrade = ()=> {
  fetch(`${API_URL}/grade/${clickedStudentId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  }).then((res) => {
    res.json().then((data) => {
      if (data.length == 0) {
        gradeTable.classList = `hideTable`
        noGradeTitle.style = `display:block`
      }
      console.log("this is data ", data);
      data.forEach((item)=>{
        showTableData(item.subjectSelected,item.point,item.maxPoint,item.TypeSelected)
      })
    });
  });
}

function deleteIndividualStudent(clickedStudentId) {
  fetch(`${API_URL}/api/delete/${clickedStudentId}`,{
    method:'DELETE',
    headers: {
      "Content-Type": "application/json",
    },
  }).then((res) => {
    res.json().then((data) => {
      console.log(data,'this is the data');
      
    });
  })
}




if (window.location.href.split("?")[1]) {
  clickedStudentId = window.location.href.split("?")[1];
  console.log(clickedStudentId);

  table_list.classList = "hideTable";
  searchBox.classList = "hideTable";
  console.log(window.location.href.split("?")[1]);
  studentData();
  getshowGrade();

  closeModel.addEventListener("click", () => {
    window.location.replace("/");
  });

  editStudent.addEventListener('click',()=>{
    window.location.replace(
      `http://127.0.0.1:5501/edit-student/?${clickedStudentId}`
    );
  })

  deleteStudent.addEventListener('click',()=>{
    alert('are you sure you want to delete it?')
    deleteIndividualStudent(clickedStudentId)
    
  })
} else {
  if (studentModel) {
    studentModel.classList = "hideTable";
  }
 
}

function showTableData(subjectSelected,TypeSelected,point,maxPoint) {
  const list = document.createElement("tr");
  list.className = "table_row";
  const idTdata = document.createElement("td");
  idTdata.className = "user_list";
  const userNameTdata = document.createElement("td");
  userNameTdata.className = "user_list";
  const locationTdata = document.createElement("td");
  locationTdata.className = "user_list";
  const ageTdata = document.createElement("td");
  ageTdata.className = "user_list";

  idTdata.innerText = `${subjectSelected}`;
  userNameTdata.innerHTML = `${TypeSelected}`;
  userNameTdata.id = "user_Tdata";
  locationTdata.innerText = `${point}`;
  ageTdata.innerText = `${maxPoint}`;

  list.appendChild(idTdata);
  list.appendChild(userNameTdata);
  list.appendChild(locationTdata);
  list.appendChild(ageTdata);
  if (gradeTable) {
    gradeTable.appendChild(list);
  }
}
console.log(window.ononline);
