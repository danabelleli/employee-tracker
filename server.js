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

// hanlde add department
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

const addRoleQuestion = [
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
        choices: `SELECT name FROM department`
    }
];



function displayResult(option) {
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
    } else if (option.command === 'Quit') {
        process.exit();
    }
}

function startApp() {
    inquirer.prompt(questions).then((option) => {
        displayResult(option);
    });
}

startApp();







