const incidents = [
    {
        id: "INC-001",
        service: "Amazon S3",
        severity: "High",
        status: "Resolved"
    },
    {
        id: "INC-002",
        service: "Amazon EC2",
        severity: "Medium",
        status: "Investigating"
    },
    {
        id: "INC-003",
        service: "IAM",
        severity: "Low",
        status: "Open"
    }
];

const incidentTable = document.getElementById("incidentTable");

incidents.forEach(function (incident) {

    incidentTable.innerHTML += `
        <tr>
            <td class="incident-id">${incident.id}</td>
            <td>${incident.service}</td>
            <td>${incident.severity}</td>
            <td>${incident.status}</td>
        </tr>
    `;

});