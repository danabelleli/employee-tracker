//const express = require('express');
const inquirer = require('inquirer');

const db = require('./db/connection');
require('console.table');

const questions =
    [{
        type: 'list',
        message: "What would you like to do?",
        name: 'command',
        choices: [
            'View all departments',
            'View all roles',
            'View all employees',
            'Add a department',
            'Add a role',
            'Add an employee',
            'Update employee role',
            'Quit'
        ]
    }];


//handle add Department 
const addDepartmentQuestion =
    [
        {
            type: 'input',
            messgae: 'What is the name of the department?',
            name: 'departmentName'
        }
    ];

const departmentAdd = (userAnswer) => {
    db.query(`INSERT INTO department (name) VALUES(?)`, userAnswer.departmentName,
        function (err, result) {
            db.promise().query('select * from department').then(function (tableData) {
                console.table(tableData[0]);
                setTimeout(startApp, 1500);
            });
        });
};

async function getManagers() {
    try {
        const tableData = await db.promise().query(`SELECT id AS value, CONCAT(first_name,' ',last_name ) as name FROM employess WHERE manager_id is null`);
        return tableData[0];

    } catch (err) {
        console.log(err);
    }
};

async function getRoles() {
    try {
        const tableData = await db.promise().query('select id AS value, title AS name from role');
        return tableData[0];
    } catch (err) {
        console.log(err);
    }
};

async function getEmployees() {
    try {
        const tableData = await db.promise().query(`SELECT id AS value, CONCAT(first_name,' ',last_name ) as name FROM employess`);
        return tableData[0];
    } catch (err) {
        console.log(err);
    }
};

async function displayResult(option) {
    if (option.command === 'View all departments') {
        db.promise().query('select * from department').then(function (tableData) {
            console.table(tableData[0]);
            setTimeout(startApp, 1500);
        });
    } else if (option.command === 'View all roles') {
        db.promise().query('select * from role').then(function (tableData) {
            console.table(tableData[0]);
            setTimeout(startApp, 1500);
        });
    } else if (option.command === 'View all employees') {
        db.promise().query('select * from employess').then(function (tableData) {
            console.table(tableData[0]);
            setTimeout(startApp, 1500);
        });
    } else if (option.command === 'Add a department') {
        inquirer.prompt(addDepartmentQuestion).then((userInput) => {
            departmentAdd(userInput);
        });
    } else if (option.command === 'Add a role') {
        db.promise().query('SELECT id AS value, name FROM department').then(function (tableDate) {
            inquirer.prompt([
                {
                    type: 'input',
                    message: 'What is the name of the role?',
                    name: 'roleName'
                },
                {
                    type: 'input',
                    message: 'What is the salary of the role?',
                    name: 'roleSalary'
                },
                {
                    type: 'list',
                    message: 'Which department does the role belong to?',
                    name: 'departmentId',
                    choices: tableDate[0]
                }
            ]).then((userAnswer) => {
                db.query(`INSERT INTO role (title, salary, department_id) VALUES(?,?,?)`, [userAnswer.roleName, userAnswer.roleSalary, userAnswer.departmentId],
                    function (err, result) {
                        db.promise().query('select * from role').then(function (tableData) {
                            console.table(tableData[0]);
                            setTimeout(startApp, 1500);
                        });
                    });
            });
        })

    } else if (option.command === 'Add an employee') {
        let managers = await getManagers();
        let roles = await getRoles();

        inquirer.prompt([
            {
                type: 'input',
                message: "What is the employee's first name?",
                name: 'employeeFirstName'
            },
            {
                type: 'input',
                message: "What is the employee's last name?",
                name: 'employeeLastName'
            },
            {
                type: 'list',
                message: 'What role belong to ?',
                name: 'roleId',
                choices: roles
            },
            {
                type: 'list',
                message: 'Who is the manager ?',
                name: 'departmentId',
                choices: managers
            }
        ]).then((userAnswer) => {
            console.log(userAnswer);
            db.query(`INSERT INTO employess (first_name, last_name, role_id, manager_id) VALUES(?,?,?,?)`, [userAnswer.employeeFirstName, userAnswer.employeeLastName, userAnswer.roleId, userAnswer.departmentId],
                function (err, result) {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        console.log(`Added ${userAnswer.employeeFirstName} + ${userAnswer.employeeLastName} to the database`);
                        db.promise().query('select * from employess').then(function (tableData) {
                            console.table(tableData[0]);
                            setTimeout(startApp, 1500);
                        });
                    }
                });
        });


    } else if (option.command === 'Update employee role') {
        let employees = await getEmployees();
        let roles = await getRoles();
        inquirer.prompt([
            {
                type: 'list',
                message: "Which employee's role would you like to update?",
                name: 'employeeID',
                choices: employees
            },
            {
                type: 'list',
                message: "Which role would you like to assign to the selected employee?",
                name: 'roleId',
                choices: roles
            }
        ]).then((userAnswer) => {
            db.query(`UPDATE employess SET role_id = ? WHERE id = ?`, [userAnswer.roleId, userAnswer.employeeID],
                function (err, result) {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        console.log("Updated employee's role");
                        db.promise().query('select * from employess').then(function (tableData) {
                            console.table(tableData[0]);
                            setTimeout(startApp, 1500);
                        });
                    }
                });
        });

    }
    else if (option.command === 'Quit') {
        process.exit();
    }
}

function startApp() {
    inquirer.prompt(questions).then((option) => {
        displayResult(option);
    });
}

startApp();







