const inquirer = require('inquirer');

const questions = [{
    type: 'list',
    message: "What would you like to do?",
    name: 'SelectOption',
    choices: [
        'View all departments',
        'View all roles',
        'View all employees',
        'Add a department',
        'Add a role',
        'Add an employee',
        'Update employee role'
    ]
}
]