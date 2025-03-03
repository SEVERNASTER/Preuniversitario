

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
    console.log(token);
    
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
    const data = await response.json();

    if (response.ok) {
        loginPage.style.transform = 'translateY(-100%)';
        deployCustomizedAlert(checkIcon, `${data.message}`);
        console.log(data);
        
    } else {
        console.log(data.message);
        alert("algo salio mal")
    }
}











// logoutBtn.addEventListener('click', () => {
//     deployCustomizedAlert(checkIcon, 'Test Message');
// });

function deployCustomizedAlert(icon, messageText){
    hideAllIconsExcept(icon.name);
    message.classList.add('show');
    message.style.backgroundColor = icon.color;
    message.querySelector('h2').textContent = messageText;
    setTimeout(() => {
        message.classList.remove('show');
    }, 3000);
}

function hideAllIconsExcept(idIcon){
    message.querySelectorAll('.message-icon').forEach(icon => {
        if(icon.id !== idIcon){
            icon.style.display = 'none';
        }else {
            icon.style.display = 'inline';
        }
    });
}

async function insertAdmin(){
    let response = await fetch('/admin', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            name: 'admin1',
            email: 'someemail@gmail.com'
        }),
    });


    let data = await response.json();

    console.log(data);
    

    if(response.ok){
        console.log("admin registrado");
    }else{
        console.log(response.message);
    }
}


