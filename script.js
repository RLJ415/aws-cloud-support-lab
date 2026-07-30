const searchBox = document.getElementById("searchBox");
const clearSearch = document.getElementById("clearSearch");
const sortService = document.getElementById("sortService");

const showAll = document.getElementById("showAll");
const showOpen = document.getElementById("showOpen");
const showResolved = document.getElementById("showResolved");
const showInvestigating = document.getElementById("showInvestigating");

let ascending = true;
const incidents = [
    {
        id: "INC-1001",
        service: "Amazon S3",
        severity: "High",
        priority: "P1",
        status: "Open",
        lastUpdated: "July 29, 2026 - 8:30 PM",
        description: "Customers are receiving Access Denied errors when attempting to retrieve objects."
    },
    {
        id: "INC-1002",
        service: "Amazon EC2",
        severity: "Medium",
        priority: "P2",
        status: "Investigating",
        lastUpdated: "July 29, 2026 - 8:35 PM",
        description: "Multiple customers are reporting failed SSH connections after a security group update."
    },
    {
        id: "INC-1003",
        service: "Amazon RDS",
        severity: "Low",
        priority: "P3",
        status: "Resolved",
        lastUpdated: "July 29, 2026 - 8:15 PM",
        description: "Database connectivity issue has been resolved after restarting the primary instance."
    },
    {
        id: "INC-1004",
        service: "Amazon CloudFront",
        severity: "Critical",
        priority: "P1",
        status: "Open",
        lastUpdated: "July 29, 2026 - 8:45 PM",
        description: "Global content delivery latency has increased across multiple edge locations."
    },
    {
        id: "INC-1005",
        service: "AWS IAM",
        severity: "High",
        priority: "P2",
        status: "Resolved",
        lastUpdated: "July 29, 2026 - 8:20 PM",
        description: "IAM policy changes have been completed and verified."
    }
];

const incidentTable = document.getElementById("incidentTable");

function updateAnalytics() {

    document.getElementById("totalIncidents").textContent = incidents.length;

    document.getElementById("openIncidents").textContent =
        incidents.filter(incident => incident.status === "Open").length;

    document.getElementById("resolvedIncidents").textContent =
        incidents.filter(incident => incident.status === "Resolved").length;

    document.getElementById("investigatingIncidents").textContent =
        incidents.filter(incident => incident.status === "Investigating").length;

}

function renderIncidents() {

    incidentTable.innerHTML = "";

    incidents.forEach(function (incident) {

        incidentTable.innerHTML += `
            <tr data-id="${incident.id}">
                <td class="incident-id">${incident.id}</td>
                <td>${incident.service}</td>
                <td class="${incident.severity.toLowerCase()}">
                    ${incident.severity}
                </td>
                <td>
                    <span class="status ${incident.status.toLowerCase()}">
                        ${incident.status}
                    </span>
                </td>
            </tr>
        `;

    });

    document.querySelectorAll("#incidentTable tr").forEach(function (row) {

        row.addEventListener("click", function () {

            const id = row.dataset.id;

            const incident = incidents.find(function (item) {
                return item.id === id;
            });

            document.getElementById("incidentDetails").innerHTML = `

    <h2>Incident Details</h2>

    <p><strong>ID:</strong> ${incident.id}</p>

    <p><strong>Service:</strong> ${incident.service}</p>

    <p><strong>Severity:</strong> ${incident.severity}</p>

    <p>
        <strong>Priority:</strong>

        <span class="priority ${incident.priority.toLowerCase()}">
            ${incident.priority}
        </span>
    </p>

    <p><strong>Status:</strong> ${incident.status}</p>

    <p><strong>Last Updated:</strong> ${incident.lastUpdated}</p>

    <p><strong>Description:</strong> ${incident.description}</p>

   <select id="statusSelect">

    <option value="Open" ${incident.status === "Open" ? "selected" : ""}>
        Open
    </option>

    <option value="Investigating" ${incident.status === "Investigating" ? "selected" : ""}>
        Investigating
    </option>

    <option value="Resolved" ${incident.status === "Resolved" ? "selected" : ""}>
        Resolved
    </option>

</select>

<button id="updateStatusBtn">
    Update Status
</button>

`;

const updateStatusBtn = document.getElementById("updateStatusBtn");

const statusSelect = document.getElementById("statusSelect");

updateStatusBtn.onclick = function () {

    incident.status = statusSelect.value;

    incident.lastUpdated = new Date().toLocaleString();

    renderIncidents();

    updateAnalytics();

    document.querySelector(`[data-id="${incident.id}"]`).click();

};

        });

    });

}

renderIncidents();
updateAnalytics();

searchBox.addEventListener("keyup", function () {

    const searchText = searchBox.value.toLowerCase();

    const rows = document.querySelectorAll("#incidentTable tr");

    rows.forEach(function (row) {

        if (row.textContent.toLowerCase().includes(searchText)) {
            row.style.display = "";
        } else {
            row.style.display = "none";
        }

    });

});

clearSearch.addEventListener("click", function () {

    searchBox.value = "";

    const rows = document.querySelectorAll("#incidentTable tr");

    rows.forEach(function (row) {
        row.style.display = "";
    });

});

sortService.addEventListener("click", function () {

    incidents.sort(function (a, b) {

        if (ascending) {
            return a.service.localeCompare(b.service);
        } else {
            return b.service.localeCompare(a.service);
        }

    });

    ascending = !ascending;

    renderIncidents();

});

showAll.addEventListener("click", function () {

    document.querySelectorAll("#incidentTable tr").forEach(function (row) {
        row.style.display = "";
    });

});

showOpen.addEventListener("click", function () {

    document.querySelectorAll("#incidentTable tr").forEach(function (row) {

        row.style.display =
            row.textContent.includes("Open") ? "" : "none";

    });

});

showResolved.addEventListener("click", function () {

    document.querySelectorAll("#incidentTable tr").forEach(function (row) {

        row.style.display =
            row.textContent.includes("Resolved") ? "" : "none";

    });

});

showInvestigating.addEventListener("click", function () {

    document.querySelectorAll("#incidentTable tr").forEach(function (row) {

        row.style.display =
            row.textContent.includes("Investigating") ? "" : "none";

    });

});