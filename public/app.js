

// const variables

const signUpBtn = document.getElementById('signUp');
const signInBtn = document.getElementById('signIn');
const createUserBtn = document.getElementById('signInBtn');
const loginPage = document.getElementById('loginPage');
const signInForm = document.querySelector('.login-form')
const signUpForm = document.querySelector('.sign-form')
const logEmailInput = document.getElementById('logEmail');
const logPassInput = document.getElementById('logPassword');
const signEmailInput = document.getElementById('signEmail');
const signPassInput = document.getElementById('signPassword');
const signNameInput = document.getElementById('signName');
const loginBtn = document.getElementById('logBtn');
const message = document.getElementById('message');
const sideOverview = document.getElementById('sideOverview');
const sideStudent = document.getElementById('sideStudentRegister');
const sideProfessor = document.getElementById('sideProfessorRegister');
// const sideRegister = document.getElementById('sideRegister');
const sideBarButtons = document.querySelectorAll('.side-bar-button');
const sideSubject = document.getElementById('sideSubject');
const sideEnroll = document.getElementById('sideEnroll');
const overviewPanel = document.getElementById('overview');
const subjectRegisterPanel = document.getElementById('subjectRegister');
const professorRegisterPanel = document.getElementById('professorRegister');
const studentRegisterPanel = document.getElementById('studentRegister');
const srForm = document.getElementById('srForm');
const srButton = document.getElementById('srButton');
const overviewTable = document.getElementById('overviewTableBody');
let currentPanel = overviewPanel; //para saber el panel actual que se esta mostrando
const addDegreeBtn = document.getElementById('addDegreeBtn');
const professorModal = document.getElementById('professorRegisterModal');
const modalCancelBtn = document.getElementById('modalCancelBtn');
const professorModalForm = document.getElementById('professorModalForm');
const degreeItemsContainer = document.getElementById('degreeItemsContainer');
const noDataDegree = document.getElementById('noDataDegree');
const prModalGraduationYear = document.getElementById('graduationYear');
const prForm = document.getElementById('prForm');
const prRegiserBtn = document.getElementById('prRegisterButton');
const srRegisterBtn = document.getElementById('srRegisterButton');
const overviewOrdering = document.getElementById('overviewOrdering');
const subjectTableBody = document.getElementById('subjectTableBody');
const selectedProfessorName = document.getElementById('selectedProfessorName');
const subjectSearchBar = document.getElementById('subjectSearchBar');
const searchFiltering = document.getElementById('searchFiltering');
const subjectNoDataFound = document.getElementById('subjectNoDataFound');
const subjectButton = document.getElementById('subjectButton');
const noDataSubject = document.getElementById('subjectNoData');
const subjectForm = document.getElementById('subjectForm');
const enrollmentPanel = document.getElementById('enrollment');
const enrollStudentTableBody = document.getElementById('enrollStudentTableBody');
const enrollSubjectTableBody = document.getElementById('enrollSubjectTableBody');
const enrollSelectedStudent = document.getElementById('selectedStudent');
const enrollSelectedSubject = document.getElementById('selectedSubject');
const modalView = document.getElementById('modalView');
const viewModalContainer = document.getElementById('viewModalContainer');
const modalDegreeContainer = document.getElementById('degreeInfoContainer');
let enrollSelectedStudentData = {};
let enrollSelectedSubjectData = {};
let selectedProfessorData = {};
let overviewSelectedPerson = {};

const logoColorPallete = ['#13F4CF, #D716FF', '#F3FB5E, #FE235F', '#15EED6, #9F16FF',
    '#0CE6B6, #DADB14', '#DE0BF9, #2433FF', '#EE2B92, #17534B', '#F30E90, #950CB4',
    '#13F0CC, #0D6052', '#F46534, #581398', '#36F0F5, #0F56BD', '#E2E585, #3641FD',
    '#167938, #C0F475', '#F0BF61, #F21E50', '#2F9FEC, #F23E85', '#7E32F4, #34107D',
    '#5FFABB, #3C38D6', '#D32167, #330879'];

const degreesColorPalete = ['#36F23D, #17D6CA', '#F51CEA, #FEE227', '#FED910, #3DEF34',
    '#16E2F5, #F409FD', '#F22067, #FCDB09', '#FB0818, #D70A9F', '#F009DA, #1908E7',
    '#0B4BFE, #13E4FD', '#126FE2, #16E334'];


let degreeItemsArray = [];

document.addEventListener('click', (e) => {
    if (e.target === modalView) {
        viewModalContainer.classList.remove('show')
        setTimeout(() => {
            modalView.classList.remove('show');
        }, 200);
    }
})

// const logoutBtn = document.getElementById('logout');
const checkIcon = {
    name: 'check',
    color: '#10A37F'
}
const alertIcon = {
    name: 'alert',
    color: '#F27B28'
}
const errorIcon = {
    name: 'error',
    color: '#ee4b4b'
}

// para el boton de entrar
signInBtn.addEventListener('click', () => {
    signInForm.classList.remove('active-transition');
    signUpForm.classList.remove('active-transition');
    signInBtn.classList.remove('active');
    signUpBtn.classList.remove('active');
    setTimeout(() => {
        signNameInput.value = '';
        signEmailInput.value = '';
        signPassInput.value = '';
    }, 1000);
});

// para el boton de unirse
signUpBtn.addEventListener('click', () => {
    signInForm.classList.add('active-transition');
    signUpForm.classList.add('active-transition');
    signInBtn.classList.add('active');
    signUpBtn.classList.add('active');
    setTimeout(() => {
        logEmailInput.value = '';
        logPassInput.value = '';
    }, 500);
});

// para el efecto de hacer click en los botones del side bar

sideBarButtons.forEach(currentButton => {
    currentButton.addEventListener('click', () => {
        sideBarButtons.forEach(sideButton => {
            if (currentButton !== sideButton) {
                sideButton.classList.remove('translucent');
            } else {
                sideButton.classList.add('translucent');
            }
        })
    })
})

// para registrar un nuevo usuario

signUpForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (formInfoMissing(signEmailInput, signPassInput)) {
        deployCustomizedAlert(alertIcon, 'Completa todos los campos');
    } else {
        registerUser(signEmailInput.value, signNameInput.value, signPassInput.value);
    }
});

async function registerUser(email, name, password) {
    changeToLoadingButton(createUserBtn);
    console.log(email, name, password);

    const response = await fetch('/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            email,
            name,
            password,
        }),
    });
    const data = await response.json();

    if(response.status === 400){
        deployCustomizedAlert(errorIcon, 'Algo salio mal');
        changeToNormalButton(createUserBtn, 'Crear');
        return;
    }

    if (response.ok) {
        alert('usuario registrado');
        console.log(data.user);

    } else {
        console.log(data.message);
        alert('algo salio mal');
    }
    changeToNormalButton(createUserBtn, 'Crear')
}

// para el login

signInForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (formInfoMissing(logEmailInput, logPassInput)) {
        deployCustomizedAlert(alertIcon, 'Completa todos los campos');
    } else {
        loginUser(logEmailInput.value, logPassInput.value);
    }
});

function formInfoMissing(input1, input2) {
    return input1.value.trim() === '' || input2.value.trim() === '';
}

async function loginUser(email, password) {
    changeToLoadingButton(loginBtn);
    const response = await fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            email,
            password,
        }),
    });
    const result = await response.json();

    if (response.status === 400) {
        deployCustomizedAlert(alertIcon, 'Email o contraseña incorrectos.');
        changeToNormalButton(loginBtn, 'Verificar');
        return;
    }

    if (response.ok) {
        loginPage.style.transform = 'translateY(-100%)';
        deployCustomizedAlert(checkIcon, `${result.message}`);
        reloadDataTable('desc', 'people');
        updateTotalCard('professors', 'total-professors', 'overviewTotalProfessors');
        updateTotalCard('subjects', 'total-subjects', 'overviewTotalSubjects');
        updateTotalCard('students', 'total-students', 'overviewTotalStudents');

    } else {
        console.log(result.message);
    }
    changeToNormalButton(loginBtn, 'Verificar');
}

// para mostrar los mensajes de alerta

function deployCustomizedAlert(icon, messageText) {
    hideAllIconsExcept(icon.name);
    message.classList.add('show');
    message.style.backgroundColor = icon.color;
    message.querySelector('h2').textContent = messageText;
    setTimeout(() => {
        message.classList.remove('show');
    }, 3000);
}

function hideAllIconsExcept(idIcon) {
    message.querySelectorAll('.message-icon').forEach(icon => {
        if (icon.id !== idIcon) {
            icon.style.display = 'none';
        } else {
            icon.style.display = 'inline';
        }
    });
}


// para los botones de la barra lateral

sideOverview.addEventListener('click', () => {
    if (currentPanel != overviewPanel) {
        reloadDataTable('desc', 'people');
        switchPanelViewTo(overviewPanel)
        updateTotalCard('professors', 'total-professors', 'overviewTotalProfessors');
        updateTotalCard('subjects', 'total-subjects', 'overviewTotalSubjects');
        updateTotalCard('students', 'total-students', 'overviewTotalStudents');
    }

});

sideStudent.addEventListener('click', () => {
    switchPanelViewTo(studentRegisterPanel)
});

sideProfessor.addEventListener('click', () => {
    switchPanelViewTo(professorRegisterPanel)
});

sideSubject.addEventListener('click', () => {
    if (currentPanel != subjectRegisterPanel) {
        switchPanelViewTo(subjectRegisterPanel)
        reloadProfessorsSubjectTable();
        clearSubjectPanel();
        updateTotalCard('professors', 'total-professors', 'sbTotalProfessors');
        updateTotalCard('faculties', 'total-faculties', 'sbTotalFaculties');
        updateTotalCard('subjects', 'total-subjects', 'sbTotalSubjects');
    }
});

sideEnroll.addEventListener('click', () => {
    if (currentPanel != enrollmentPanel) {
        switchPanelViewTo(enrollmentPanel)
        reloadEnrollStudentDataTable()
        reloadEnrollSubjectDataTable()
        clearEnrollmentPanel()
    }
});

function switchPanelViewTo(panel) {
    if (currentPanel != panel) {
        currentPanel.style.display = 'none';
        currentPanel = panel;
        currentPanel.style.display = 'grid';
    }
}


// para registrar un nuevo estudiante

srForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    changeToLoadingButton(srRegisterBtn);

    const formData = new FormData(e.target);
    const studentData = Object.fromEntries(formData.entries());

    try {
        const response = await fetch("/register-student", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(studentData),
            credentials: 'include'
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Error en la petición');
        }

        deployCustomizedAlert(checkIcon, 'Estudiante regsitrado');
        [...document.querySelectorAll('.sr-input')].forEach(input => input.value = '');

    } catch (error) {
        console.error(error);
    }

    changeToRegisterButton(srRegisterBtn);
});

// para la visualizacion de personas en el overview panel

// ver en que orden por defecto le ponemos los datos de la tabla
async function reloadDataTable(orderBy, route) {
    overviewTable.classList.add('active-loading');
    const res = await fetch(`/get-all-${route}?orderBy=${orderBy}`);
    const data = await res.json();
    // console.log(data);


    overviewTable.innerHTML = '';
    data.forEach(personData => {
        const newRow = document.createElement('tr');
        const createdAt = new Date(personData.created_at);
        const formattedDate = createdAt.toLocaleDateString("es-ES");

        const { name, last_name: lastName, age, ci, email, gender, id, phone, state, type } = personData;
        const extraData = getAllDataFrom(type === 'student' ? personData.student[0] : personData.professor[0], type);

        newRow.innerHTML = `
            <td>${personData.name} ${personData.last_name}</td>
            <td>${personData.email}</td>
            <td>${translateTypeOfPerson(personData.type)}</td>
            <td>${formattedDate}</td>
            <td>${translateState(personData.state)}</td>
        `;

        newRow.addEventListener('click', () => {
            overviewSelectedPerson = {
                age, ci, email, phone,
                'gender': gender === 'male' ? 'Masculino' : 'Femenino',
                'type': translateTypeOfPerson(type),
                [type]: extraData,
                fullName: name + ' ' + lastName,
                shortName: (name.charAt(0) + lastName.charAt(0)).toUpperCase(),
                state: translateState(state)
            }

            adjustModalInterface(type === 'professor');
            addInfoToModalView(overviewSelectedPerson);
            modalView.classList.add('show')
            requestAnimationFrame(() => viewModalContainer.classList.add('show'));
        })

        overviewTable.appendChild(newRow);
    });
    overviewTable.classList.remove('active-loading');
}

function addInfoToModalView(overviewSelectedPerson) {
    Object.entries(overviewSelectedPerson).forEach(([key, value]) => {

        if (key === 'student') {
            const { id, ...student } = value;
            // console.log(student);
            document.querySelectorAll('.student-info').forEach(item => {
                document.getElementById(item.id).textContent = student[item.id];
            })
            return;
        } else if (key === 'professor') {

            document.getElementById('contractType').textContent = translateContractType(value.contractType);
            document.getElementById('experienceYears').textContent = value.experienceYears + ' años';

            insertDegreeRowsIntoModal(value.degrees);
            return;
        }

        const element = document.getElementById(key);
        if (element) element.textContent = value;

    })
}

function translateContractType(value) {
    const translations = {
        "full-time": "Tiempo Completo",
        "part-time": "Medio Tiempo",
        "permanent": "Indefinido"
    };

    return translations[value] || "Desconocido";
}

function insertDegreeRowsIntoModal(data) {
    modalDegreeContainer.innerHTML = '';
    data.forEach(degree => {
        const { name, type_of_degree: typeOfDegree, institution, graduation_year: graduationYear } = degree;
        const newDegreeRow = document.createElement('div');
        newDegreeRow.classList.add('degree-item');
        newDegreeRow.classList.add('modal-degree-item');
        newDegreeRow.style.background = `linear-gradient(90deg, ${getRandomDegreeColor()})`;

        newDegreeRow.innerHTML = `
            <div class="degree-content">
                <h4>${name}</h4>
                <p>${typeOfDegree} - ${institution} (${graduationYear}) </p>
            </div>
        `;

        modalDegreeContainer.appendChild(newDegreeRow);
    })
}

function adjustModalInterface(adjust) {
    viewModalContainer.classList.toggle('adjust', adjust);
    document.getElementById('modalAcademicInfo').classList.toggle('adjust', adjust);
    document.getElementById('modalGuardianInfo').classList.toggle('adjust', adjust);
    document.getElementById('modalDegreeInfo').classList.toggle('adjust', adjust);
    document.getElementById('modalProfessionalInfo').classList.toggle('adjust', adjust);
    document.getElementById('vmTitleContainer').classList.toggle('adjust', adjust);
    // para cambiar el color del logo dinamicamente
    document.getElementById('piLogo').style.background = `linear-gradient(45deg, ${getRandomLogoColor()})`;
}

function getRandomLogoColor() {
    const randomIndex = Math.floor(Math.random() * logoColorPallete.length);
    return logoColorPallete[randomIndex];
}

function getRandomDegreeColor() {
    const randomIndex = Math.floor(Math.random() * degreesColorPalete.length);
    return degreesColorPalete[randomIndex];
}

// completar esto para la obtencion de datos si docente o estuidante y hacer la ventana modal donde
// se mostrara toda esta informacion
function getAllDataFrom(data, type) {
    if (type === 'student') {
        return {
            desiredMajor: data.desired_major,
            guardianContact: data.guardian_contact,
            guardianName: data.guardian_name,
            id: data.id,
            schoolName: data.school_name
        }
    } else {
        return {
            contractType: data.contract_type,
            experienceYears: data.experience_years,
            id: data.id,
            degrees: data.degrees
        }
    }
}

function translateTypeOfPerson(typeOfPerson) {
    return typeOfPerson === 'student' ? 'Estudiante' : 'Docente';
}

function translateState(state) {
    return state === 'active' ? 'Activo' : 'Inactivo';
}

const overviewFiltering = document.getElementById('overviewFiltering');

// para el select de ordenamineto del overview
overviewOrdering.addEventListener('change', (e) => {
    reloadDataTable(e.target.value, overviewFiltering.value);
});

// para el filtrado del overview

overviewFiltering.addEventListener('change', (e) => {
    reloadDataTable(overviewOrdering.value, e.target.value);
})


// para la ventana modal

addDegreeBtn.addEventListener('click', (e) => {
    e.preventDefault();
    // para limpiar los campos al abrir el modal form
    professorModal.querySelectorAll('.professor-modal-input').forEach(input => {
        input.value = '';
    });

    professorModal.style.display = 'flex';
    setTimeout(() => {
        professorModal.querySelector('.pr-modal-container').classList.add('active')
        professorModal.classList.add('active');
    }, 1);
});

function closeProfessorModalForm() {
    professorModal.querySelector('.pr-modal-container').classList.remove('active')
    setTimeout(() => {
        professorModal.style.display = 'none';
    }, 200);
}

modalCancelBtn.addEventListener('click', (e) => {
    e.preventDefault();
    closeProfessorModalForm();
});

professorModalForm.addEventListener('submit', (e) => {
    e.preventDefault();

    noDataDegree.style.display = 'none';

    const formData = new FormData(e.target);
    const degreeData = Object.fromEntries(formData.entries());

    const uid = generateUniqueId();

    const newDegreeItem = document.createElement('div');
    newDegreeItem.id = uid;
    newDegreeItem.classList.add('degree-item');

    // agregamos al arreglo
    degreeItemsArray.push({
        id: uid,
        name: degreeData.degreeName,
        typeOfDegree: degreeData.typeOfDegree,
        institution: degreeData.institution,
        graduationYear: degreeData.graduationYear
    });

    // creamos el nuevo elemento
    newDegreeItem.innerHTML = `
        <div class="degree-content">
            <h4>${degreeData.degreeName}</h4>
            <p>${degreeData.typeOfDegree} - ${degreeData.institution} (${degreeData.graduationYear})</p>
        </div>
        <button type="button" class="degree-action-button">Eliminar</button>
    `;

    newDegreeItem.querySelector('.degree-action-button')
        .addEventListener('click', () => removeDegreeItem(uid, newDegreeItem));

    degreeItemsContainer.appendChild(newDegreeItem);

    closeProfessorModalForm();
});

function removeDegreeItem(uid, newDegreeItem) {
    const index = degreeItemsArray.findIndex(item => item.id === uid);
    degreeItemsArray.splice(index, 1);
    newDegreeItem.remove();

}

function generateUniqueId() {
    return crypto.randomUUID()
}

prModalGraduationYear.setAttribute('max', new Date().getFullYear())

// para recuperar los datos del professor register y enviarlos al backend

prForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    prRegiserBtn.disabled = true;
    changeToLoadingButton(prRegiserBtn);
    const formData = new FormData(e.target);
    const professorData = Object.fromEntries(formData.entries());

    try {
        const response = await fetch('/register-professor', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                professorData,
                degreeItemsArray
            }),
            credentials: 'include'
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Error en la petición');
        }

        const result = await response.json();
        console.log('Registro exitoso:', result);


        deployCustomizedAlert(checkIcon, 'Docente registrado');
        clearPrForm();

    } catch (error) {
        console.log(error);
    }

    changeToRegisterButton(prRegiserBtn);
    prRegiserBtn.disabled = false;
})

function clearPrForm() {
    [...prForm.querySelectorAll('.pr-input')].forEach(input => input.value = '');
    noDataDegree.style.display = 'flex';
    degreeItemsContainer.innerHTML = '';
    degreeItemsContainer.appendChild(noDataDegree);
    degreeItemsArray = [];
}

function changeToLoadingButton(button) {
    button.textContent = '';
    button.classList.add('active-loading');
    button.disabled = true;
}

function changeToRegisterButton(button) {
    button.textContent = 'Registrar';
    button.classList.remove('active-loading');
    button.disabled = false;
}

function changeToNormalButton(button, text){
    button.textContent = text;
    button.classList.remove('active-loading');
    button.disabled = false;
}

// para obtener los docentes en la tabla de registro materia

async function reloadProfessorsSubjectTable() {
    document.getElementById('subjectTable').classList.add('active-loading');
    try {
        const response = await fetch('/get-all-professors');
        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error)
        }

        if (result.lenght === 0) return noDataSubject.classList.add('show');

        noDataSubject.classList.remove('show');
        subjectNoDataFound.classList.remove('show');
        addProfessorsToSubjectTable(result);

    } catch (error) {
        console.log(error);
    }
    document.getElementById('subjectTable').classList.remove('active-loading');

}

function addProfessorsToSubjectTable(data) {
    subjectTableBody.innerHTML = '';
    data.forEach(professor => {
        const newRow = document.createElement('tr');
        newRow.classList.add('subject-table-row');
        const { name, last_name: lastName, email, ci, phone } = professor;
        newRow.innerHTML = `
            <td class='name'>${name}</td>
            <td class='lastName'>${lastName}</td>
            <td>${email}</td>
            <td>${ci}</td>
            <td>${phone}</td>
        `;

        newRow.addEventListener('click', () => {
            selectedProfessorName.textContent = `${name} ${lastName}`;
            newRow.classList.add('selected-row');
            deselectAllRowsExcept(newRow);
            selectedProfessorData = {
                name,
                lastName,
                email,
                ci,
                phone
            }
            // console.log(selectedProfessorData);
        });

        subjectTableBody.appendChild(newRow);
    })
}

function deselectAllRowsExcept(selectedRow) {
    subjectTableBody.querySelectorAll('.selected-row').forEach(row => {
        if (row !== selectedRow) row.classList.remove('selected-row');
    });
}

// para el buscador en tiempo real del panel de registro materia

subjectSearchBar.addEventListener('input', async (e) => {
    document.getElementById('subjectTable').classList.add('active-loading');

    selectedProfessorName.textContent = '';
    selectedProfessorData = {};
    const content = e.target.value;
    const column = searchFiltering.value;

    console.log(column, content);

    try {
        const response = await fetch(`/get-professor?column=${column}&value=${content}`);

        if (response.status === 404) return deploySubjectNoDataFound(column, content);

        const result = await response.json();
        subjectNoDataFound.classList.remove('show');
        addProfessorsToSubjectTable(result);
    } catch (error) {
        console.log(error);
    }
    document.getElementById('subjectTable').classList.remove('active-loading');
});


function deploySubjectNoDataFound(column, value) {
    addProfessorsToSubjectTable([]);
    subjectNoDataFound.classList.add('show');
    subjectNoDataFound.querySelector('h4').textContent = `No se encontró ningún docente con el ${translateColumn(column)} '${value}'`;
}

function translateColumn(column) {
    switch (column) {
        case 'name':
            return 'nombre';
        case 'last_name':
            return 'apellido';
        case 'ci':
            return 'C.I.';
        case 'email':
            return 'E-mail';
            break
        case 'phone':
            return 'celular';
        default:
            return '';
    }
}

subjectForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (Object.keys(selectedProfessorData).length === 0) return deployCustomizedAlert(alertIcon, 'Se debe seleccionar un docente');

    changeToLoadingButton(subjectButton);

    const formData = new FormData(e.target);
    const subjectData = Object.fromEntries(formData.entries());

    console.log(subjectData);

    const response = await fetch('/register-subject', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            subjectData,
            selectedProfessorData
        }),
        credentials: 'include'
    });

    const result = await response.json();

    if (!response.ok) throw new Error(result.error);

    changeToRegisterButton(subjectButton);
    deployCustomizedAlert(checkIcon, result.message);
    clearSubjectPanel();

})

function clearSubjectPanel() {
    reloadProfessorsSubjectTable();
    document.getElementById('subjectName').value = '';
    subjectSearchBar.value = '';
    selectedProfessorData = {};
    selectedProfessorName.textContent = '';
}


async function updateTotalCard(route, className, idElement) {
    document.getElementById(idElement).textContent = '';
    document.getElementById(idElement).classList.add('active-loading');
    try {
        const response = await fetch(`/get-all-${route}`);
        const result = await response.json();

        if (!response.ok) throw new Error(response.error)

        // console.log(result);

        document.querySelectorAll(`.${className}`).forEach(p => {
            p.textContent = `${result.length}`;
        });

    } catch (error) {
        console.log(error);
    }
    document.getElementById(idElement).classList.remove('active-loading');

}

// para el panel de inscripcion


async function reloadEnrollStudentDataTable() {
    document.getElementById('enrollStudentTable').classList.add('active-loading');

    try {
        const response = await fetch('/get-all-students');

        if (!response.ok) throw new Error(response.error);

        const result = await response.json();

        addStudentsToEnrollTable(result)

    } catch (error) {
        console.log(error);

    }
    document.getElementById('enrollStudentTable').classList.remove('active-loading');
}

function addStudentsToEnrollTable(data) {
    if (data.lenght === 0) return;
    enrollStudentTableBody.innerHTML = '';
    data.map(personData => {
        const newRow = document.createElement('tr');
        newRow.classList.add('subject-table-row');

        const { id: personId, name, last_name: lastName, email, ci, phone, age, type,
            state, gender, created_at: createdAt
        } = personData;

        const { id: studentId, desired_major: desiredMajor, school_name: schoolName,
            guardian_name: guardianName, guardian_contact: guardianContact
        } = personData.student[0];

        newRow.innerHTML = `
            <td class='name'>${name}</td>
            <td class='lastName'>${lastName}</td>
            <td>${email}</td>
            <td>${ci}</td>
            <td>${phone}</td>
        `;

        newRow.addEventListener('click', () => {
            enrollSelectedStudent.textContent = `${name} ${lastName}`;
            newRow.classList.add('selected-row');
            unSelectAllRowsExcept(newRow, 'enrollStudentTableBody');

            enrollSelectedStudentData = {
                id: studentId, createdAt, desiredMajor, schoolName, guardianName, guardianContact,
                ci, personId, age, name, type, email, phone, state, gender, lastName
            }
        });

        document.getElementById('enrollStudentNoDataFound').classList.remove('show')
        enrollStudentTableBody.appendChild(newRow);
    })
}

function unSelectAllRowsExcept(selectedRow, bodyContainerId) {
    document.getElementById(bodyContainerId).querySelectorAll('.selected-row').forEach(row => {
        if (row !== selectedRow) row.classList.remove('selected-row');
    });
}

document.getElementById('enrollStudentSearchBar').addEventListener('input', async (e) => {
    document.getElementById('enrollStudentTable').classList.add('active-loading');
    enrollSelectedStudent.textContent = '';

    const value = e.target.value;
    const column = document.getElementById('enrollStudentsearchFiltering').value
    console.log(value);

    try {
        const response = await fetch(`/get-student?column=${column}&value=${value}`)

        const result = await response.json()

        if (response.status === 404) {
            deployEnrollNoDataFound('enrollStudentNoDataFound', result.message);
            document.getElementById('enrollStudentTableBody').classList.remove('active-loading');
        } else {
            if (!response.ok) throw new Error(response.error);
            addStudentsToEnrollTable(result)
        }


    } catch (error) {
        console.log(error);
    }
    document.getElementById('enrollStudentTable').classList.remove('active-loading');
})

function deployEnrollNoDataFound(noDataId, message) {
    addStudentsToEnrollTable([]);
    enrollStudentTableBody.innerHTML = '';
    document.getElementById(noDataId).classList.add('show');
    document.getElementById(noDataId).querySelector('h4').textContent = message;
}

function clearEnrollmentPanel() {
    enrollSelectedStudentData = {};
    enrollSelectedSubjectData = {};
    enrollSelectedStudent.textContent = '';
    enrollSelectedSubject.textContent = '';
    document.getElementById('enrollStudentSearchBar').value = '';
    document.getElementById('enrollSubjectSearchBar').value = '';
}











async function reloadEnrollSubjectDataTable() {
    document.getElementById('enrollSubjectTable').classList.add('active-loading')
    try {
        const response = await fetch('/get-all-subjects');

        if (!response.ok) throw new Error(response.error);

        const result = await response.json();

        addSubjectsToEnrollTable(result)

    } catch (error) {
        console.log(error);
    }
    document.getElementById('enrollSubjectTable').classList.remove('active-loading')
}

function addSubjectsToEnrollTable(data) {
    if (data.lenght === 0) return;
    enrollSubjectTableBody.innerHTML = '';
    data.forEach(subject => {
        const newRow = document.createElement('tr');
        newRow.classList.add('subject-table-row');
        newRow.classList.add('enroll-subject-table-row');
        const { id: subjectId, name: subjectName, shift, totalEnrolled } = subject;
        const { name: professorName, last_name: professorLastName } = subject.professor.person;
        const { name: facultyName } = subject.faculty;

        newRow.innerHTML = `
            <td class='name'>${subjectName}</td>
            <td class='lastName'>${shift === 'morning' ? 'Mañana' : 'Tarde'}</td>
            <td>${professorName} ${professorLastName}</td>
            <td>${translateFaculty(facultyName)}</td>
            <td>${totalEnrolled[0].count}</td>
        `;

        newRow.addEventListener('click', () => {
            enrollSelectedSubject.textContent = `${subjectName}`;
            newRow.classList.add('selected-row');
            unSelectAllRowsExcept(newRow, 'enrollSubjectTableBody')
            enrollSelectedSubjectData = {
                id: subjectId
            }
        });

        document.getElementById('enrollSubjectNoDataFound').classList.remove('show');
        enrollSubjectTableBody.appendChild(newRow);
    })
}

function translateFaculty(faculty) {
    switch (faculty) {
        case 'tech':
            return 'Tecnología';
        case 'economy':
            return 'Economía';
        case 'law':
            return 'Derecho';
        case 'humanities':
            return 'Humanidades';
        case 'medicine':
            return 'Medicina';
        case 'architecture':
            return 'Arquitectura';
        default:
            return `Couldn't be tranlated`; // Para casos no previstos
    }
}

document.getElementById('enrollSubjectSearchBar').addEventListener('input', async (e) => {
    document.getElementById('enrollSubjectTable').classList.add('active-loading');
    const value = e.target.value;
    const column = document.getElementById('enrollSubjectSearchFiltering').value;
    enrollSelectedSubject.textContent = '';
    console.log(value);


    try {
        const response = await fetch(`/get-subject?column=${column}&value=${value}`)
        const result = await response.json()

        if (response.status === 404) return deployEnrollSubjectNoDataFound(result.message);
        if (!response.ok) throw new Error(result.error);

        addSubjectsToEnrollTable(result);


    } catch (error) {

    }
    document.getElementById('enrollSubjectTable').classList.remove('active-loading');
})

function deployEnrollSubjectNoDataFound(message) {
    addSubjectsToEnrollTable([]);
    enrollSubjectTableBody.innerHTML = '';
    document.getElementById('enrollSubjectNoDataFound').classList.add('show');
    document.getElementById('enrollSubjectNoDataFound').querySelector('h4').textContent = message;
}

document.getElementById('enrollRegisterBtn').addEventListener('click', async (e) => {
    if (isSelectionMissing()) return deployCustomizedAlert(alertIcon, 'Seleccione estudiante y materia');
    try {
        changeToLoadingButton(e.target)
        const { id: studentId, name, lastName } = enrollSelectedStudentData;
        const { id: subjectId } = enrollSelectedSubjectData;

        const response = await fetch('/insert-enrollment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                studentId,
                subjectId
            })
        });
        const result = await response.json();

        if (!response.ok) throw new Error(result.message);

        deployCustomizedAlert(checkIcon, 'Inscripcion exitosa');

        clearEnrollmentPanel();
        reloadEnrollStudentDataTable();
        reloadEnrollSubjectDataTable();

    } catch (error) {
        console.log(error);

    }
    changeToRegisterButton(e.target)

})

function isSelectionMissing() {
    return enrollSelectedStudent.textContent.trim() === ''
        || enrollSelectedSubject.textContent.trim() === ''
        || Object.keys(enrollSelectedStudentData).length === 0
        || Object.keys(enrollSelectedSubjectData).length === 0
}







