'use client'

import { useState, useMemo, useEffect, useRef } from 'react'
import { useDashboardStore } from '@/lib/store'
import { Check, ChevronDown } from 'lucide-react'

interface GeoOption {
  name: string
  level: 'global' | 'region' | 'country'
}

export function GeographyMultiSelect() {
  const { data, filters, updateFilters } = useDashboardStore()
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  // Build hierarchical geography options
  const geographyOptions = useMemo((): GeoOption[] => {
    if (!data || !data.dimensions?.geographies) return []

    const geo = data.dimensions.geographies
    const globalSet = new Set(geo.global || [])
    const regionSet = new Set(geo.regions || [])
    const countryMap = geo.countries || {}

    // Build ordered list: Global, then Region > Countries
    const options: GeoOption[] = []

    // Global entries
    for (const g of geo.global || []) {
      options.push({ name: g, level: 'global' })
    }

    // Regions and their countries
    for (const region of geo.regions || []) {
      options.push({ name: region, level: 'region' })
      const kids = countryMap[region] || []
      for (const country of kids) {
        options.push({ name: country, level: 'country' })
      }
    }

    // Any remaining geographies not in hierarchy
    const seen = new Set(options.map(o => o.name))
    for (const g of geo.all_geographies || []) {
      if (!seen.has(g)) {
        options.push({ name: g, level: 'country' })
      }
    }

    // Filter based on search term
    if (!searchTerm) return options

    const search = searchTerm.toLowerCase()
    return options.filter(opt => opt.name.toLowerCase().includes(search))
  }, [data, searchTerm])

  const handleToggle = (geography: string) => {
    const current = filters.geographies
    const updated = current.includes(geography)
      ? current.filter(g => g !== geography)
      : [...current, geography]

    updateFilters({ geographies: updated })
  }

  const handleSelectAll = () => {
    if (!data) return
    updateFilters({
      geographies: data.dimensions.geographies.all_geographies
    })
  }

  const handleClearAll = () => {
    updateFilters({ geographies: [] })
  }

  if (!data) return null

  const selectedCount = filters.geographies.length

  return (
    <div className="relative" ref={dropdownRef}>

      {/* Dropdown Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-2 text-left bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-between"
      >
        <span className="text-sm text-black">
          {selectedCount === 0
            ? 'Select geographies...'
            : `${selectedCount} selected`}
        </span>
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-96 overflow-hidden">
          {/* Search */}
          <div className="p-3 border-b">
            <input
              type="text"
              placeholder="Search geographies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Actions */}
          <div className="px-3 py-2 bg-gray-50 border-b flex gap-2">
            <button
              onClick={handleSelectAll}
              className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
            >
              Select All
            </button>
            <button
              onClick={handleClearAll}
              className="px-3 py-1 text-xs bg-gray-100 text-black rounded hover:bg-gray-200"
            >
              Clear All
            </button>
          </div>

          {/* Geography List - Hierarchical */}
          <div className="overflow-y-auto max-h-64">
            {geographyOptions.length === 0 ? (
              <div className="px-3 py-4 text-sm text-black text-center">
                {searchTerm ? 'No geographies found matching your search' : 'No geographies available'}
              </div>
            ) : (
              geographyOptions.map((opt, index) => (
                <label
                  key={opt.name}
                  className={`flex items-center py-2 hover:bg-blue-50 cursor-pointer ${
                    index > 0 ? 'border-t border-gray-100' : ''
                  } ${opt.level === 'country' ? 'pl-8 pr-3' : 'px-3'}`}
                >
                  <input
                    type="checkbox"
                    checked={filters.geographies.includes(opt.name)}
                    onChange={() => handleToggle(opt.name)}
                    className="mr-3 h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                  />
                  <span className={`text-sm flex-1 ${
                    opt.level === 'global' ? 'font-bold text-black' :
                    opt.level === 'region' ? 'font-semibold text-black' :
                    'text-gray-700'
                  }`}>
                    {opt.name}
                  </span>
                  {filters.geographies.includes(opt.name) && (
                    <Check className="h-4 w-4 text-blue-600" />
                  )}
                </label>
              ))
            )}
          </div>
        </div>
      )}

      {/* Selected Count Badge */}
      {selectedCount > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          <span className="text-xs text-black">
            {selectedCount} {selectedCount === 1 ? 'geography' : 'geographies'} selected
          </span>
        </div>
      )}
    </div>
  )
}
