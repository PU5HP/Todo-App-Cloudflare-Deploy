import express from 'express';
import { getTodos, getUser, insertTodo, insertUser, updateUser } from './routes';

// Initialize the express engine
const app: express.Application = express();

// Take a port 3000 for running server.
const port: number = 3000;
app.use(express.json());
// Handling '/' Request
app.get('/', (_req, _res) => {
    _res.send("TypeScript With Express");
});
 //signup route
app.post('/signup',async (req,res)=>{

    try {
        const userCreated = await insertUser(req.body.username,req.body.password,req.body.firstName,req.body.lastName,req.body.email);
        if (userCreated!==null) {
            res.status(201).json({ message: 'User created successfully' });
        } else {
            res.status(400).json({ message: 'User with this username or email already exists' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
})

// Server setup
app.listen(port, () => {
    console.log(`TypeScript with Express
         http://localhost:${port}/`);
});

//creating todos
app.post('/todos/:id',async (req,res)=>{
    try{
        const todoCreated = await insertTodo(req.body.title,req.body.description,req.body.done,parseInt(req.params.id));
        res.status(201).json({'message':'Todo Created Successfully'})
    }
    catch(error){
        res.status(500).json({ "message": 'Internal server error' });
    }
})

//getting user and todo details
app.get('/info/:username',async(req,res)=>{
    try{
        const info = await getUser(req.params.username);
        res.status(200).json({info});
    }
    catch(error){
        res.status(500).json({ "message": 'Internal server error' });
    }
})

//updating the user
app.put('/user/:username', async(req,res)=>{
    try{
        const response = await updateUser(req.params.username,req.body.firstName,req.body.lastName);
        res.status(200).json({response});
    }
    catch(error){
        res.status(500).json({ "message": 'Internal server error' });
    }
})

//getting todo
app.get('/todos/:id',async (req,res)=>{
    try{
        const response = await getTodos(parseInt(req.params.id));
        res.status(200).json({response});
    }
    catch(error){
        res.status(500).json({ "message": 'Internal server error' });
    }
})
