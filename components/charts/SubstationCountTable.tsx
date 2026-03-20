'use client'

import { useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'

interface SubstationEntry {
  region: string
  country: string
  count: number
  isRegionHeader: boolean
  indent: number
}

const substationData: SubstationEntry[] = [
  { region: 'North America', country: 'North America', count: 88200, isRegionHeader: true, indent: 0 },
  { region: 'North America', country: 'United States', count: 75000, isRegionHeader: false, indent: 1 },
  { region: 'North America', country: 'Canada', count: 13200, isRegionHeader: false, indent: 1 },
  { region: 'Europe', country: 'Europe', count: 3215503, isRegionHeader: true, indent: 0 },
  { region: 'Europe', country: 'Germany', count: 501800, isRegionHeader: false, indent: 1 },
  { region: 'Europe', country: 'United Kingdom', count: 340400, isRegionHeader: false, indent: 1 },
  { region: 'Europe', country: 'France', count: 740700, isRegionHeader: false, indent: 1 },
  { region: 'Europe', country: 'Italy', count: 450600, isRegionHeader: false, indent: 1 },
  { region: 'Europe', country: 'Spain', count: 220500, isRegionHeader: false, indent: 1 },
  { region: 'Europe', country: 'Russia', count: 474000, isRegionHeader: false, indent: 1 },
  { region: 'Europe', country: 'Rest of Europe', count: 487503, isRegionHeader: false, indent: 1 },
  { region: 'Asia Pacific', country: 'Asia Pacific', count: 781150, isRegionHeader: true, indent: 0 },
  { region: 'Asia Pacific', country: 'China', count: 195000, isRegionHeader: false, indent: 1 },
  { region: 'Asia Pacific', country: 'Japan', count: 172200, isRegionHeader: false, indent: 1 },
  { region: 'Asia Pacific', country: 'India', count: 58600, isRegionHeader: false, indent: 1 },
  { region: 'Asia Pacific', country: 'ASEAN', count: 98500, isRegionHeader: false, indent: 1 },
  { region: 'Asia Pacific', country: 'South Korea', count: 55800, isRegionHeader: false, indent: 1 },
  { region: 'Asia Pacific', country: 'Australia', count: 22900, isRegionHeader: false, indent: 1 },
  { region: 'Asia Pacific', country: 'Rest of Asia Pacific', count: 178150, isRegionHeader: false, indent: 1 },
  { region: 'Latin America', country: 'Latin America', count: 214900, isRegionHeader: true, indent: 0 },
  { region: 'Latin America', country: 'Brazil', count: 114500, isRegionHeader: false, indent: 1 },
  { region: 'Latin America', country: 'Mexico', count: 25900, isRegionHeader: false, indent: 1 },
  { region: 'Latin America', country: 'Argentina', count: 12400, isRegionHeader: false, indent: 1 },
  { region: 'Latin America', country: 'Rest of Latin America', count: 62100, isRegionHeader: false, indent: 1 },
  { region: 'Middle East & Africa', country: 'Middle East & Africa', count: 185035, isRegionHeader: true, indent: 0 },
  { region: 'Middle East & Africa', country: 'GCC', count: 87200, isRegionHeader: false, indent: 1 },
  { region: 'Middle East & Africa', country: 'South Africa', count: 4300, isRegionHeader: false, indent: 1 },
  { region: 'Middle East & Africa', country: 'Rest of ME&A', count: 93535, isRegionHeader: false, indent: 1 },
]

const regionColors: Record<string, string> = {
  'North America': '#184E77',
  'Europe': '#1A759F',
  'Asia Pacific': '#168AAD',
  'Middle East & Africa': '#34A0A4',
  'Latin America': '#52B69A',
}

const CHART_COLORS = ['#184E77', '#1A759F', '#168AAD', '#34A0A4', '#52B69A']

interface Props {
  title?: string
}

export default function SubstationCountTable({ title }: Props) {
  const [chartView, setChartView] = useState<'region' | 'country'>('region')

  const regionData = substationData
    .filter(d => d.isRegionHeader)
    .map(d => ({ name: d.country, count: d.count }))

  const countryData = substationData
    .filter(d => !d.isRegionHeader)
    .sort((a, b) => b.count - a.count)
    .slice(0, 15)
    .map(d => ({ name: d.country, count: d.count, region: d.region }))

  const chartData = chartView === 'region' ? regionData : countryData

  const formatNumber = (num: number) => {
    return '~' + num.toLocaleString()
  }

  return (
    <div className="space-y-6">
      {title && (
        <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
      )}

      {/* Table */}
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#184E77] text-white">
                <th className="px-4 py-3 text-left text-sm font-semibold w-1/2">Region / Country</th>
                <th className="px-4 py-3 text-right text-sm font-semibold w-1/2">Number of Substations (Units)</th>
              </tr>
            </thead>
            <tbody>
              {substationData.map((entry, index) => (
                <tr
                  key={index}
                  className={`border-b border-gray-100 ${
                    entry.isRegionHeader
                      ? 'bg-gray-50 font-semibold'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <td className={`px-4 py-2 text-sm text-gray-800 ${
                    entry.indent === 1 ? 'pl-10' : ''
                  } ${entry.isRegionHeader ? 'font-bold' : ''}`}>
                    {entry.country}
                  </td>
                  <td className={`px-4 py-2 text-sm text-right ${
                    entry.isRegionHeader ? 'font-bold text-gray-800' : 'text-gray-600'
                  }`}>
                    {formatNumber(entry.count)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Chart Section */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-gray-800">
            Substations Distribution - {chartView === 'region' ? 'By Region' : 'Top 15 Countries'}
          </h3>
          <div className="flex gap-1">
            <button
              onClick={() => setChartView('region')}
              className={`px-3 py-1 text-xs rounded transition-colors ${
                chartView === 'region'
                  ? 'bg-[#184E77] text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              By Region
            </button>
            <button
              onClick={() => setChartView('country')}
              className={`px-3 py-1 text-xs rounded transition-colors ${
                chartView === 'country'
                  ? 'bg-[#184E77] text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Top Countries
            </button>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={400}>
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 5, right: 30, left: chartView === 'country' ? 140 : 140, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" horizontal={false} />
            <XAxis
              type="number"
              tickFormatter={(value) => value >= 1000000 ? `${(value / 1000000).toFixed(1)}M` : `${(value / 1000).toFixed(0)}K`}
              tick={{ fontSize: 11, fill: '#4B5563' }}
            />
            <YAxis
              type="category"
              dataKey="name"
              tick={{ fontSize: 11, fill: '#374151' }}
              width={chartView === 'country' ? 130 : 130}
            />
            <Tooltip
              formatter={(value: number) => ['~' + value.toLocaleString(), 'Substations']}
              labelStyle={{ fontWeight: 'bold', color: '#1F2937' }}
              contentStyle={{ borderRadius: '8px', border: '1px solid #E5E7EB' }}
            />
            <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={chartView === 'country' ? 16 : 28}>
              {chartData.map((entry, index) => {
                let color: string
                if (chartView === 'region') {
                  color = CHART_COLORS[index % CHART_COLORS.length]
                } else {
                  const e = entry as { name: string; count: number; region: string }
                  color = regionColors[e.region] || CHART_COLORS[index % CHART_COLORS.length]
                }
                return <Cell key={`cell-${index}`} fill={color} />
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>

        {chartView === 'country' && (
          <div className="flex flex-wrap gap-3 mt-3 justify-center">
            {Object.entries(regionColors).map(([region, color]) => (
              <div key={region} className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: color }} />
                <span className="text-xs text-gray-600">{region}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
