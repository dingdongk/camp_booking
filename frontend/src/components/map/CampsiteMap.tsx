import { CircleMarker, MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import L from 'leaflet'
import iconUrl from 'leaflet/dist/images/marker-icon.png'
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png'
import shadowUrl from 'leaflet/dist/images/marker-shadow.png'
import type { MapPoint } from '../../types/models'

// Leaflet's default marker images are not found by bundlers unless set explicitly.
const pin = L.icon({ iconUrl, iconRetinaUrl, shadowUrl, iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34] })

const COLORS: Record<MapPoint['kind'], string> = { v: '#17703F', p: '#8F4F12', u: '#6B7A72' }

function Tiles() {
  return <TileLayer url="https://tile.openstreetmap.org/{z}/{x}/{y}.png" maxZoom={18} attribution="© OpenStreetMap contributors" />
}

/** Single campsite pin (campsite detail page). */
export function SiteMap({ lat, lng, zoom, name, addr }: { lat: number; lng: number; zoom: number; name: string; addr: string }) {
  return (
    <MapContainer key={`${lat},${lng}`} className="lmap" center={[lat, lng]} zoom={zoom} scrollWheelZoom>
      <Tiles />
      <Marker position={[lat, lng]} icon={pin}>
        <Popup><b>{name}</b><br />{addr}</Popup>
      </Marker>
    </MapContainer>
  )
}

/** Discovery map with coloured markers (map page). */
export function DiscoveryMap({ points, selected, onSelect }: { points: MapPoint[]; selected: string | null; onSelect: (id: string) => void }) {
  return (
    <MapContainer className="lmap tall" center={[16.2, 107.0]} zoom={5} scrollWheelZoom>
      <Tiles />
      {points.map((p) => (
        <CircleMarker
          key={p.id}
          center={[p.lat, p.lng]}
          radius={selected === p.id ? 11 : 8}
          pathOptions={{ color: '#FFFDF8', weight: 2, fillColor: COLORS[p.kind], fillOpacity: 1 }}
          eventHandlers={{ click: () => onSelect(p.id) }}
        >
          <Popup><b>{p.name}</b><br />{p.addr}<br />{p.info}</Popup>
        </CircleMarker>
      ))}
    </MapContainer>
  )
}
