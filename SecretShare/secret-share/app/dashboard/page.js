'use client'

import { useState, useEffect } from 'react'
import { SecretStorage } from '@/lib/secretRecord'
import { SecretCard } from '@/components/SecretCard'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'

export default function DashboardPage() {
  const [secrets, setSecrets] = useState([])
  const [filter, setFilter] = useState('all') 
  const router = useRouter()

  useEffect(() => {
    const loadedSecrets = SecretStorage.getSecrets()
    setSecrets(loadedSecrets)
  }, [])

  const handleDelete = (id) => {
    SecretStorage.removeSecret(id)
    setSecrets(prev => prev.filter(secret => secret.id !== id))
  }

  const filteredSecrets = secrets.filter(secret => {
    if (filter === 'active') {
      return new Date(secret.expiry) > new Date()
    }
    if (filter === 'expired') {
      return new Date(secret.expiry) <= new Date()
    }
    return true
  })

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 text-[#dcfe50]">
          🔐 Secret Management Dashboard
        </h1>

        <div className="flex justify-center gap-4 mb-8">
          <FilterButton 
            active={filter === 'all'} 
            onClick={() => setFilter('all')}
          >
            All Secrets
          </FilterButton>
          <FilterButton 
            active={filter === 'active'} 
            onClick={() => setFilter('active')}
          >
            Active
          </FilterButton>
          <FilterButton 
            active={filter === 'expired'} 
            onClick={() => setFilter('expired')}
          >
            Expired
          </FilterButton>
        </div>

        <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
          {filteredSecrets.map((secret, index) => (
            <motion.div
              key={secret.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <SecretCard 
                secret={secret}
                onDelete={() => handleDelete(secret.id)}
              />
            </motion.div>
          ))}
        </div>

        {filteredSecrets.length === 0 && (
          <div className="text-center py-20">
            <p className="text-2xl text-gray-400">No secrets found 💫</p>
            <button 
              onClick={() => router.push('/issue')}
              className="mt-4 px-6 py-2 bg-[#dcfe50] text-white rounded-lg hover:bg-[#1e3551] transition"
            >
              Share a New Secret
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

const FilterButton = ({ children, active, onClick }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded-lg transition ${
      active 
        ? 'bg-[#9ae600] text-white'
        : 'bg-white text-[#1e3551] hover:bg-gray-100'
    }`}
  >
    {children}
  </button>
)