const express = require('express');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const port = process.env.PORT || 3000;

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

app.use(cors());
app.use(express.json());
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// para verificar el token y la sesion del usuario
async function authMiddleware(req, res, next) {
    const token = req.cookies.supabase_token;

    if (!token) {
        return res.status(401).json({ message: "No autenticado" });
    }

    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data?.user) {
        return res.status(401).json({ message: "Token inválido o expirado" });
    }

    req.user = data.user;
    next();
}



// para regitrar al usuairo
app.post('/register', async (req, res) => {
    const { email, name, password } = req.body;
    console.log(email, name, password);

    try {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: { userName: name }
            }
        });

        if (error) throw error;

        res.status(201).json({
            message: 'Usuario registrado correctamente',
            user: data.user
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});


// Ruta para login de un usuario
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        if (error) throw error;

        const token = data.session.access_token;

        res.cookie('supabase_token', token, {
            httpOnly: true,
            // secure: true,
            sameSite: "Strict",
            maxAge: 60 * 60 * 24,
        });

        res.status(200).json({
            message: `Bienvenido, ${data.user?.user_metadata?.userName}!`,
            user: data.user
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// para cerrar sesion
app.post('/logout', async (req, res) => {
    try {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
        res.status(200).json({ message: 'Sesión cerrada correctamente' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});


app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});


// para obtener todo de admin

app.post('/admin', async (req, res) => {
    try {
        const { name, email } = req.body;

        // const {data, error} = await supabase
        // .from('admin')
        // .insert([{
        //     name,
        //     email
        // }]);

        const { data, error } = await supabase
            .from('admin')
            .select('*');

        if (error) throw error;

        if (data) res.status(200).json(data);
    } catch (error) {
        res.status(400).json({ message: error.message });
        console.error(error);
    }
});

// para registrar un nuevo estudiante
app.post('/register-student', authMiddleware, async (req, res) => {
    try {

        const { srName, srLastName, srAge, srCi, srPhone, srEmail, srGender, srSchool, srGuardian, srGuardianPhone, srDesireMajor } = req.body;

        const { data: personData, error: personError } = await supabase
            .from("person")
            .insert([
                {
                    name: srName,
                    last_name: srLastName,
                    age: srAge,
                    ci: srCi,
                    phone: srPhone,
                    email: srEmail,
                    type: 'student',
                    state: 'active',
                    gender: srGender
                },
            ])
            .select('id')
            .single();

        if (personError) throw personError;
        if (!personData) console.log('Person data is null: ' + personData);

        const { data: studentData, error: studentError } = await supabase
            .from('student')
            .insert([{
                desired_major: srDesireMajor,
                school_name: srSchool,
                guardian_name: srGuardian,
                guardian_contact: srGuardianPhone,
                id_person: personData.id
            }]);

        if (studentError) throw studentError;

        res.status(201).json({ message: "Estudiante registrado con éxito!" });
        console.log(personData, studentData);

    } catch (error) {
        res.status(500).json({ message: "Error al registrar estudiante", error: error.message });
    }
})

// para devolver todas las personas de la institucion

app.get('/get-all-people', async (req, res) => {
    const { orderBy } = req.query;
    const isAscending = orderBy === 'asc' ? true : false;

    try {

        const { data, error } = await supabase
            .from('person')
            .select(`*`)
            .order('created_at', { ascending: isAscending });

        if (!data) console.log('Data is null: ' + data);
        if (error) console.log(error);

        res.status(200).json(data);
    } catch (error) {
        res.status(500).json(error);
    }

})

// para registrar un docente
/** Para insertar en tablas que tengan relaciones o llaves foraneas de otras tablas es importante 
 * habilitar 2 policies, INSERT para usuarios autendicados obviamente porque van a hacer una 
 * insercion en la tabla y la otra SELECT (enable READ acces for all users) porque se hace un 
 * select del id al momento de hacer la insercion del nuevo registro para luego usarlo como llave
 * foranea en otra tabla
*/
app.post('/register-professor', authMiddleware, async (req, res) => {
    try {
        const { professorData: professorDataSet, degreeItemsArray } = req.body;

        const {
            prAge,
            prCi,
            prContractType,
            prEmail,
            prGender,
            prLastName,
            prName,
            prPhone,
            prYearsOfExp
        } = professorDataSet;


        // para insertar en persona

        const { data: personData, error: personError } = await supabase
            .from('person')
            .insert([{
                name: prName,
                last_name: prLastName,
                age: prAge,
                ci: prCi,
                phone: prPhone,
                email: prEmail,
                type: 'professor',
                state: 'active',
                gender: prGender
            }])
            .select('id')
            .single();


        if (personError) throw new Error(personError.message);
        if (!personData) throw new Error('person data is null' + personData);

        const { data: professorData, error: professorError } = await supabase
            .from('professor')
            .insert([{
                experience_years: prYearsOfExp,
                contract_type: prContractType,
                id_person: personData.id
            }])
            .select('id')
            .single();

        console.log(professorData, professorError);

        if (professorError) throw professorError;
        if (!professorData) console.log('professor data is null' + professorData);

        // para los titulos

        const degrees = degreeItemsArray.map(item => ({
            name: item.name,
            type_of_degree: item.typeOfDegree,
            institution: item.institution,
            graduation_year: item.graduationYear,
            id_professor: professorData.id
        }));

        const { data: degreeData, error: degreeError } = await supabase
            .from('degree')
            .insert(degrees);

        if (degreeError) throw degreeError;

        res.status(201).json({ message: 'Succesfull register' });


    } catch (error) {

        console.log(error);
        res.status(500).json({ message: 'Error al registrar el docente', error: error.message });

    }
})

// para obtener docentes solamente

/** para hacer cualquier operacion sobre la base de datos, siempre y cuando la tabla tenga policies.
 * se debe estar autenticado primero
*/

app.get('/get-all-professors', authMiddleware, async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('person')
            .select('*')
            .eq('type', 'professor');

        if (!data) return res.status(404).json({ message: 'No se encontraron docentes' });
        if (error) throw error;//si esta asi falla pero si le ponemos console log da nomrmal

        res.status(200).json(data);

    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los docentes', error: error.message });
    }

})

// para obtener docentes que cumplan cierta condicion

app.get('/get-professor', async (req, res) => {
    try {
        const { column , value } = req.query;
        const { data, error } = await supabase
        .from('person')
        .select('*')
        .eq('type', 'professor')
        .or(`${column}.ilike.%${value}%`)

        if(data.length === 0) return res.status(404).json( { message: 'No se encontró ningún docente' })
        if(error) throw error;

        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})

// para registrar una nueva materia

app.post('/register-subject', async (req, res) => {
    try {
        const { subjectData, selectedProfessorData: professor} = req.body
        
        const { sbName, sbShift, sbFaculty } = subjectData;

        // esto me devuelve un arreglo con todas las filas, si es que solo hay una sera un arreglo
        // con un solo elemento, por eso o hacemos .single() o hacemos .data[0] 
        const { data: facultyData, error: facultyError} = await supabase
        .from('faculty')
        .select('id')
        .eq('name', sbFaculty)
        .single();

        if(facultyError) throw facultyError;

        const { name, lastName, email, ci, phone} = professor;

        const { data: personData, error: personError } = await supabase
        .from('person')
        .select('id')
        .eq('type', 'professor')
        .eq('name', name)
        .eq('last_name', lastName)
        .eq('ci', ci)
        .eq('email', email)
        .eq('phone', phone)
        .single();

        if(personError) throw personError;

        const {data: professorData, error: professorError} = await supabase
        .from('professor')
        .select('id')
        .eq('id_person', personData.id)
        .single();

        if(professorError) throw professorError;

        const { data: sbData, error: sbError } = await supabase
        .from('subject')
        .insert([{
            name: sbName,
            shift: sbShift,
            id_professor: professorData.id,
            id_faculty: facultyData.id
        }]);

        if(sbError) throw sbError;
        
        
        res.status(201).json({ message: 'Se registró la materia'});


    } catch (error) {
        res.status(500).json({error: error.message});
    }
})

// para obtener todas las facultades

app.get('/get-all-faculties', async (req, res) => {
    try {
        const { data, error } = await supabase
        .from('faculty')
        .select('*')

        if(error) throw error;

        res.status(200).json(data);

    } catch (error) {
        res.status(500).json({error: error.message});
    }
})

// para obtener todas las materias

app.get('/get-all-subjects', async (req, res) => {
    try {
        const { data, error } = await supabase
        .from('subject')
        .select('*')

        if(error) throw error;

        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})

