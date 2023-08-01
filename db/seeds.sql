INSERT INTO department (department.name) 
VALUES 
("Sales"),
("Engineering"),
("Finance"),
("Legal"),
("HR");

INSERT INTO role (role.title, role.salary, role.department_id)
VALUES
("Sales Lead", 100000, 1),
("Salesperson", 80000, 1),
("Cheif Engineer", 150000, 2),
("Software Engineer", 120000, 2),
("Accountant Manager", 160000, 3),
("Accountant", 125000, 3),
("Legal Team Lead", 250000, 4),
("Lawyer", 190000, 4),
("HR Lead", 140000, 5),
("HR Representative", 65000, 5);

INSERT INTO employee (employee.first_name, employee.last_name, employee.role_id, employee.manager_id)
VALUES
("John", "Doe", 1, NULL),
("Mike", "Chan", 2, 1),
("Ashley", "Rodriguez", 3, NULL),
("Kevin", "Tupik", 4, 3),
("Malia", "Brown", 5, NULL),
("Sarah", "Lourd", 6, 5),
("Tom", "Allen", 7, NULL),
("Sam", "Clemens", 8, 7),
("Samantha", "Papadopoulos", 9, NULL),
("John", "Lennon", 10, 9);