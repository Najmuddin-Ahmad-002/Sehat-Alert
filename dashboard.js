// Smart Community Health Monitoring Dashboard JS
// Loads reports, handles delete, and triggers alerts for water-borne symptoms

function loadReports() {
  const reports = JSON.parse(localStorage.getItem('reports') || '[]');
  const tbody = document.getElementById('reports-table-body');
  tbody.innerHTML = '';
  reports.forEach((r, idx) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${r.name}</td><td>${r.village}</td><td>${r.symptoms}</td><td><button class="btn btn-danger btn-sm" onclick="deleteReport(${idx})">Delete</button></td>`;
    tbody.appendChild(tr);
  });
}

function deleteReport(idx) {
  let reports = JSON.parse(localStorage.getItem('reports') || '[]');
  reports.splice(idx, 1);
  localStorage.setItem('reports', JSON.stringify(reports));
  loadReports();
  loadAlerts();
}

// Water-borne disease keywords
const waterBorneKeywords = /diarrhea|cholera|typhoid|dysentery|vomiting|fever|contaminated|water|loose motion/i;

function loadAlerts() {
  const reports = JSON.parse(localStorage.getItem('reports') || '[]');
  const alerts = [];
  // Water-borne alerts
  reports.forEach(r => {
    if (waterBorneKeywords.test(r.symptoms)) {
      alerts.push(`Alert: ${r.name} from ${r.village} reported symptoms: ${r.symptoms}`);
    }
  });
  // Village cluster alert
  const villageCounts = {};
  reports.forEach(r => {
    villageCounts[r.village] = (villageCounts[r.village] || 0) + 1;
  });
  Object.entries(villageCounts).forEach(([village, count]) => {
    if (count > 4) {
      alerts.push(`🚨 <b>Emergency:</b> Multiple health reports detected from <b>${village}</b>. Immediate action recommended!`);
    }
  });
  const alertsList = document.getElementById('alerts-list');
  const noAlertsMsg = document.getElementById('no-alerts-msg');
  alertsList.innerHTML = '';
  if (alerts.length > 0) {
    alerts.forEach(a => {
      const li = document.createElement('li');
      li.innerHTML = `<strong>${a}</strong>`;
      alertsList.appendChild(li);
    });
    noAlertsMsg.style.display = 'none';
  } else {
    noAlertsMsg.style.display = 'block';
  }
}

window.onload = function() {
  loadReports();
  loadAlerts();
};
// Expose deleteReport globally
window.deleteReport = deleteReport;
