window.onload = function () {

}

function loadClass() {
    console.log(auth.currentUser.uid);

    const queryClass = database.ref('Classes');
    $('#studentclassCardDiv').empty();
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

            const queryStudent = database.ref('Students/').child(auth.currentUser.uid);

            queryStudent.once("value").then(function (snapshot) {
                const studentSemester = snapshot.child("Semester").val();
                const studentYear = snapshot.child("Year").val();
                if (studentSemester == classSemester && studentYear == classYear) {
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
                    para.className = "cardclassDiv card-container";
                    para.setAttribute("id", childKey);
                    para.addEventListener('click', loadClassroom, false);
                    document.getElementById('studentclassCardDiv').appendChild(para);
                }
            })
            console.log('called loop');
        })

    })

}



function loadClassroom() {
    var id = this.id
    localStorage.setItem("classRoomId", id);
    console.log("check it : " + id);
    location.href = 'classroom.html';
}


function signOut() {
    auth.signOut().then(() => {
        console.log("user log out");
        location.href = 'index.html';
    })
}

firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        loadClass();
    } else {
        // No user is signed in.
    }
});


auth.onAuthStateChanged((user) => {
    if (user) {
        const profileDiv = document.querySelector('#studentPorfileDiv');
        const queryTeacher = database.ref('Students/' + auth.currentUser.uid);
        queryTeacher.once("value").then(function (snapshot) {
            const Name = snapshot.child('Name').val();
            const semester = snapshot.child('Semester').val();
            const year = snapshot.child('Year').val();
            var semestertext, yeartext;
            if (year == '1') {
                yeartext = 'First Year ';
            } else if (year == '2') {
                yeartext = 'Second Year ';
            } else if (year == '3') {
                yeartext = 'Third Year ';
            } else if (year == '4') {
                yeartext = 'Fourth Year ';
            } else if (year == '5') {
                yeartext = 'Masters ';
            }
            if (semester == '1') {
                semestertext = 'First Semester ';
            } else if (semester == '2') {
                semestertext = 'Second Semester ';
            }
            const html = `
            <h4>Name : ${Name}</h4>
            <h4>Email : ${user.email}</h4>
            <h4>Semester : ${semestertext}</h4>
            <h4>Year : ${yeartext}</h4>
            <h4>Role : Student</h4>
        `;
            profileDiv.innerHTML = html;
        })

    } else {

    }
})