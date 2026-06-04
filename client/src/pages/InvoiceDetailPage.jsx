import React, { useMemo, useState } from 'react'
import KPI from '../components/KPI'
import StatusBadge from '../components/StatusBadge'
import Pagination from '../components/Pagination'

// Page: Facturation Détaillée
// Design system: Light mode, large white space, subtle shadows, pastel KPI cards

const sampleInvoices = Array.from({ length: 34 }).map((_, i) => ({
  id: `INV-${1000 + i}`,
  client: ['Acme Corp', 'Beta LLC', 'Gamma SA'][i % 3],
  amount: (Math.round((Math.random() * 900 + 100) * 100) / 100).toFixed(2),
  due: new Date(Date.now() + (i - 10) * 24 * 60 * 60 * 1000),
  status: ['Paid', 'Pending', 'Overdue'][i % 3],
  growth: `${(Math.round((Math.random() * 25) + 1)).toString()}%`,
}))

export default function InvoiceDetailPage() {
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(10)

  const filtered = useMemo(() => {
    return sampleInvoices.filter(inv => {
      if (statusFilter !== 'All' && inv.status !== statusFilter) return false
      if (query && !(`${inv.id} ${inv.client} ${inv.amount}`).toLowerCase().includes(query.toLowerCase())) return false
      if (dateFrom) {
        const from = new Date(dateFrom)
        if (inv.due < from) return false
      }
      if (dateTo) {
        const to = new Date(dateTo)
        // include the whole day
        to.setHours(23,59,59,999)
        if (inv.due > to) return false
      }
      return true
    })
  }, [query, statusFilter])

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage))
  const pageItems = filtered.slice((page - 1) * perPage, page * perPage)

  function exportCsv() {
    const rows = [
      ['ID', 'Client', 'Montant', 'Date d\'échéance', 'Statut']
    ]
    filtered.forEach(i => rows.push([i.id, i.client, i.amount, i.due.toLocaleDateString(), i.status]))
    const csvContent = rows.map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `invoices_export_${new Date().toISOString().slice(0,10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-white text-slate-900 p-8">
      <header className="max-w-7xl mx-auto mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="text-2xl font-bold">Kollab</div>
            <div className="text-sm text-gray-500">/ Facturation</div>
          </div>
          <div className="flex items-center gap-3">
            <input
              aria-label="Recherche factures"
              placeholder="Rechercher par ID, client, montant..."
              value={query}
              onChange={e => { setQuery(e.target.value); setPage(1) }}
              className="w-80 px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-200"
            />
            <button className="px-3 py-2 rounded-lg text-sm text-sky-700 bg-sky-50">Filtres</button>
            <button onClick={exportCsv} className="px-3 py-2 rounded-lg text-sm border border-slate-200 text-gray-700">Exporter</button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto space-y-6">
        <section className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <KPI title="Total factures" value={`${sampleInvoices.length}`} subtitle="Croissance: +12%" color="blue" />
          <KPI title="Montant total" value={`€ ${sampleInvoices.reduce((s, i) => s + parseFloat(i.amount), 0).toFixed(2)}`} subtitle="Heures facturées: 142h" color="green" />
          <KPI title="En retard" value={`${sampleInvoices.filter(i=>i.status==='Overdue').length}`} subtitle="Alerte: relancer" color="red" />
          <KPI title="En attente" value={`${sampleInvoices.filter(i=>i.status==='Pending').length}`} subtitle="Factures à valider" color="orange" />
        </section>

        <section className="bg-white rounded-2xl p-4 shadow-sm" style={{ borderRadius: 16 }}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <label className="text-sm text-gray-600">Statut</label>
              <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1) }} className="text-sm px-3 py-2 border border-gray-200 rounded-lg bg-white">
                <option>All</option>
                <option>Paid</option>
                <option>Pending</option>
                <option>Overdue</option>
              </select>
              <label className="text-sm text-gray-600">De</label>
              <input type="date" value={dateFrom} onChange={e => { setDateFrom(e.target.value); setPage(1) }} className="text-sm px-3 py-2 border border-gray-200 rounded-lg bg-white" />
              <label className="text-sm text-gray-600">À</label>
              <input type="date" value={dateTo} onChange={e => { setDateTo(e.target.value); setPage(1) }} className="text-sm px-3 py-2 border border-gray-200 rounded-lg bg-white" />
              <label className="text-sm text-gray-600">/ page</label>
              <select value={perPage} onChange={e => { setPerPage(Number(e.target.value)); setPage(1) }} className="text-sm px-3 py-2 border border-gray-200 rounded-lg bg-white">
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
              </select>
            </div>
            <div className="text-sm text-gray-500">Résultats: {filtered.length}</div>
          </div>

          <div className="table-light">
            <table className="min-w-full divide-y" style={{ borderCollapse: 'separate', borderSpacing: 0 }}>
              <thead className="bg-white">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Facture</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Client</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Montant</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Date d'échéance</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Statut</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {pageItems.map(inv => (
                  <tr key={inv.id} className="bg-white">
                    <td className="px-4 py-4 text-sm text-gray-800">{inv.id}<div className="text-xs text-gray-400">Croissance: {inv.growth}</div></td>
                    <td className="px-4 py-4 text-sm text-gray-700">{inv.client}</td>
                    <td className="px-4 py-4 text-sm font-medium text-gray-900">€ {inv.amount}</td>
                    <td className="px-4 py-4 text-sm text-gray-600">{inv.due.toLocaleDateString()}</td>
                    <td className="px-4 py-4 text-sm"> <StatusBadge status={inv.status} /> </td>
                    <td className="px-4 py-4 text-sm text-right">
                      <button className="inline-flex items-center text-sm text-sky-600">Voir <span className="ml-2">›</span></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <div className="text-sm text-gray-500">Affichage {((page-1)*perPage)+1} - {Math.min(page*perPage, filtered.length)} sur {filtered.length}</div>
            <Pagination
              page={page}
              totalPages={totalPages}
              onPrev={() => setPage(p => Math.max(1, p-1))}
              onNext={() => setPage(p => Math.min(totalPages, p+1))}
            />
          </div>
        </section>
      </main>
    </div>
  )
}
