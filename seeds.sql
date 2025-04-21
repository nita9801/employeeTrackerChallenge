-- Drop existing tables
DROP TABLE IF EXISTS employee CASCADE;
DROP TABLE IF EXISTS role CASCADE;
DROP TABLE IF EXISTS department CASCADE;

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

-- Insert sample data
INSERT INTO department (name) VALUES ('Engineering'), ('Finance'), ('HR');
INSERT INTO role (title, salary, department_id) VALUES 
    ('Software Engineer', 80000, 1),
    ('Accountant', 60000, 2),
    ('HR Manager', 70000, 3);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES 
    ('John', 'Doe', 1, NULL),
    ('Jane', 'Smith', 2, NULL),
    ('Emily', 'Davis', 3, NULL);
