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
  database: "employee_trackerDB",
});

// clg that we are connected to database
connection.connect(function (err) {
  if (err) throw err;
  console.log("🔥connected🔥");
  askPrompt();
});

function askPrompt() {
  inquirer
    .prompt([
      {
        type: "list",
        message: "Select what you would like to do:",
        choices: [
          "View departments",
          "View employees",
          "View roles",
          "Add a department",
          "Add an employee",
          "Add a role",
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
        case "EXIT":
          exitApp();
          break;
      }
    });
}

function viewDepartments() {
  var query = "SELECT * FROM department";
  connection.query(query, function (err, res) {
    if (err) throw err;
    console.log("all departments: ", res);
    console.table(res);
    console.log("============");
    askPrompt();
  });
}

function viewEmployees() {
  var query = "SELECT * FROM employee";
  connection.query(query, function (err, res) {
    if (err) throw err;
    console.log("all employees: ", res);
    console.table(res);
    console.log("============");
    askPrompt();
  });
}

function viewRole() {
  var query = "SELECT * FROM role";
  connection.query(query, function (err, res) {
    if (err) throw err;
    console.log("all roles: ", res);
    console.table(res);
    console.log("============");
    askPrompt();
  });
}

function exitApp() {
  process.exit(0);
}
