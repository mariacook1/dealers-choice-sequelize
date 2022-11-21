const Sequelize = require('sequelize');
const db = new Sequelize(process.env.DATABASE_URL || 'postgres://localhost/dealers_choice_db');
const {UUID, UUIDV4, STRING} = Sequelize; 


const Teacher = db.define('teacher', {
    id: {
        type: UUID,
        primaryKey: true, 
        defaultValue: UUIDV4
    },
    name: {
        type: STRING
    },
    subject: {
        type: STRING 
    }
})

const Student = db.define('student', {
    id: {
        type: UUID,
        primaryKey: true, 
        defaultValue: UUIDV4
    },
    name: {
        type: STRING
    }
})

Student.belongsTo(Teacher); 
Teacher.hasMany(Student); 

async function syncAndSeed() {
    try {
        await db.sync({ force: true });

        const [adams, smith, bailey] = await Promise.all([
            Teacher.create({name: 'Mr. Adams', subject: 'Math'}), 
            Teacher.create({name: 'Ms. Smith', subject: 'English'}),
            Teacher.create({name: 'Ms. Bailey', subject: 'History'})
        ]);
        const [jake, lucy, paul, jordan, kelly, ann, luke, jessica, tyler]= await Promise.all([
            Student.create({name: 'Jake'}),
            Student.create({name: 'Lucy'}),
            Student.create({name: 'Paul'}),
            Student.create({name: 'Jordan'}),
            Student.create({name: 'Kelly'}),
            Student.create({name: 'Ann'}),
            Student.create({name: 'Luke'}),
            Student.create({name: 'Jessica'}),
            Student.create({name: 'Tyler'})
        ]);
        jake.teacherId = adams.id;
        await jake.save(); 

        lucy.teacherId = adams.id;
        await lucy.save();

        paul.teacherId = adams.id;
        await paul.save(); 

        jordan.teacherId = smith.id;
        await jordan.save(); 

        kelly.teacherId = smith.id;
        await kelly.save(); 

        ann.teacherId = smith.id;
        await ann.save(); 

        luke.teacherId = bailey.id;
        await luke.save();

        jessica.teacherId = bailey.id;
        await jessica.save(); 

        tyler.teacherId = bailey.id;
        await tyler.save(); 
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    db, 
    models: {
        Teacher,
        Student
    },
    syncAndSeed
}
