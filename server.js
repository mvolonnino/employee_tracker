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
  startPrompt();
});

function startPrompt() {
  console.log("WELCOME TO THE EMPLOYEE MANAGEMENT SYSTEM");
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
          viewRoles();
          break;
      }
    });
}
