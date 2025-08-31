import React from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import iconUrl from 'leaflet/dist/images/marker-icon.png'
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png'
import shadowUrl from 'leaflet/dist/images/marker-shadow.png'

L.Icon.Default.mergeOptions({ iconUrl, iconRetinaUrl, shadowUrl })

const branches = [
    { id: 'tlv', name: 'Tel Aviv', pos: [32.0853, 34.7818] },
    { id: 'haifa', name: 'Haifa', pos: [32.7940, 34.9896] },
    { id: 'beer', name: 'Be’er Sheva', pos: [31.252973, 34.791462] },
    { id: 'jeru', name: 'Jerusalem', pos: [31.7683, 35.2137] }
]

function MapController({ center }) {
    const map = useMap()
    React.useEffect(() => { map.setView(center, 11) }, [center, map])
    return null
}

export function About() {
    const [center, setCenter] = React.useState(branches[0].pos)

    return (
        <section className="container" style={{ paddingTop: 18 }}>
            <h1 className="page-title" style={{ marginBottom: 12 }}>About</h1>

            <div className="row" style={{ gap: 12, marginBottom: 12, flexWrap: 'wrap' }}>
                {branches.map(b => (
                    <button key={b.id} className="btn" onClick={() => setCenter(b.pos)}>{b.name}</button>
                ))}
            </div>

            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <MapContainer center={center} zoom={11} scrollWheelZoom className="map">
                    <MapController center={center} />
                    <TileLayer
                        attribution='&copy; OpenStreetMap'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {branches.map(b => (
                        <Marker key={b.id} position={b.pos}>
                            <Popup>{b.name}</Popup>
                        </Marker>
                    ))}
                </MapContainer>
            </div>
        </section>
    )
}
