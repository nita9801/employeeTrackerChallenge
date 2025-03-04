import pkg from 'pg';
import inquirer from 'inquirer';
import dotenv from 'dotenv';

dotenv.config();
const { Client } = pkg;

const client = new Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

client.connect();

async function mainMenu() {
  const answers = await inquirer.prompt([
    {
      type: 'list',
      name: 'action',
      message: 'What would you like to do?',
      choices: [
        'View all departments',
        'View all roles',
        'View all employees',
        'Add a department',
        'Add a role',
        'Add an employee',
        'Update an employee role',
        'Exit'
      ],
    },
  ]);

  switch (answers.action) {
    case 'View all departments':
      viewAllDepartments();
      break;
    case 'View all roles':
      viewAllRoles();
      break;
    case 'View all employees':
      viewAllEmployees();
      break;
    case 'Add a department':
      addDepartment();
      break;
    case 'Add a role':
      addRole();
      break;
    case 'Add an employee':
      addEmployee();
      break;
    case 'Update an employee role':
      updateEmployeeRole();
      break;
    case 'Exit':
      client.end();
      break;
  }
}

async function viewAllDepartments() {
  const res = await client.query('SELECT * FROM department');
  console.table(res.rows);
  mainMenu();
}

async function viewAllRoles() {
  const res = await client.query('SELECT * FROM role');
  console.table(res.rows);
  mainMenu();
}

async function viewAllEmployees() {
  const res = await client.query('SELECT * FROM employee');
  console.table(res.rows);
  mainMenu();
}

async function addDepartment() {
  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'name',
      message: 'What is the Department name:',
    },
  ]);

  await client.query('INSERT INTO department (name) VALUES ($1)', [answers.name]);
  console.log('Successfully added Department');
  mainMenu();
}

async function addRole() {
  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'title',
      message: 'What is the Title of the position:',
    },
    {
      type: 'input',
      name: 'salary',
      message: 'What is the Salary:',
    },
    {
      type: 'input',
      name: 'department_id',
      message: 'What is the Dept ID:',
    },
  ]);

  await client.query('INSERT INTO role (title, salary, department_id) VALUES ($1, $2, $3)', [answers.title, answers.salary, answers.department_id]);
  console.log('Successfully added the Role');
  mainMenu();
}

async function addEmployee() {
  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'first_name',
      message: 'first name of the employee:',
    },
    {
      type: 'input',
      name: 'last_name',
      message: 'last name of the employee:',
    },
    {
      type: 'input',
      name: 'role_id',
      message: 'What is the employee role?:',
    },
    {
      type: 'input',
      name: 'manager_id',
      message: 'what is the Manager ID (if any):',
    },
  ]);

  await client.query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)', [answers.first_name, answers.last_name, answers.role_id, answers.manager_id || null]);
  console.log('successfully added');
  mainMenu();
}

async function updateEmployeeRole() {
  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'employee_id',
      message: 'enter employee ID:',
    },
    {
      type: 'input',
      name: 'role_id',
      message: 'Enter the employee role:',
    },
  ]);

  await client.query('UPDATE employee SET role_id = $1 WHERE id = $2', [answers.role_id, answers.employee_id]);
  console.log('UPDATE to employee role complete');
  mainMenu();
}

mainMenu();