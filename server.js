// Import and require packages
const inquirer = require('inquirer');
const mysql = require('mysql2');
const express = require('express');

// Connect to mysql database
const db = mysql.createConnection(
    {
        host: 'localhost',
        port: 3306,
        user: 'root',
        password: 'spamANDeggs',
        database: 'employee_db'
    },
    console.log('Connected to the employee_db database.')
);

// Start the server
const app = express();
const PORT = process.env.PORT || 3001;

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Default response for any other request (Not Found)
app.use((req, res) => {
    res.status(404).end();
});

// Start server after DB connection
db.connect(err => {
    if (err) throw err;
    console.log('Database connected.');
    // start the application
    mainMenu();
});


function mainMenu() {
    inquirer.prompt({
        type: 'list',
        name: 'action',
        message: 'What would you like to do?',
        choices: [
            'View all employees',
            'View all departments',
            'View all roles',
            'Add an employee',
            'Add a department',
            'Add a role',
            'Update an employee role',
            'Exit'
        ]
    })
    .then(answer => {
        switch (answer.action) {
            case 'View all employees':
                viewEmployees();
                break;
            case 'View all departments':
                viewDepartments();
                break;
            case 'View all roles':
                viewRoles();
                break;
            case 'Add an employee':
                addEmployee();
                break;
            case 'Add a department':
                addDepartment();
                break;
            case 'Add a role':
                addRole();
                break;
            case 'Update an employee role':
                updateRole();
                break;
            case 'Exit':
                db.end();
                break;
        }
    });
}
function viewEmployees () {
    const sql = `SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager
    FROM employee
    LEFT JOIN role ON employee.role_id = role.id
    LEFT JOIN department ON role.department_id = department.id
    LEFT JOIN employee manager ON manager.id = employee.manager_id`;
    db.query(sql, (err, rows) => {
        if (err) throw err;
        console.table(rows);
        mainMenu();
    });
}

function viewDepartments () {
    const sql = `SELECT * FROM department`;
    db.query(sql, (err, rows) => {
        if (err) throw err;
        console.table(rows);
        mainMenu();
    });
}

function viewRoles () {
    const sql = `SELECT * FROM role`;
    db.query(sql, (err, rows) => {
        if (err) throw err;
        console.table(rows);
        mainMenu();
    });
}

function addEmployee () {
    db.query(`SELECT id, title FROM role`, (err, role) => {
        if (err) throw err;
    
        const roles = role.map(({ id, title }) => ({
            name: title, 
            value: id,
        }));

        db.query(`SELECT id, first_name, last_name FROM employee`, (err, employee) => {
            if (err) throw err;
            const employees = employee.map(({ id, first_name, last_name }) => ({ 
                name: `${first_name} ${last_name}`, 
                value: id,
             }));

            inquirer.prompt([
                {
                    type: 'input',
                    name: 'first_name',
                    message: "What is the employee's first name?"
                },
                {
                    type: 'input',
                    name: 'last_name',
                    message: "What is the employee's last name?"
                },
                {
                    type: 'list',
                    choices: roles,
                    name: 'role_id',
                    message: "What is the employee's role?"
                },
                {
                    type: 'list',
                    choices: employees,
                    name: 'manager_id',
                    message: "Who is the employee's manager?"
                }
            ])
            .then(answer => {
                const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id)
                VALUES (?, ?, ?, ?)`;
                const params = [answer.first_name, answer.last_name, answer.role_id, answer.manager_id];
                db.query(sql, params, (err, result) => {
                    if (err) throw err;
                    console.log('Employee added.');
                    mainMenu();
                });
            });
        });
    });
}



function addDepartment () {
    inquirer.prompt([
        {
            type: 'input',
            name: 'name',
            message: "What is the department's name?"
        }
    ])
    .then(answer => {
        const sql = `INSERT INTO department (name)
        VALUES (?)`;
        const params = [answer.name];
        db.query(sql, params, (err, result) => {
            if (err) throw err;
            console.log('Department added.');
            mainMenu();
        });
    });
}

function addRole () {
    db.query(`SELECT id, name FROM department`, (err, department) => {
        if (err) throw err;
    
        const departments = department.map(({ id, name }) => ({
            name: name, 
            value: id,
        }));
        inquirer.prompt([
            {
                type: 'input',
                name: 'title',
                message: "What is the role's title?"
            },
            {
                type: 'input',
                name: 'salary',
                message: "What is the role's salary?"
            },
            {
                type: 'list',
                choices: departments,
                name: 'department_id',
                message: "What is the role's department?"
            }
        ])
        .then(answer => {
            const sql = `INSERT INTO role (title, salary, department_id)
            VALUES (?, ?, ?)`;
            const params = [answer.title, answer.salary, answer.department_id];
            db.query(sql, params, (err, result) => {
                if (err) throw err;
                console.log('Role added.');
                mainMenu();
            });
        });
    });
}

function updateRole () {
    db.query(`SELECT id, title FROM role`, (err, role) => {
        if (err) throw err;
    
        const roles = role.map(({ id, title }) => ({
            name: title, 
            value: id,
        }));
        db.query(`SELECT id, first_name, last_name FROM employee`, (err, employee) => {
            if (err) throw err;

            const employees = employee.map(({ id, first_name, last_name }) => ({
                name: `${first_name} ${last_name}`, 
                value: id,
            }));
            inquirer.prompt([
                {
                    type: 'list',
                    choices: employees,
                    name: 'employee_id',
                    message: "Who is the employee?"
                },
                {
                    type: 'list',
                    choices: roles,
                    name: 'role_id',
                    message: "What is the employee's new role?"
                }
            ])
            .then(answer => {
                const sql = `UPDATE employee
                SET role_id = ?
                WHERE id = ?`;
                const params = [answer.role_id, answer.employee_id];
            db.query(sql, params, (err, result) => {
                if (err) throw err;
                console.log('Employee role updated.');
                mainMenu();
                });
            });
        });
    });
}