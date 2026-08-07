const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

const ZONE_BOUNDS = { lat: [47.6506, 47.6606], lng: [-122.4178, -122.4028] };

const detections = [
  { id: 'DET-001', type: 'patrol_vehicle', name: 'Ranger Unit Alpha', lat: 47.6556, lng: -122.4133, status: 'active', is_stationary: false, track: [] },
  { id: 'DET-002', type: 'camera_trap', name: 'Camera Trap Beta', lat: 47.6576, lng: -122.4083, status: 'active', is_stationary: true, track: [] },
  { id: 'DET-003', type: 'animal_tracker', name: 'Elephant Collar Gamma', lat: 47.6546, lng: -122.4113, status: 'active', is_stationary: false, track: [] }
];

setInterval(() => {
  detections.forEach(det => {
    if (!det.is_stationary) {
      det.lat += (Math.random() - 0.5) * 0.0008;
      det.lng += (Math.random() - 0.5) * 0.0008;
      det.lat = Math.max(ZONE_BOUNDS.lat[0], Math.min(ZONE_BOUNDS.lat[1], det.lat));
      det.lng = Math.max(ZONE_BOUNDS.lng[0], Math.min(ZONE_BOUNDS.lng[1], det.lng));
      det.track.push({ lat: det.lat, lng: det.lng, ts: Date.now() });
      if (det.track.length > 25) det.track.shift();
    } else {
      det.status = Math.random() > 0.6 ? 'triggered' : 'standby';
    }
  });
}, 2000);

app.get('/health', (req, res) => res.json({ status: 'ok', uptime: process.uptime() }));

app.get('/api/detections', (req, res) => {
  res.json({
    timestamp: Date.now(),
    zone: 'discovery_park', // 👈 Updated zone name
    detections: detections.map(d => ({
      id: d.id, type: d.type, name: d.name,
      coordinates: { lat: d.lat, lng: d.lng },
      status: d.status, is_stationary: d.is_stationary, track: d.track
    }))
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🌲 Discovery Park Conservation Tracker running on http://localhost:${PORT}`));
