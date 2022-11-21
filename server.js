const {db, models: {Teacher, Student}, syncAndSeed}= require('./db'); 
const express = require('express'); 

const app = express(); 
app.use(express.urlencoded({ extended: false }));






app.get('/', async (req, res, next) =>{
    try {
        const teachers = await Teacher.findAll(); 

        res.send(`
          <html>
            <head>
            </head>
            <body>
                <h1>Class List</h1>
                <ul>
                ${teachers.map(teacher => `
                    <li>
                    <a href= '/students/${teacher.id}'>
                    ${teacher.subject} Taught By ${teacher.name}
                    </a>
                    </li>
                `).join('')}
                </ul>
                <h2> Add a New Student: </h2>
                <form method= "POST" action= "/" >
                    <select name = 'teacherId'>
                        ${teachers.map(teacher =>`
                        <option value='${teacher.id}'>${teacher.name} </option>
                        `)}
                    </select>
                    <input name = "name" placeholder = "Students Name" required />
                    <button> add </button>
                </form>
            </body>
          </html>  
        `)
    } catch (error) {
        next(error);
    }
})

app.get('/students/:id', async (req, res, next) =>{
    try {
        let students = await Student.findAll({
            where: {
                teacherId: req.params.id
            },
            include: Teacher
        }); 

        res.send(`
          <html>
            <head>
            </head>
            <body>
            <h1> Students In Class</h1>
            <nav>
                <a href = "/">
                <div class= 'home'>Home</div>
                </a>
            </nav>
                <ul>
                ${students.map(student => `
                    <li>
                    ${student.name}
                    </li>
                `).join('')}
                </ul>
            </body>
          </html>  
        `)
    } catch (error) {
        next(error);
    }
})
app.post('/', async (req, res, next) => {
    try {
     await Student.create({
        name : req.body.name,
        teacherId: req.body.teacherId
     });
     res.redirect('/');
    } catch (error) {
     next(error);
    }
     
    
 });



const init = async () => {
    try {
        await syncAndSeed();
        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => console.log(`Listening on port ${PORT}`))
    } catch (error) {
        console.log(error);
    }
}

init();

