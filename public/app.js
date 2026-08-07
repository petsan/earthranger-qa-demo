// 🌍 Map Initialization with Zoom 16
const map = L.map('map').setView([47.6556, -122.4103], 16);
window.__map = map;

// 🗺️ Map Layers (Street & Satellite)
const streetLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
});

const satelliteLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
  attribution: '© Esri & NASA'
});

// Set default layer
streetLayer.addTo(map);

// Add layer control
const baseMaps = {
  "Street Map": streetLayer,
  "Satellite View": satelliteLayer
};
L.control.layers(baseMaps).addTo(map);

// 🛡️ Custom Fence Area (Rectangle around POIs)
const fenceBounds = [
  [47.6580, -122.4150], // NW
  [47.6530, -122.4050]  // SE
];
const fenceArea = L.rectangle(fenceBounds, {
  color: '#4CAF50',
  weight: 2,
  fillColor: '#4CAF50',
  fillOpacity: 0.1,
  dashArray: '5, 5'
}).addTo(map);

let markers = {};
let tracks = {};
const logContainer = document.getElementById('log-container');
const MAX_LOG_ENTRIES = 60;
let currentDetections = [];

// 🆕 Modal Elements
const modal = document.getElementById('detection-modal');
const modalTitle = document.getElementById('modal-title');
const modalId = document.getElementById('modal-id');
const modalName = document.getElementById('modal-name');
const modalType = document.getElementById('modal-type');
const modalStatus = document.getElementById('modal-status');
const modalCoords = document.getElementById('modal-coords');
const modalTrackList = document.getElementById('modal-track-list');
const focusBtn = document.getElementById('focus-map-btn');
const closeBtn = document.querySelector('.close-modal');
const overlay = document.querySelector('.modal-overlay');

// 🆕 Custom Icon Helper
function getMarkerIcon(type, status, isOutOfBounds = false) {
  const color = isOutOfBounds ? '#ff0000' : (status === 'triggered' ? '#ff6b6b' : '#66bb6a');
  let svg = '';
  if (type === 'patrol_vehicle') {
    svg = `<svg viewBox="0 0 24 24" fill="${color}"><path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/></svg>`;
  } else if (type === 'camera_trap') {
    svg = `<svg viewBox="0 0 24 24" fill="${color}"><path d="M9 2L7.17 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2h-3.17L15 2H9zm3 15c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z"/></svg>`;
  } else {
    svg = `<svg viewBox="0 0 24 24" fill="${color}"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"/></svg>`;
  }
  return L.divIcon({
    className: 'custom-icon',
    html: `<div style="width:36px;height:36px;background:#1e222b;border-radius:50%;display:flex;align-items:center;justify-content:center;border:2px solid ${color};box-shadow:0 2px 8px rgba(0,0,0,0.4);">${svg}</div>`,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -25]
  });
}

function addLogEntry(det, timestamp, isOutOfBounds = false) {
  const entry = document.createElement('div');
  entry.className = 'log-entry';
  entry.dataset.detId = det.id;
  const statusColor = isOutOfBounds ? '#ff0000' : (det.status === 'triggered' ? '#ff6b6b' : '#4CAF50');
  entry.innerHTML = `
    <div class="meta">${new Date(timestamp).toLocaleTimeString()} • ${det.id}</div>
    <strong>${det.name}</strong> <span style="color:#8b92a3">(${det.type})</span><br>
    <span style="color:${statusColor}">● ${isOutOfBounds ? '⚠️ OUT OF BOUNDS' : det.status.toUpperCase()}</span>
    <span class="coords">Lat: ${det.coordinates.lat.toFixed(5)}, Lng: ${det.coordinates.lng.toFixed(5)}</span>
  `;
  logContainer.prepend(entry);
  while (logContainer.children.length > MAX_LOG_ENTRIES) {
    logContainer.removeChild(logContainer.lastChild);
  }
}

function openModal(detId) {
  const det = currentDetections.find(d => d.id === detId);
  if (!det) return;

  modalTitle.textContent = det.name;
  modalId.textContent = det.id;
  modalName.textContent = det.name;
  modalType.textContent = det.type.replace('_', ' ').toUpperCase();
  modalStatus.textContent = det.status.toUpperCase();
  modalStatus.style.color = det.status === 'triggered' ? '#ff6b6b' : '#66bb6a';
  modalCoords.textContent = `${det.coordinates.lat.toFixed(5)}, ${det.coordinates.lng.toFixed(5)}`;

  modalTrackList.innerHTML = '';
  const trackData = det.track.length > 0 ? det.track : [{ lat: det.coordinates.lat, lng: det.coordinates.lng, ts: Date.now() }];
  trackData.forEach(point => {
    const li = document.createElement('li');
    li.textContent = `${new Date(point.ts).toLocaleTimeString()} → Lat: ${point.lat.toFixed(5)}, Lng: ${point.lng.toFixed(5)}`;
    modalTrackList.appendChild(li);
  });

  focusBtn.onclick = () => {
    map.panTo([det.coordinates.lat, det.coordinates.lng], 16, { animate: true });
    modal.classList.add('hidden');
  };

  modal.classList.remove('hidden');
}

function closeModal() {
  modal.classList.add('hidden');
}

closeBtn.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);
logContainer.addEventListener('click', (e) => {
  const entry = e.target.closest('.log-entry');
  if (entry) openModal(entry.dataset.detId);
});

async function updateDetections() {
  try {
    const res = await fetch('/api/detections');
    const data = await res.json();
    currentDetections = data.detections;

    Object.values(markers).forEach(m => map.removeLayer(m));
    Object.values(tracks).forEach(t => map.removeLayer(t));
    markers = {};
    tracks = {};

    data.detections.forEach(det => {
      // 🛡️ Check if POI is outside fence area
      const isOutOfBounds = !fenceArea.getBounds().contains(L.latLng(det.coordinates.lat, det.coordinates.lng));

      if (!det.is_stationary && det.track.length > 1) {
        const coords = det.track.map(p => [p.lat, p.lng]);
        tracks[det.id] = L.polyline(coords, { color: isOutOfBounds ? '#ff0000' : '#4CAF50', weight: 3 }).addTo(map);
      }
      
      const icon = getMarkerIcon(det.type, det.status, isOutOfBounds);
      markers[det.id] = L.marker([det.coordinates.lat, det.coordinates.lng], { icon })
        .addTo(map)
        .bindPopup(`<b>${det.name}</b><br>Type: ${det.type}<br>Status: ${isOutOfBounds ? '⚠️ OUT OF BOUNDS' : det.status}<br>Updated: ${new Date(data.timestamp).toLocaleTimeString()}`);
      
      addLogEntry(det, data.timestamp, isOutOfBounds);
    });
  } catch (err) {
    console.error('Detection update failed:', err);
  }
}

updateDetections();
setInterval(updateDetections, 2000);
setTimeout(() => map.invalidateSize(), 100);
