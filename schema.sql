DROP DATABASE IF EXISTS employee_tracker;

CREATE DATABASE  employee_tracker;


\c employee_tracker

CREATE TABLE department(
  id SERIAL PRIMARY KEY,
  name VARCHAR (30 ) UNIQUE NOT NULL
);

CREATE TABLE role(
  id SERIAL PRIMARY KEY,  
  title VARCHAR(30) UNIQUE NOT NULL,
  salary DECIMAL NOT NULL,
  department_id INTEGER NOT NULL,
  FOREIGN KEY (department_id) REFERENCES department(id)
); 

CREATE TABLE employee(
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  role_id INTEGER NOT NULL,
  manager_id INTEGER,
  FOREIGN KEY (role_id) REFERENCES role(id),
  FOREIGN KEY (manager_id) REFERENCES employee(id)
);
