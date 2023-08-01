-- Select all employees and their ids, roles, departments, salaries, and managers
SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager
FROM employee
LEFT JOIN role ON employee.role_id = role.id
LEFT JOIN department ON role.department_id = department.id
LEFT JOIN employee manager ON manager.id = employee.manager_id;

-- Select all departments and department ids
SELECT * FROM department;

-- Select all job titles, role ids, salary, and department for that role
SELECT role.id AS ID, role.title AS Job_Title, role.salary AS Salary, department.name AS Department
FROM role
LEFT JOIN department ON role.department_id = department.id;