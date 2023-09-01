const baseURl = "https://company-manager-nine.vercel.app/";

function submitData() {
    var CRUD = document.getElementById("function").value;
    if (document.title === "Departments") {
        if (CRUD === "Create") {
            addDepartment();
        }
        else if (CRUD === "Update") {
            updateDepartment();
        }
        else if (CRUD === "Delete") {
            deleteDepartment();
        }
        document.getElementById("deptID").value = "";
        document.getElementById("deptName").value = "";
        document.getElementById("director").value = "";
        document.getElementById("budget").value = "";
    }
    else if (document.title === "Employees") {
        if (CRUD === "Create") {
            addEmployee();
        }
        else if (CRUD === "Update") {
            updateEmployee();
        }
        else if (CRUD === "Delete") {
            deleteEmployee();
        }
        document.getElementById("empID").value = "";
        document.getElementById("empName").value = "";
        document.getElementById("category").value = "";
        document.getElementById("activity").value = "";
    }
}

function getDepartments() {
    $.ajax({
        url: baseURL + 'getdepartments',
        type: 'GET',
        success: function (data) {
            displayDepartments(data);
        }
    });
}

function displayDepartments(data) {
    var table = document.getElementById("postDepartment");
    var departments = JSON.parse(data);
    if(departments.length === 0){
        document.getElementById("C").setAttribute("selected", "true");
        document.getElementById("U").setAttribute("disabled", "true");
        document.getElementById("D").setAttribute("disabled", "true");
        ChangeEnabled();
    }
    else{
        document.getElementById("U").removeAttribute("disabled");
        document.getElementById("D").removeAttribute("disabled");
        ChangeEnabled();
    }
    table.innerHTML = "";
    departments.forEach(department => {
        table.innerHTML += `<tr onclick='editDept(${JSON.stringify(department)})' ><td>${department.departmentID}</td><td>${department.departmentName}</td><td>${department.director}</td><td>${department.budget}</td></tr>`;
    });
}

function addDepartment() {
    var departmentName = checkCases(document.getElementById("deptName").value);
    var director = checkCases(document.getElementById("director").value);
    var budget = document.getElementById("budget").value;
    if(departmentName === "" || director === "" || budget === ""){
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Please fill out all fields',
        })
        return;
    }
    var department = {
        departmentName: departmentName,
        director: director,
        budget: budget
    };
    $.ajax({
        url: baseURl + 'adddepartments',
        type: 'POST',
        data: department,
        success: function (data) {
            if(data === "Ok")  
                getDepartments();
            else {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Either the Director or Department Name is a duplicate',
                })
            }
        }
    });
}

function updateDepartment() {
    var departmentID = document.getElementById("deptID").value;
    var departmentName = checkCases(document.getElementById("deptName").value);
    var director = checkCases(document.getElementById("director").value);
    var budget = document.getElementById("budget").value;
    if (departmentID === "" || departmentName === "" || director === "" || budget === "") {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Please fill out all fields',
        })
        return;
    }
    var department = {
        departmentID: departmentID,
        departmentName: departmentName,
        director: director,
        budget: budget
    };
    $.ajax({
        url: baseURl + 'updatedepartments',
        type: 'POST',
        data: department,
        success: function (data) {
            if(data === "Ok")  
                getDepartments();
            else {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Either the department does not exist \n or the Director or Department Name is a duplicate',
                })
            }
        }
    });
}

function deleteDepartment() {
    var departmentID = document.getElementById("deptID").value;
    if (departmentID === "") {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Please fill out all fields',
        })
        return;
    }
    var department = {
        departmentID: departmentID
    };
    $.ajax({
        url: baseURl + 'deletedepartments',
        type: 'POST',
        data: department,
        success: function (data) {
            if(data === "Ok") {
                getDepartments();
            }
            else if (data === "Contains Employees") {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Department still contains employees',
                })
            }
            else {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Department does not exist',
                })
            }
        }
    });
}

function editDept(department) {
    if (document.getElementById("function").value === "Create") {
        return;
    }
    else{
        document.getElementById("deptID").value = department.departmentID;
        document.getElementById("deptName").value = department.departmentName;
        document.getElementById("director").value = department.director;
        document.getElementById("budget").value = department.budget;
    }
}

function getEmployees() {
    $.ajax({
        url: baseURl + 'getemployees',
        type: 'GET',
        success: function (data) {
            displayEmployees(data);
        }
    });
}

function displayEmployees(data) {
    var table = document.getElementById("postEmployee");
    var employees = JSON.parse(data);
    if(employees.length === 0){
        document.getElementById("C").setAttribute("selected", "true");
        document.getElementById("U").setAttribute("disabled", "true");
        document.getElementById("D").setAttribute("disabled", "true");
        ChangeEnabled();
    }
    else{
        document.getElementById("U").removeAttribute("disabled");
        document.getElementById("D").removeAttribute("disabled");
        ChangeEnabled();
    }
    table.innerHTML = "";
    employees.forEach(employee => {
        table.innerHTML += `<tr onclick='editEmp(${JSON.stringify(employee)})' ><td>${employee.employeeID}</td><td>${employee.employeeName}</td><td>${employee.departmentName}</td><td>${employee.activity}</td></tr>`;
    });
}

function populateSelect() {
    $.ajax({
        url: baseURl + 'departmentnames',
        type: 'GET',
        success: function (data) {
            var departments = JSON.parse(data);
            if (departments.length === 0) {
                document.getElementById("C").setAttribute("selected", "true");
                document.getElementById("U").setAttribute("disabled", "true");
                document.getElementById("D").setAttribute("disabled", "true");
                ChangeEnabled();
            }
            var select = document.getElementById("category");
            select.innerHTML = "<option selected disabled>Select a Department</option>";
            departments.forEach(department => {
                select.innerHTML += `<option value="${department.departmentName}">${department.departmentName}</option>`;
            });
        }
    });
}

function addEmployee() {
    var employeeName = checkCases(document.getElementById("empName").value);
    var departmentName = document.getElementById("category").value;
    var activity = document.getElementById("activity").value;
    if (employeeName === "" || departmentName === "" || activity === "") {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Please fill out all fields',
        })
        return;
    }
    var employee = {
        employeeName: employeeName,
        departmentName: departmentName,
        activity: activity
    };
    $.ajax({
        url: baseURl + 'addemployees',
        type: 'POST',
        data: employee,
        success: function (data) {
            if(data === "Ok")
                getEmployees();
            else {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Either the Employee Name is a duplicate \n or the Department does not exist',
                })
            }
        }
    });
}

function updateEmployee() {
    var employeeID = document.getElementById("empID").value;
    var employeeName = checkCases(document.getElementById("empName").value);
    var departmentName = document.getElementById("category").value;
    var activity = document.getElementById("activity").value;
    if (employeeID === "" || employeeName === "" || departmentName === "" || activity === "") {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Please fill out all fields',
        })
        return;
    }
    var employee = {
        employeeID: employeeID,
        employeeName: employeeName,
        departmentName: departmentName,
        activity: activity
    };
    $.ajax({
        url: baseURl + 'updateemployees',
        type: 'POST',
        data: employee,
        success: function (data) {
            if(data === "Ok")
                getEmployees();
            else {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Either the employee does not exist \n or the Employee Name is a duplicate.',
                })
            }
        }
    });
}

function deleteEmployee() {
    var employeeID = document.getElementById("empID").value;
    if (employeeID === "") {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Please fill out all fields',
        })
        return;
    }
    var employee = {
        employeeID: employeeID
    };
    $.ajax({
        url: baseURl + 'deleteemployees',
        type: 'POST',
        data: employee,
        success: function (data) {
            if(data === "Ok")
                getEmployees();
            else {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Employee does not exist',
                })
            }
        }
    });
}

function editEmp(employee) {
    if (document.getElementById("function").value === "Create") {
        return;
    }
    else{
        document.getElementById("empID").value = employee.employeeID;
        document.getElementById("empName").value = employee.employeeName;
        document.getElementById("category").value = employee.departmentName;
        document.getElementById("activity").value = employee.activity;
    }
}


function ChangeEnabled() {
    var selected = document.getElementById("function").value;
    switch (selected) {
        case "Create":
            enableCreate();
            break;
        case "Update":
            enableUpdate();
            break;
        case "Delete":
            enableDelete();
            break;
        default:
            disableAll();
            break;
    }
}

function enableCreate() {
    if (document.title === "Departments") {
        document.getElementById("updateText").hidden = true;
        document.getElementById("input1").hidden = true;
        document.getElementById("input2").hidden = false;
        document.getElementById("input3").hidden = false;
        document.getElementById("input4").hidden = false;
        document.getElementById("btn1").hidden = false;
    }
    else if (document.title === "Employees") {
        document.getElementById("updateText").hidden = true;
        document.getElementById("input1").hidden = true;
        document.getElementById("input2").hidden = false;
        document.getElementById("input3").hidden = false;
        document.getElementById("input4").hidden = false;
        document.getElementById("btn1").hidden = false;
    }
}

function enableUpdate() {
    if (document.title === "Departments") {
        document.getElementById("updateText").hidden = false;
        document.getElementById("updateText").innerText = "Click a row to update the information";
        document.getElementById("input1").hidden = false;
        document.getElementById("input2").hidden = false;
        document.getElementById("input3").hidden = false;
        document.getElementById("input4").hidden = false;
        document.getElementById("btn1").hidden = false;
    }
    else if (document.title === "Employees") {
        document.getElementById("updateText").hidden = false;
        document.getElementById("updateText").innerText = "Click a row to update the information";
        document.getElementById("input1").hidden = false;
        document.getElementById("input2").hidden = false;
        document.getElementById("input3").hidden = false;
        document.getElementById("input4").hidden = false;
        document.getElementById("btn1").hidden = false;
    }
}

function enableDelete() {
    if (document.title === "Departments") {
        document.getElementById("updateText").hidden = false;
        document.getElementById("updateText").innerText = "Click a row and press the button to delete the department";
        document.getElementById("input1").hidden = false;
        document.getElementById("input2").hidden = true;
        document.getElementById("input3").hidden = true;
        document.getElementById("input4").hidden = true;
        document.getElementById("btn1").hidden = false;
    }
    else if (document.title === "Employees") {
        document.getElementById("updateText").hidden = false;
        document.getElementById("updateText").innerText = "Click a row and press the button to delete the employee";
        document.getElementById("input1").hidden = false;
        document.getElementById("input2").hidden = true;
        document.getElementById("input3").hidden = true;
        document.getElementById("input4").hidden = true;
        document.getElementById("btn1").hidden = false;
    }
}

function disableAll() {
    if (document.title === "Departments") {
        document.getElementById("updateText").hidden = true;
        document.getElementById("input1").hidden = true;
        document.getElementById("input2").hidden = true;
        document.getElementById("input3").hidden = true;
        document.getElementById("input4").hidden = true;
        document.getElementById("btn1").hidden = true;
    }
    else if (document.title === "Employees") {
        document.getElementById("updateText").hidden = true;
        document.getElementById("input1").hidden = true;
        document.getElementById("input2").hidden = true;
        document.getElementById("input3").hidden = true;
        document.getElementById("input4").hidden = true;
        document.getElementById("btn1").hidden = true;
    }
}

function checkCases(string) {
    let temp = string.trim().split(" ");
    let result = "";
    temp.forEach(word => {
        result += word[0].toUpperCase() + word.substring(1).toLowerCase() + " ";
    });
    return result.trim();
}