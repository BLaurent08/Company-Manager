const mysql = require('mysql2');
const fs = require('fs');
const path = require('path');
const http = require('http');
const { parse } = require('querystring');
require ('dotenv/config');
const jQuery = require('jquery');

const connection = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    port: process.env.PORT,
});

connection.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
});

const baseURl = "https://company-manager-nine.vercel.app/";

const server = http.createServer((req, res) => {
    let url = req.url.split('?');
    if (url[0] === '/') {
        file = 'index.html';
        router(file, res);
    } 
    else if (url[0] === '/departments') {
        file = 'departments.html';
        router(file, res);
    }
    else if (url[0] === '/getdepartments') {
        getDepartments(req, res);
    }
    else if (url[0] === '/adddepartments') {
        addDepartment(req, res);
    }
    else if (url[0] === '/updatedepartments') {
        updateDepartment(req, res);
    }
    else if (url[0] === '/deletedepartments') {
        deleteDepartment(req, res);
    }
    else if (url[0] === '/departmentnames') {
        departmentNames(req, res);
    }
    else if (url[0] === '/employees') {
        file = 'employees.html';
        router(file, res);
    }
    else if (url[0] === '/getemployees') {
        getEmployees(req, res);
    }
    else if (url[0] === '/addemployees') {
        addEmployee(req, res);
    }
    else if (url[0] === '/updateemployees') {
        updateEmployee(req, res);
    }
    else if (url[0] === '/deleteemployees') {
        deleteEmployee(req, res);
    }
    else if (url[0] === '/favicon.ico') {
        res.end();
        return;
    }
    else {
        file = req.url;
        router(file, res);
    }
}).listen(3000, () => console.log('Server is running on http://localhost:3000'));

function router(file, res) {
    fs.readFile(path.join(__dirname, 'public', file), (err, data) => {
        if (err) {
            console.log(err);
        } 
        else {
            res.end(data);
        }
    });
}

function getDepartments(req, res) {
    connection.query("SELECT * FROM departments", function (err, result, fields) {
        if (err) throw err;
        res.end(JSON.stringify(result));
    });
}

function addDepartment(req, res) {
    let body = '';
    req.on('data', chunk => {
        body += chunk.toString();
    });
    req.on('end', () => {
        let department = parse(body);
        connection.query(`INSERT INTO departments (departmentName, director, budget) VALUES ("${department.departmentName}", "${department.director}", "${department.budget}")`, function (err, result, fields) {
            if (err){
                res.end("Error");
            }
            else{
                res.end("Ok");
            }
        });
    });
}

function updateDepartment(req, res) {
    let body = '';
    req.on('data', chunk => {
        body += chunk.toString();
    });
    req.on('end', () => {
        let department = parse(body);
        connection.query(`UPDATE departments SET departmentName = "${department.departmentName}", director = "${department.director}", budget = "${department.budget}" WHERE departmentID = "${department.departmentID}"`, function (err, result, fields) {
            if (err){
                res.end("Error");
            }
            else{
                res.end("Ok");
            }
        });
    });
}

function deleteDepartment(req, res) {
    let body = '';
    req.on('data', chunk => {
        body += chunk.toString();
    });
    req.on('end', () => {
        let department = parse(body);
        connection.query(`DELETE FROM departments WHERE departmentID = "${department.departmentID}"`, function (err, result, fields) {
            if (err){
                res.end("Error");
            }
            else{
                res.end("Ok");
            }
        });
    });
}

function departmentNames(req, res) {
    connection.query("SELECT departmentName FROM departments", function (err, result, fields) {
        if (err) throw err;
        res.end(JSON.stringify(result));
    });
}

function getEmployees(req, res) {
    connection.query("SELECT employees.employeeID, employees.employeeName, departments.departmentName, employees.activity FROM employees INNER JOIN departments WHERE employees.departmentID = departments.departmentID", function (err, result, fields) {
        if (err) throw err;
        res.end(JSON.stringify(result));
    });
}

function addEmployee(req, res) {
    let body = '';
    req.on('data', chunk => {
        body += chunk.toString();
    });
    req.on('end', () => {
        let employee = parse(body);
        console.log(employee);
        connection.query(`SELECT departmentID FROM departments WHERE departmentName = "${employee.departmentName}"`, function (err, result, fields) {
            if (err) throw err;
            console.log(result[0].departmentID);
            connection.query(`INSERT INTO employees (employeeName, departmentID, activity) VALUES ("${employee.employeeName}", "${result[0].departmentID}", "${employee.activity}")`, function (err, result, fields) {
                if (err){
                    res.end("Error");
                }
                else{
                    res.end("Ok");
                }
            });
        });
    });
}

function updateEmployee(req, res) {
    let body = '';
    req.on('data', chunk => {
        body += chunk.toString();
    });
    req.on('end', () => {
        let employee = parse(body);
        connection.query(`SELECT departmentID FROM departments WHERE departmentName = "${employee.departmentName}"`, function (err, result, fields) {
            if (err) throw err;
            connection.query(`UPDATE employees SET employeeName = "${employee.employeeName}", departmentID = "${result[0].departmentID}", activity = "${employee.activity}" WHERE employeeID = "${employee.employeeID}"`, function (err, result, fields) {
                if (err){
                    res.end("Error");
                }
                else{
                    res.end("Ok");
                }
            });
        });
    });
}

function deleteEmployee(req, res) {
    let body = '';
    req.on('data', chunk => {
        body += chunk.toString();
    });
    req.on('end', () => {
        let employee = parse(body);
        connection.query(`DELETE FROM employees WHERE employeeID = "${employee.employeeID}"`, function (err, result, fields) {
            if (err){
                res.end("Error");
            }
            else{
                res.end("Ok");
            }
        });
    });
}