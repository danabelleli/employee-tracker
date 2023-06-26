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
];

const showAllDepartments = function () {

}

inquirer.prompt(questions)
    .then((answers) => {
        if (answers.SelectOption === 'View all departments') {
            // call function to view all departments
        } else if (answers.SelectOption === 'View all roles') {

        } else if (answers.SelectOption === 'View all employees') {

        }
    });

