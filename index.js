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
      validate: function(value) {
        const valid = !isNaN(parseInt(value));
        return valid || 'Please enter a valid number';
      },
    },
  ]);

  const departmentId = parseInt(answers.department_id);

  // Check if the department_id exists
  const res = await client.query('SELECT * FROM department WHERE id = $1', [departmentId]);
  if (res.rows.length === 0) {
    console.error('Error: Department ID does not exist.');
    return mainMenu();
  }

  try {
    await client.query('INSERT INTO role (title, salary, department_id) VALUES ($1, $2, $3)', [answers.title, answers.salary, departmentId]);
    console.log('Successfully added the Role');
  } catch (error) {
    console.error('Error adding role:', error);
  }

  mainMenu();
}

const addEmployee = async () => {
  const answers = await inquirer.prompt([
    { name: 'first_name', message: 'First name of the employee:' },
    { name: 'last_name', message: 'Last name of the employee:' },
    { name: 'role_id', message: 'What is the employee role ID?' },
    { name: 'manager_id', message: 'What is the Manager ID (if any):', default: null }
  ]);

  const managerId = answers.manager_id ? parseInt(answers.manager_id) : null;

  try {
    await client.query(
      'INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)',
      [answers.first_name, answers.last_name, answers.role_id, managerId]
    );
    console.log('Successfully added Employee');
  } catch (err) {
    console.error('Error adding employee:', err);
  }

  mainMenu();
};

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