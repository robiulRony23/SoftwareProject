window.onload = function () {
    loadClass();
};

function loadClass() {
    const queryClass = database.ref('Classes');
    $('#classCardDiv').empty();
    queryClass.once("value").then(function (snapshot) {
        snapshot.forEach(function (childSnapshot) {
            var para = document.createElement("div");
            const classTitle = childSnapshot.child('Title').val();
            const classTeacherId = childSnapshot.child('Teacher').val();
            const classYear = childSnapshot.child('Year').val();
            var classYearText, classSemesterText;
            var childKey = childSnapshot.key;
            const classDate = childSnapshot.child('Date').val();
            const classSemester = childSnapshot.child('Semester').val();

            if (classYear == '1') {
                classYearText = 'First Year ';
            } else if (classYear == '2') {
                classYearText = 'Second Year ';
            } else if (classYear == '3') {
                classYearText = 'Third Year ';
            } else if (classYear == '4') {
                classYearText = 'Fourth Year ';
            } else if (classYear == '5') {
                classYearText = 'Masters ';
            }
            if (classSemester == '1') {
                classSemesterText = 'First Semester ';
            } else if (classSemester == '2') {
                classSemesterText = 'Second Semester ';
            }

            if (auth.currentUser.uid == classTeacherId) {

                const card = `
        <div class="card-container-header">
          <h4><b><p ">${classTitle}</p></b></h4>
          <h5></h5><br>
          <p class="hr"></p>
        </div>

        <div class="card-container-footer">
          <h5>${classYearText} ${classSemesterText}</h5>
          <h5>${classDate}</h5>
        </div>
        `;
                para.innerHTML = card;
                para.className = "cardDiv card-container";
                para.setAttribute("id", childKey);
                document.getElementById('classCardDiv').appendChild(para);
            }
        });
    }).then(() => {
        var classname = document.getElementsByClassName("cardDiv");
        console.log(classname.length);
        for (var i = 0; i < classname.length; i++) {
            console.log(i);
            classname[i].addEventListener('click', loadClassroom, false);
        }
    })

}

auth.onAuthStateChanged((user) => {
    if (user) {
        const profileDiv = document.querySelector('#teacherPorfileDiv');
        const queryTeacher = database.ref('Teachers/' + auth.currentUser.uid);
        queryTeacher.once("value").then(function (snapshot) {
            const Name = snapshot.child('Name').val();
            const html = `
            <h4>Name : ${Name}</h4>
            <h4>Email : ${user.email}</h4>
            <h4>Role : Teacher</h4>
        `;
            profileDiv.innerHTML = html;
        })

    } else {

    }
})

//add information of new class
const createClassForm = document.querySelector("#createClassForm");
createClassForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const selYear = document.getElementById("yearListTeacher");
    const selSemester = document.getElementById("semesterListTeacher");
    const user = auth.currentUser.uid;
    const classTitle = createClassForm['inputClassTitle'].value;
    const date = createClassForm['datepicker'].value;
    const classYear = selYear.options[selYear.selectedIndex].value;
    const classSemester = selSemester.options[selSemester.selectedIndex].value;

    var newClassKey = database.ref().child('Classes').push().key;
    database.ref('Classes/' + newClassKey).set({
        Title: classTitle,
        Year: classYear,
        Semester: classSemester,
        Teacher: user,
        Date: date
    }).then(() => {
        const queryStudent = database.ref('Students');
        queryStudent.once("value").then(function (snapshot) {
            snapshot.forEach(function (childSnapshot) {
                const studentSemester = childSnapshot.child("Semester").val();
                const studentYear = childSnapshot.child("Year").val();
                if (classSemester == studentSemester && classYear == studentYear) {
                    database.ref('Classes/' + newClassKey + '/Students').push(childSnapshot.key)
                }
            });
        })
        $('#modalCreateClass').modal('hide');
        createClassForm.reset();
        loadClass();
    }).catch(err => {
        console.log(err.message);
    });
})

function openNav() {
    document.getElementById("mySidebar").style.width = "250px";
    document.getElementById("main").style.marginLeft = "250px";
}

function closeNav() {
    document.getElementById("mySidebar").style.width = "0";
    document.getElementById("main").style.marginLeft = "0";
}

function selectChange() {
    var sel = document.getElementById("postTypeList");
    var fileOption = document.getElementById("fileSelectionId");
    var value = sel.options[sel.selectedIndex].value; // or just sel.value
    if (value == 'Text') {
        fileOption.style.display = "none";
    } else if (value == 'Assigment') {
        fileOption.style.display = "block";
    } else {
        fileOption.style.display = "block";
    }
}

$("#datepicker").datepicker({
    format: " yyyy", // Notice the Extra space at the beginning
    viewMode: "years",
    minViewMode: "years",
    autoClose: true,
}).on('changeDate', function (ev) {
    $('#datepicker').datepicker('hide');
});

function signOut() {
    auth.signOut().then(() => {
        console.log("user log out");
        location.href = 'index.html';
    })
}

function loadClassroom() {
    var id = this.id
    localStorage.setItem("classRoomId", id);
    //localStorage.setItem("holderType", "t");
    console.log("classRoomId", id);
    console.log("check it teacher: " + id);
    location.href = 'classroom.html';
}


