USE employee_db;

-- add departments
​
INSERT INTO department(dept_name)
VALUES ("Sales"),
("Engineering"),
("Finance"),
("Legal");

-- add roles into corressponding departments
​
INSERT INTO role (title, salary, department_id)
VALUES ("Salesperson", 80000, 1),
("Sales Lead", 100000, 1), 
("Lead Engineer", 150000, 2), 
("Software Engineer", 120000, 2), 
("Account Manager", 160000, 3), 
("Accountant", 125000, 3),
("Legal Team Lead", 250000, 4), 
("Lawyer", 190000, 4);
​
-- add the names for the employees
​
INSERT INTO employee(first_name, last_name, role_id, manager_id)
VALUES ('Tony', 'Stark', 1, NULL),
    ('Steve', 'Rodgers', 2, 1),
    ('Bruce', 'Banner', 3, NULL),
    ('Clint', 'Barton', 4, 3),
    ('Natasha', 'Romanov', 5, NULL),
    ('Nick', 'Fury', 6, 5),
    ('Thor', 'Odinson', 7, NULL),
    ('Stan', 'Lee', 8, 7);