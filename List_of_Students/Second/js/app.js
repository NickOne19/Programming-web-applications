document.addEventListener('DOMContentLoaded', () => {
    const studentForm = document.getElementById('studentForm');
    const studentList = document.getElementById('studentList');
    let students = JSON.parse(localStorage.getItem('students')) || [];

    studentForm.addEventListener('submit', (event) => {
        event.preventDefault();
        addStudent();
    });

    function addStudent() {
        const faculty = document.getElementById('faculty').value.trim();
        const group = document.getElementById('group').value.trim();
        const name = document.getElementById('name').value.trim();

        if (!faculty || !group || !name) return;

        const student = { id: Date.now(), faculty, group, name };
        students.push(student);
        saveAndRender();
        studentForm.reset();
    }

    function renderStudentList() {
        studentList.innerHTML = '';

        // Группировка студентов по факультетам и группам
        const groupedStudents = {};
        students.forEach(student => {
            const key = `${student.faculty} - ${student.group}`;
            if (!groupedStudents[key]) groupedStudents[key] = [];
            groupedStudents[key].push(student);
        });

        // Создание списка с группировкой
        Object.entries(groupedStudents).forEach(([group, students]) => {
            const groupDiv = document.createElement('div');
            groupDiv.classList.add('group-container');
            groupDiv.innerHTML = `<h3>${group}</h3>`;

            students.forEach(student => {
                const studentDiv = document.createElement('div');
                studentDiv.classList.add('student-item');
                studentDiv.innerHTML = `
                    <span>${student.name}</span>
                    <button onclick="editStudent(${student.id})">✏️</button>
                    <button onclick="deleteStudent(${student.id})">🗑️</button>
                `;
                groupDiv.appendChild(studentDiv);
            });

            studentList.appendChild(groupDiv);
        });
    }

    window.editStudent = function(id) {
        const student = students.find(s => s.id === id);
        if (student) {
            document.getElementById('faculty').value = student.faculty;
            document.getElementById('group').value = student.group;
            document.getElementById('name').value = student.name;
            students = students.filter(s => s.id !== id);
            saveAndRender();
        }
    }

    window.deleteStudent = function(id) {
        students = students.filter(s => s.id !== id);
        saveAndRender();
    }

    function saveAndRender() {
        localStorage.setItem('students', JSON.stringify(students));
        renderStudentList();
    }

    renderStudentList();
});
