const searchBox = document.getElementById("searchBox");
const clearSearch = document.getElementById("clearSearch");
const incidents = [
    {
        id: "INC-1001",
        service: "Amazon S3",
        severity: "High",
        status: "Open"
    },
    {
        id: "INC-1002",
        service: "Amazon EC2",
        severity: "Medium",
        status: "Investigating"
    },
    {
        id: "INC-1003",
        service: "Amazon RDS",
        severity: "Low",
        status: "Resolved"
    },
    {
        id: "INC-1004",
        service: "Amazon CloudFront",
        severity: "Critical",
        status: "Open"
    },
    {
        id: "INC-1005",
        service: "AWS IAM",
        severity: "High",
        status: "Resolved"
    }
];

const incidentTable = document.getElementById("incidentTable");

incidents.forEach(function (incident) {

    incidentTable.innerHTML += `
        <tr>
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

document.getElementById("totalIncidents").textContent = incidents.length;

document.getElementById("openIncidents").textContent =
    incidents.filter(incident => incident.status === "Open").length;

document.getElementById("resolvedIncidents").textContent =
    incidents.filter(incident => incident.status === "Resolved").length;

document.getElementById("investigatingIncidents").textContent =
    incidents.filter(incident => incident.status === "Investigating").length;

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