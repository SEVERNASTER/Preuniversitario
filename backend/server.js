const express = require('express');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

app.use(express.json());
app.use(express.static('public'));

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
        const {name, email} = req.body;
        
        // const {data, error} = await supabase
        // .from('admin')
        // .insert([{
        //     name,
        //     email
        // }]);

        const {data, error} = await supabase
        .from('admin')
        .select('*');

        if(error) throw error;

        if(data) res.status(200).json(data);
    } catch (error) {
        res.status(400).json({message: error.message});
        console.error(error);
    }
});