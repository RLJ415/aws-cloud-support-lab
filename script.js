const searchBox = document.getElementById("searchBox");

const serviceFilter = document.getElementById("serviceFilter"); const clearSearch = document.getElementById("clearSearch");
const sortService = document.getElementById("sortService");

const showAll = document.getElementById("showAll");
const showOpen = document.getElementById("showOpen");
const showResolved = document.getElementById("showResolved");
const showInvestigating = document.getElementById("showInvestigating");
const serviceInput = document.getElementById("serviceInput");

const severityInput = document.getElementById("severityInput");

const addIncidentBtn = document.getElementById("addIncidentBtn");

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

let nextIncidentNumber = Math.max(
    ...incidents.map(function (incident) {
        return Number(incident.id.replace("INC-", ""));
    })
) + 1;

const incidentTable = document.getElementById("incidentTable");

const activityLog = document.getElementById("activityLog");

const serviceStats = document.getElementById("serviceStats");

function addActivity(message) {

    const now = new Date().toLocaleTimeString();

    const activity = `

        <div class="activity-item">

            <strong>${now}</strong>

            <br>

            ${message}

        </div>

    `;

    if (activityLog.innerHTML.includes("No activity yet.")) {

        activityLog.innerHTML = activity;

    } else {

        activityLog.innerHTML = activity + activityLog.innerHTML;

    }

}

function populateServiceFilter() {

    const services = [...new Set(incidents.map(i => i.service))];

    serviceFilter.innerHTML =
        `<option value="All">All Services</option>`;

    services.sort().forEach(function (service) {

        serviceFilter.innerHTML +=
            `<option value="${service}">${service}</option>`;

    });

}

let currentStatusFilter = "All";

function applyFilters() {

    const rows = document.querySelectorAll("#incidentTable tr");

    let visibleCount = 0;

    rows.forEach(function (row) {

        const text = row.textContent.toLowerCase();

        const matchesSearch =
            text.includes(searchBox.value.toLowerCase());

        const matchesService =
            serviceFilter.value === "All" ||
            text.includes(serviceFilter.value.toLowerCase());

        const matchesStatus =
            currentStatusFilter === "All" ||
            text.includes(currentStatusFilter.toLowerCase());

        const visible =
            matchesSearch &&
            matchesService &&
            matchesStatus;

        row.style.display = visible ? "" : "none";

        if (visible) {

            visibleCount++;

        }

    });

    document.getElementById("resultsCount").textContent =
        `Showing ${visibleCount} of ${incidents.length} incidents`;

    document.getElementById("noResults").style.display =
        visibleCount === 0 ? "block" : "none";

}

function updateServiceStats() {

    const totals = {};

    incidents.forEach(function (incident) {

        totals[incident.service] =
            (totals[incident.service] || 0) + 1;

    });

    serviceStats.innerHTML = "<h3>Incidents by Service</h3>";

    for (const service in totals) {

        serviceStats.innerHTML += `

            <p>${service}: <strong>${totals[service]}</strong></p>

        `;

    }

}

function updateAnalytics() {

    document.getElementById("totalIncidents").textContent = incidents.length;

    document.getElementById("openIncidents").textContent =
        incidents.filter(incident => incident.status === "Open").length;

    document.getElementById("resolvedIncidents").textContent =
        incidents.filter(incident => incident.status === "Resolved").length;

    document.getElementById("investigatingIncidents").textContent =
        incidents.filter(incident => incident.status === "Investigating").length;

    populateServiceFilter();

    updateServiceStats();

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

<p>

    <strong>Last Updated:</strong>

    <span class="last-updated">

        ${incident.lastUpdated}

    </span>

</p>

<p><strong>Description:</strong> ${incident.description}</p>   <select id="statusSelect">

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

<button id="deleteIncidentBtn">
    Delete Incident
</button>

`;

            const updateStatusBtn = document.getElementById("updateStatusBtn");

            const deleteIncidentBtn = document.getElementById("deleteIncidentBtn");

            const statusSelect = document.getElementById("statusSelect");
            updateStatusBtn.onclick = function () {

                incident.status = statusSelect.value;

                incident.lastUpdated = new Date().toLocaleString();

                addActivity(
                    `${incident.id} status changed to <strong>${incident.status}</strong>`
                );

                renderIncidents();

                updateAnalytics();

                document.querySelector(`[data-id="${incident.id}"]`).click();
            };

            deleteIncidentBtn.onclick = function () {

                const confirmed = confirm(
                    `Delete ${incident.id}? This action cannot be undone.`
                );

                if (!confirmed) {

                    return;

                }

                const index = incidents.findIndex(function (item) {
                    return item.id === incident.id;
                });

                incidents.splice(index, 1);

                addActivity(
                    `${incident.id} was <strong>deleted</strong>`
                );

                renderIncidents();

                updateAnalytics();

                document.getElementById("incidentDetails").innerHTML = `

        <h2>Incident Details</h2>

        <p>Select an incident to view details.</p>

    `;

            };

        });

    });

}

renderIncidents();
updateAnalytics();

searchBox.addEventListener("keyup", applyFilters);
clearSearch.addEventListener("click", function () {

    searchBox.value = "";

    applyFilters();

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

    currentStatusFilter = "All";

    applyFilters();

});

showOpen.addEventListener("click", function () {

    currentStatusFilter = "Open";

    applyFilters();

});

showResolved.addEventListener("click", function () {

    currentStatusFilter = "Resolved";

    applyFilters();

});
showInvestigating.addEventListener("click", function () {

    currentStatusFilter = "Investigating";

    applyFilters();

});
addIncidentBtn.onclick = function () {

    const serviceName = serviceInput.value.trim();

    if (serviceName === "") {

        alert("Please enter an AWS service.");

        serviceInput.focus();

        return;

    }

    const newIncident = {

        id: "INC-" + nextIncidentNumber++,

        service: serviceName,

        severity: severityInput.value,

        priority: severityInput.value === "Critical"
            ? "P1"
            : severityInput.value === "High"
                ? "P2"
                : "P3",

        status: "Open",

        lastUpdated: new Date().toLocaleString(),

        description: "New incident created."

    };

    incidents.unshift(newIncident);

    addActivity(
        `${newIncident.id} was created for <strong>${newIncident.service}</strong>`
    );

        renderIncidents();
    updateAnalytics();

    serviceInput.value = "";

    severityInput.value = "Low";

    serviceInput.focus();

};

serviceFilter.addEventListener("change", applyFilters);