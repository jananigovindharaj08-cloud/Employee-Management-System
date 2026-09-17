const form = document.getElementById("employeeForm");
const table = document.getElementById("employeeTable");
const search = document.getElementById("search");
const message = document.getElementById("message");
const cancelBtn = document.getElementById("cancelBtn");

let employees = [];

function showMessage(text) {
    message.textContent = text;
    setTimeout(() => message.textContent = "", 3000);
}

async function loadEmployees() {
    const response = await fetch("/api/employees/");
    employees = await response.json();
    renderEmployees();
}

function renderEmployees() {
    const term = search.value.toLowerCase();
    const filtered = employees.filter(e =>
        e.name.toLowerCase().includes(term) ||
        e.email.toLowerCase().includes(term) ||
        e.department.toLowerCase().includes(term)
    );

    table.innerHTML = filtered.map(e => `
        <tr>
            <td>${e.id}</td>
            <td>${escapeHtml(e.name)}</td>
            <td>${escapeHtml(e.email)}</td>
            <td>${escapeHtml(e.department)}</td>
            <td>₹${Number(e.salary).toLocaleString("en-IN")}</td>
            <td>${e.joining_date}</td>
            <td>
                <button class="action-btn" onclick="editEmployee(${e.id})">Edit</button>
                <button class="action-btn" onclick="deleteEmployee(${e.id})">Delete</button>
            </td>
        </tr>
    `).join("");
}

function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, c => ({
        "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#039;"
    }[c]));
}

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const id = document.getElementById("employeeId").value;
    const data = {
        name: document.getElementById("name").value.trim(),
        email: document.getElementById("email").value.trim(),
        department: document.getElementById("department").value.trim(),
        salary: document.getElementById("salary").value,
        joining_date: document.getElementById("joiningDate").value
    };

    const url = id ? `/api/employees/${id}/` : "/api/employees/";
    const method = id ? "PUT" : "POST";

    const response = await fetch(url, {
        method,
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(data)
    });

    const result = await response.json();

    if (!response.ok) {
        showMessage(result.error || "Operation failed.");
        return;
    }

    showMessage(id ? "Employee updated successfully." : "Employee added successfully.");
    resetForm();
    loadEmployees();
});

window.editEmployee = function(id) {
    const e = employees.find(x => x.id === id);
    if (!e) return;

    document.getElementById("employeeId").value = e.id;
    document.getElementById("name").value = e.name;
    document.getElementById("email").value = e.email;
    document.getElementById("department").value = e.department;
    document.getElementById("salary").value = e.salary;
    document.getElementById("joiningDate").value = e.joining_date;

    document.getElementById("submitBtn").textContent = "Update Employee";
    cancelBtn.hidden = false;
};

window.deleteEmployee = async function(id) {
    if (!confirm("Delete this employee?")) return;

    const response = await fetch(`/api/employees/${id}/`, {method: "DELETE"});
    const result = await response.json();

    if (response.ok) {
        showMessage(result.message);
        loadEmployees();
    } else {
        showMessage(result.error || "Delete failed.");
    }
};

function resetForm() {
    form.reset();
    document.getElementById("employeeId").value = "";
    document.getElementById("submitBtn").textContent = "Add Employee";
    cancelBtn.hidden = true;
}

cancelBtn.addEventListener("click", resetForm);
search.addEventListener("input", renderEmployees);

loadEmployees();
