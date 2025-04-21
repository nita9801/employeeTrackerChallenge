import inquirer from 'inquirer';
import db from './db.js';

// Main menu
const mainMenu = async () => {
  const { action } = await inquirer.prompt([
    {
      type: 'list',
      name: 'action',
      message: 'What would you like to do?',
      choices: [
        'View All Departments',
        'View All Roles',
        'View All Employees',
        'Add a Department',
        'Add a Role',
        'Add an Employee',
        'Update an Employee Role',
        'Exit',
      ],
    },
  ]);

  switch (action) {
    case 'View All Departments':
      return viewAllDepartments();
    case 'View All Roles':
      return viewAllRoles();
    case 'View All Employees':
      return viewAllEmployees();
    case 'Add a Department':
      return addDepartment();
    case 'Add a Role':
      return addRole();
    case 'Add an Employee':
      return addEmployee();
    case 'Update an Employee Role':
      return updateEmployeeRole();
    case 'Exit':
      console.log('Goodbye!');
      process.exit();
  }
};

// View all departments
const viewAllDepartments = async () => {
  const result = await db.query('SELECT * FROM department');
  console.table(result.rows);
  mainMenu();
};

// View all roles
const viewAllRoles = async () => {
  const result = await db.query(`
    SELECT role.id, role.title, role.salary, department.name AS department
    FROM role
    JOIN department ON role.department_id = department.id
  `);
  console.table(result.rows);
  mainMenu();
};

// View all employees
const viewAllEmployees = async () => {
  const result = await db.query(`
    SELECT employee.id, employee.first_name, employee.last_name, role.title AS role, department.name AS department, role.salary, 
    CONCAT(manager.first_name, ' ', manager.last_name) AS manager
    FROM employee
    JOIN role ON employee.role_id = role.id
    JOIN department ON role.department_id = department.id
    LEFT JOIN employee AS manager ON employee.manager_id = manager.id
  `);
  console.table(result.rows);
  mainMenu();
};

// Add a department
const addDepartment = async () => {
  const { name } = await inquirer.prompt([
    {
      type: 'input',
      name: 'name',
      message: 'Enter the name of the department:',
    },
  ]);

  await db.query('INSERT INTO department (name) VALUES ($1)', [name]);
  console.log(`Added department: ${name}`);
  mainMenu();
};

// Add a role
const addRole = async () => {
  const departments = await db.query('SELECT * FROM department');
  const { title, salary, departmentId } = await inquirer.prompt([
    {
      type: 'input',
      name: 'title',
      message: 'Enter the title of the role:',
    },
    {
      type: 'input',
      name: 'salary',
      message: 'Enter the salary for the role:',
    },
    {
      type: 'list',
      name: 'departmentId',
      message: 'Select the department for the role:',
      choices: departments.rows.map((dept) => ({
        name: dept.name,
        value: dept.id,
      })),
    },
  ]);

  await db.query('INSERT INTO role (title, salary, department_id) VALUES ($1, $2, $3)', [
    title,
    salary,
    departmentId,
  ]);
  console.log(`Added role: ${title}`);
  mainMenu();
};

// Add an employee
const addEmployee = async () => {
  const roles = await db.query('SELECT * FROM role');
  const employees = await db.query('SELECT * FROM employee');
  const { firstName, lastName, roleId, managerId } = await inquirer.prompt([
    {
      type: 'input',
      name: 'firstName',
      message: "Enter the employee's first name:",
    },
    {
      type: 'input',
      name: 'lastName',
      message: "Enter the employee's last name:",
    },
    {
      type: 'list',
      name: 'roleId',
      message: "Select the employee's role:",
      choices: roles.rows.map((role) => ({
        name: role.title,
        value: role.id,
      })),
    },
    {
      type: 'list',
      name: 'managerId',
      message: "Select the employee's manager:",
      choices: [
        { name: 'None', value: null },
        ...employees.rows.map((emp) => ({
          name: `${emp.first_name} ${emp.last_name}`,
          value: emp.id,
        })),
      ],
    },
  ]);

  await db.query(
    'INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)',
    [firstName, lastName, roleId, managerId]
  );
  console.log(`Added employee: ${firstName} ${lastName}`);
  mainMenu();
};

// Update an employee role
const updateEmployeeRole = async () => {
  const employees = await db.query('SELECT * FROM employee');
  const roles = await db.query('SELECT * FROM role');
  const { employeeId, roleId } = await inquirer.prompt([
    {
      type: 'list',
      name: 'employeeId',
      message: 'Select the employee to update:',
      choices: employees.rows.map((emp) => ({
        name: `${emp.first_name} ${emp.last_name}`,
        value: emp.id,
      })),
    },
    {
      type: 'list',
      name: 'roleId',
      message: 'Select the new role:',
      choices: roles.rows.map((role) => ({
        name: role.title,
        value: role.id,
      })),
    },
  ]);

  await db.query('UPDATE employee SET role_id = $1 WHERE id = $2', [roleId, employeeId]);
  console.log('Employee role updated.');
  mainMenu();
};

// Start the application
mainMenu();