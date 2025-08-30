import React from 'react'
import { toyService } from '../services/toy.service.js'
import {
    ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
    PieChart, Pie, Cell, Legend,
    LineChart, Line
} from 'recharts'

const COLORS = ['#60a5fa', '#f59e0b', '#a78bfa', '#2dd4bf', '#f472b6', '#34d399', '#f87171', '#c084fc']

export function Dashboard() {
    const [toys, setToys] = React.useState([])
    const labels = React.useMemo(() => toyService.getLabels(), [])

    React.useEffect(() => {
        toyService.query().then(setToys)
    }, [])

    const pricePerLabel = labels.map((lbl, idx) => {
        const items = toys.filter(t => t.labels?.includes(lbl))
        const avg = items.length ? Math.round(items.reduce((s, t) => s + t.price, 0) / items.length) : 0
        return { label: lbl, avgPrice: avg, fill: COLORS[idx % COLORS.length] }
    })

    const inventoryByLabel = labels.map((lbl, idx) => {
        const items = toys.filter(t => t.labels?.includes(lbl))
        const inStock = items.filter(t => t.inStock).length
        const pct = items.length ? Math.round((inStock / items.length) * 100) : 0
        return { label: lbl, pct, fill: COLORS[idx % COLORS.length] }
    })

    const lineData = React.useMemo(() => {
        const now = new Date()
        const arr = []
        for (let i = 11; i >= 0; i--) {
            const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
            const month = d.toLocaleString('en', { month: 'short' })
            const val = Math.floor(50 + Math.random() * 150)
            arr.push({ month, value: val })
        }
        return arr
    }, [])

    return (
        <section className="container" style={{ paddingTop: 18 }}>
            <h1 className="page-title" style={{ marginBottom: 12 }}>Dashboard</h1>

            <div className="grid" style={{ gridTemplateColumns: '1fr', gap: 16 }}>
                <div className="card" style={{ padding: 16 }}>
                    <h3 style={{ marginTop: 0 }}>Average Price per Label</h3>
                    <div style={{ width: '100%', height: 320 }}>
                        <ResponsiveContainer>
                            <BarChart data={pricePerLabel}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="label" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="avgPrice">
                                    {pricePerLabel.map((e, i) => <Cell key={i} fill={e.fill} />)}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="card" style={{ padding: 16 }}>
                    <h3 style={{ marginTop: 0 }}>Inventory In-Stock by Label (%)</h3>
                    <div style={{ width: '100%', height: 320 }}>
                        <ResponsiveContainer>
                            <PieChart>
                                <Pie data={inventoryByLabel} dataKey="pct" nameKey="label" outerRadius={110} label>
                                    {inventoryByLabel.map((e, i) => <Cell key={i} fill={e.fill} />)}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="card" style={{ padding: 16 }}>
                    <h3 style={{ marginTop: 0 }}>Random Trend (last 12 months)</h3>
                    <div style={{ width: '100%', height: 320 }}>
                        <ResponsiveContainer>
                            <LineChart data={lineData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip />
                                <Line type="monotone" dataKey="value" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </section>
    )
}
