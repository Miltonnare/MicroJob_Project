import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { MapPin, Phone, Star, ShieldCheck } from 'lucide-react';

// Fix leaflet icon default issues
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

interface MapWorker {
  id: string;
  fullName: string;
  phone: string;
  dailyRate: number;
  trustScore: number;
  latitude: number;
  longitude: number;
  skills: string[];
  travelRadiusKm?: number;
}

interface WorkerMapProps {
  workers: MapWorker[];
  center?: [number, number];
  zoom?: number;
}

export const WorkerMap: React.FC<WorkerMapProps> = ({
  workers,
  center = [-0.0917, 34.7680], // Default Kisumu / Nairobi center
  zoom = 11,
}) => {
  return (
    <div className="w-full h-[450px] rounded-2xl overflow-hidden border border-slate-800 shadow-2xl relative">
      <MapContainer center={center} zoom={zoom} scrollWheelZoom={false} className="w-full h-full">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {workers.map((worker) => (
          <React.Fragment key={worker.id}>
            <Marker position={[worker.latitude, worker.longitude]}>
              <Popup className="custom-popup">
                <div className="p-1 space-y-2 text-slate-900 font-sans">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm">{worker.fullName}</span>
                    {worker.trustScore >= 90 && (
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3 text-emerald-600" /> Verified
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-slate-600">
                    Daily Rate: <span className="font-bold text-amber-600">KES {worker.dailyRate.toLocaleString()}</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {worker.skills.map((s, idx) => (
                      <span key={idx} className="bg-slate-100 text-slate-700 text-[10px] px-1.5 py-0.5 rounded">
                        {s}
                      </span>
                    ))}
                  </div>
                  <div className="text-[11px] text-slate-500 flex items-center gap-1">
                    <Phone className="w-3 h-3" /> {worker.phone}
                  </div>
                </div>
              </Popup>
            </Marker>
            {worker.travelRadiusKm && (
              <Circle
                center={[worker.latitude, worker.longitude]}
                radius={worker.travelRadiusKm * 1000}
                pathOptions={{ color: '#f59e0b', fillColor: '#f59e0b', fillOpacity: 0.1 }}
              />
            )}
          </React.Fragment>
        ))}
      </MapContainer>
    </div>
  );
};
