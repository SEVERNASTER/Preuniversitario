

// const variables

const signUpBtn = document.getElementById('signUp');
const signInBtn = document.getElementById('signIn');
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

let degreeItemsArray = [];


// const logoutBtn = document.getElementById('logout');
const checkIcon = {
    name: 'check',
    color: '#10A37F'
}
const alertIcon = {
    name: 'alert',
    color: '#fe8d59'
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
});

// para el boton de unirse
signUpBtn.addEventListener('click', () => {
    signInForm.classList.add('active-transition');
    signUpForm.classList.add('active-transition');
    signInBtn.classList.add('active');
    signUpBtn.classList.add('active');
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
    registerUser(signEmailInput.value, signNameInput.value, signPassInput.value);
});

async function registerUser(email, name, password) {
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

    if (response.ok) {
        alert('usuario registrado');
        console.log(data.user);

    } else {
        console.log(data.message);
        alert('algo salio mal');
    }
}

// para el login

loginBtn.addEventListener('click', async (e) => {
    e.preventDefault();
    loginUser(logEmailInput.value, logPassInput.value);
});

async function loginUser(email, password) {

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

    if (response.ok) {
        loginPage.style.transform = 'translateY(-100%)';
        deployCustomizedAlert(checkIcon, `${result.message}`);
        reloadDataTable('desc');

        reloadProfessorsSubjectTable();
    } else {
        console.log(result.message);
    }
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
    switchPanelViewTo(overviewPanel)
});

sideStudent.addEventListener('click', () => {
    switchPanelViewTo(studentRegisterPanel)
});

sideProfessor.addEventListener('click', () => {
    switchPanelViewTo(professorRegisterPanel)
});

sideSubject.addEventListener('click', () => {
    switchPanelViewTo(subjectRegisterPanel)
    reloadProfessorsSubjectTable();
    selectedProfessorName.textContent = '';
});

function switchPanelViewTo(panel) {
    currentPanel.style.display = 'none';
    currentPanel = panel;
    currentPanel.style.display = 'grid';
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
async function reloadDataTable(orderBy) {
    overviewTable.classList.add('active-loading');
    const res = await fetch(`/get-all-people?orderBy=${orderBy}`);
    const data = await res.json();

    overviewTable.innerHTML = '';
    data.forEach(personData => {
        const newRow = document.createElement('tr');
        const createdAt = new Date(personData.created_at);
        const formattedDate = createdAt.toLocaleDateString("es-ES");

        newRow.innerHTML = `
            <td>${personData.name} ${personData.last_name}</td>
            <td>${personData.email}</td>
            <td>${translateTypeOfPerson(personData.type)}</td>
            <td>${formattedDate}</td>
            <td>${translateState(personData.state)}</td>
        `;
        overviewTable.appendChild(newRow);
    });
    overviewTable.classList.remove('active-loading');
}


function translateTypeOfPerson(typeOfPerson) {
    return typeOfPerson === 'student' ? 'Estudiante' : 'Docente';
}

function translateState(state) {
    return state === 'active' ? 'Activo' : 'Inactivo';
}

// para el select de ordenamineto del overview
overviewOrdering.addEventListener('change', () => reloadDataTable(overviewOrdering.value));


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
}

function changeToRegisterButton(button) {
    button.textContent = 'Registrar';
    button.classList.remove('active-loading');
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
        newRow.classList.add('subject-table-row')
        const name = professor.name;
        const lastName = professor.last_name;
        newRow.innerHTML = `
            <td class='name'>${name}</td>
            <td class='lastName'>${lastName}</td>
            <td>${professor.email}</td>
            <td>${professor.ci}</td>
            <td>${professor.phone}</td>
        `;

        newRow.addEventListener('click', () => {
            selectedProfessorName.textContent = `${name} ${lastName}`;
            newRow.classList.add('selected-row');
            deselectAllRowsExcept(newRow);
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
    const content = e.target.value;
    const column = searchFiltering.value;

    console.log(column, content);
    
    
    const response = await fetch(`/get-professor?column=${column}&&value=${content}`);
    const result = await response.json()

    if(!response.ok) throw new Error(result.error);

    console.log(result);
    
    
})



