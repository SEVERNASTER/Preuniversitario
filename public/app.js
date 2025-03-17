

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

// para logarse

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
    } else {
        console.log(result.message);
        alert("algo salio mal")
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
});

function switchPanelViewTo(panel) {
    currentPanel.style.display = 'none';
    currentPanel = panel;
    currentPanel.style.display = 'grid';
}


// para el boton de registro de estudiante

srForm.addEventListener('submit', async (e) => {
    // console.log(hola);
    e.preventDefault();

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

        const result = await response.json();
        console.log("Respuesta del servidor:", result);

        if (response.ok) {
            console.log('sucess');

        } else {
            console.log('failure');

        }
    } catch (error) {
        console.error(error);
    }

});

// para la visualizacion de materias en el overview panel

async function reloadDataTable() {
    const res = await fetch('/get-all-persons');
    const data = await res.json();

    overviewTable.innerHTML = '';

    console.log(data);
    data.forEach(personData => {
        const newRow = document.createElement('tr');
        const createdAt = new Date(personData.created_at);
        newRow.innerHTML = `
            <td>${personData.name} ${personData.last_name}</td>
            <td>${personData.email}</td>
            <td>${translateTypeOfPerson(personData.type)}</td>
            <td>${createdAt.toLocaleDateString()}</td>
            <td>${translateState(personData.state)}</td>
        `;
        overviewTable.appendChild(newRow);
    });
}

function translateTypeOfPerson(typeOfPerson) {
    return typeOfPerson === 'student' ? 'Estudiante' : 'Docente';
}

function translateState(state) {
    return state === 'active' ? 'Activo' : 'Inactivo';
}

reloadDataTable();


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
});

professorModalForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const degreeData = Object.fromEntries(formData.entries());

    console.log(degreeData.degreeName);
    degreeItemsContainer.innerHTML += `
        <div class="degree-item">
            <div class="degree-content">
                <h4>${degreeData.degreeName}</h4>
                <p>${degreeData.typeOfDegree} - ${degreeData.institution} (${degreeData.graduationYear})</p>
            </div>
            <button class="degree-action-button">Eliminar</button>
            </div>
    `;
    closeProfessorModalForm();

})

