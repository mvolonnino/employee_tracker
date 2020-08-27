// Dependcies
const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require("console.table");

// connect to database
var connection = mysql.createConnection({
  host: "localhost",
  port: "3306",
  user: "root",
  password: "basement",
  database: "employee_db",
});

// clg that we are connected to database
connection.connect(function (err) {
  if (err) throw err;
  console.log("🔥connected🔥");
  askPrompt();
});

function askPrompt() {
  console.log("**** WELCOME TO THE EMPLOYEE DATABASE APPLICATION ****");
  inquirer
    .prompt([
      {
        type: "list",
        message: "Select what you would like to do:",
        choices: [
          "View departments",
          "View roles",
          "View employees",
          "Add department",
          "Add role",
          "Add employee",
          "Remove employee",
          // "Update employee role",
          "EXIT",
        ],
        name: "action",
      },
    ])
    .then(function (answer) {
      switch (answer.action) {
        case "View departments":
          viewDepartments();
          break;
        case "View employees":
          viewEmployees();
          break;
        case "View roles":
          viewRole();
          break;
        case "Add department":
          addDepartment();
          break;
        case "Add role":
          addRole();
          break;
        case "Add employee":
          addEmployee();
          break;
        case "Remove employee":
          remEmployee();
          break;
        // case "Update employee role":
        //   updateEmpRole();
        //   break;
        case "EXIT":
          exitApp();
          break;
      }
    });
}

// view all departments
function viewDepartments() {
  var query = "SELECT * FROM department ORDER BY id";
  connection.query(query, function (err, res) {
    if (err) throw err;
    // console.log("all departments: ", res);
    console.table(res);
    console.log("============================================================");
    askPrompt();
  });
}

// view employees with their is, role title, role salary, and dept_name
function viewEmployees() {
  var query =
    "SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, department.dept_name FROM employee INNER JOIN role ON role_id=role.id INNER JOIN department ON department.id=role.department_id;";
  connection.query(query, function (err, res) {
    if (err) throw err;
    // console.log("all employees: ", res);
    console.table(res);
    console.log("============================================================");
    askPrompt();
  });
}

// view roles combined with the department name
function viewRole() {
  var query =
    "SELECT department.id, department.dept_name, role.title, role.salary FROM department INNER JOIN role ON department.id=role.department_id ORDER BY id";
  connection.query(query, function (err, res) {
    if (err) throw err;
    // console.log("all roles: ", res);
    console.table(res);
    console.log("============================================================");
    askPrompt();
  });
}

// add a new department - must be unique
function addDepartment() {
  inquirer
    .prompt({
      type: "input",
      message: "What is the name of the department you want to add?",
      name: "department",
    })
    .then(function (answer) {
      var query = "INSERT INTO department SET ?";
      connection.query(query, { dept_name: answer.department }, function (
        err,
        res
      ) {
        if (err) throw err;
        console.log("Added new department");
        console.log(
          "============================================================"
        );
        askPrompt();
      });
    });
}

// validate that an input is only numbers
function validSalary(salary) {
  var reg = /^\d+$/;
  return reg.test(salary) || "Salary should be a number, delete and re enter";
}

// add a new role from the existing deptartments with base salary
function addRole() {
  var dept = "SELECT * FROM department ORDER BY id";
  connection.query(dept, function (err, res) {
    var deptArr = [];
    for (var i = 0; i < res.length; i++) {
      deptArr.push(res[i].id + ": " + res[i].dept_name);
    }
    inquirer
      .prompt([
        {
          type: "list",
          message: "Choose the department to add the role too:",
          choices: deptArr,
          name: "department",
        },
        {
          type: "input",
          message: "What is title of the role you want to add?",
          name: "role",
        },
        {
          type: "input",
          message: "What is the starting salary?",
          name: "salary",
          validate: validSalary,
        },
      ])
      .then(function (answer) {
        // console.log("answer: ", answer);
        var query = "INSERT INTO role SET ?";
        connection.query(
          query,
          {
            title: answer.role,
            salary: answer.salary,
            department_id: parseInt(answer.department.split(" ")),
          },
          function (err, res) {
            if (err) throw err;
            console.log("Added new role");
            console.log(
              "============================================================"
            );
            askPrompt();
          }
        );
      });
  });
}

// add a new employee with first and last name, and role title
function addEmployee() {
  var empRole = "SELECT * FROM role ORDER BY id";
  connection.query(empRole, function (err, res) {
    if (err) throw err;
    var empArr = [];
    for (var i = 0; i < res.length; i++) {
      empArr.push(res[i].id + ": " + res[i].title);
    }
    // console.log("empArr: ", empArr);
    inquirer
      .prompt([
        {
          type: "input",
          message: "What is employee's first name?",
          name: "first",
        },
        {
          type: "input",
          message: "What is employee's last name?",
          name: "last",
        },
        {
          type: "list",
          message: "What is employee's job title?",
          choices: empArr,
          name: "role",
        },
      ])
      .then(function (answer) {
        var query = "INSERT INTO employee SET ?";
        connection.query(
          query,
          {
            first_name: answer.first.trim(),
            last_name: answer.last.trim(),
            role_id: parseInt(answer.role.split(" ")),
          },
          function (err, res) {
            if (err) throw err;
            console.log("Added new employee");
            console.log(
              "============================================================"
            );
            askPrompt();
          }
        );
      });
  });
}

// deletes employee by id from employees table
function remEmployee() {
  var employee = "SELECT * FROM employee ORDER BY id";
  connection.query(employee, function (err, res) {
    if (err) throw err;
    var empArr = [];
    for (var i = 0; i < res.length; i++) {
      empArr.push(
        res[i].id + ": " + res[i].first_name + " " + res[i].last_name
      );
    }
    inquirer
      .prompt([
        {
          type: "list",
          message: "Select which employee you would like to remove:",
          choices: empArr,
          name: "remove",
        },
      ])
      .then(function (answer) {
        var query = "DELETE FROM employee WHERE ?";
        connection.query(
          query,
          { id: parseInt(answer.remove.split(" ")) },
          function (err, res) {
            if (err) throw err;
            console.log("Removed " + answer.remove + " from employees");
            console.log(
              "============================================================"
            );
            askPrompt();
          }
        );
      });
  });
}

// update employe roles -> coming soon!
// function updateEmpRole() {
//   var viewEmpTable =
//     "SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, department.dept_name FROM employee INNER JOIN role ON role_id=role.id INNER JOIN department ON department.id=role.department_id;";
//   var empTable = [];
//   connection.query(viewEmpTable, function (err, res) {
//     console.log("res: ", res);
//     if (err) throw err;
//     for (var i = 0; i < res.length; i++) {
//       empTable.push(
//         res[i].id +
//           ": " +
//           res[i].first_name +
//           " " +
//           res[i].last_name +
//           "'s role as " +
//           res[i].title
//       );
//     }
//     console.log("empTable ", empTable);
//     inquirer
//       .prompt([
//         {
//           type: "list",
//           message:
//             "Select which employee you would like to update their role to:",
//           choices: empTable,
//           name: "employee",
//         },
//       ])
//       .then(function (answer) {
//         console.log("answer ", answer);
//       });
//   });

//   // var update = "UPDATE role SET ? WHERE ?"
// }

// exit out of the application
function exitApp() {
  console.log("Exiting the application...");
  console.log("============================================================");
  process.exit(0);
}
