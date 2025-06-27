import { useContext, useState } from 'react'
import { Copy, Download, Trash2, Timer, Users2, Check, ShieldOffIcon, UnlockIcon } from 'lucide-react'
import { motion } from 'framer-motion'
import { RevokeAccess } from '@/lib/ucan'
import { toast } from 'react-toastify'
import { SecretStorage } from '@/lib/secretRecord'
import { storeContext } from '@/context/storeContext'

export function SecretCard({ secret, onDelete }) {
  const { handleDecryption, isLoading } = useContext(storeContext)
  const [copied, setCopied] = useState(false)
  const [revoked, setRevoked] = useState(secret.revoked || false)
  const [decrypted, setDecrypted] = useState(false)
  const [revealSecret, setRevealSecret] = useState('')

  const copyToClipboard = async () => {
    if (revoked) return
    await navigator.clipboard.writeText(secret.shareLink)
    toast.success('Copied to clipboard!', { theme: 'colored' })
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleRevoke = (cid) => async () => {
    if (revoked) return
    try {
      const result = await RevokeAccess(cid)
      if (result) {
        setRevoked(true)
        SecretStorage.updateSecretStatus(secret.id, true)
        toast.warning('Access revoked successfully!', { theme: 'colored' })
      } else {
        toast.error('Failed to revoke access', { theme: 'dark' })
      }
    } catch (error) {
      toast.error(`Error revoking access: ${error.message}`, { theme: 'dark' })
      console.error('Error revoking access:', error)
    }
  }

  const handleDownload = () => {
    if (revoked) return
    const blob = new Blob([secret.shareLink], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `secret-${secret.id}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    toast.success('Downloaded!', { theme: 'dark' })
  }

  const handleDecryptionResult = () => {
    const response = handleDecryption()
    if (response != null) {
      setDecrypted(true);
      setRevealSecret(response)
    }
    setDecrypted(false)
  }

  const isExpired = new Date(secret.expiry) <= new Date()
  const usagePercentage = (secret.usage / secret.usageLimit) * 100
  const getButtonStyles = () => {
    return revoked
      ? 'p-2 text-gray-400 cursor-not-allowed opacity-50'
      : 'p-2 text-gray-600 hover:text-lime-700 transition'
  }

  return (
    <motion.div
      className={`relative bg-white p-6 m-4 rounded-2xl shadow-lg border ${isExpired ? 'border-red-400' : 'border-gray-400'
        } ${revoked ? 'opacity-60' : ''}`}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      {revoked && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="transform rotate-[-35deg] text-red-500 text-3xl font-bold opacity-30 pointer-events-none">
            REVOKED
          </span>
        </div>
      )}
      <div className="space-y-4 relative">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <h3 className="font-medium text-lime-700">Shared Secret</h3>
            <p className="text-sm text-sky-500">{decrypted ? revealSecret : (secret.secret).substring(0, 15) + '...'}</p>
            {/* <button
              onClick={handleDecryptionResult}
              disabled={isLoading}
              className={getButtonStyles()}
            >
              Reveal
            </button> */}
          </div>
          <button
            onClick={onDelete}
            title="Delete"
            className="text-red-500 hover:text-red-700 transition"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Users2 className="w-4 h-4" />
          <span>Recipient: {(secret.recipient).substring(0, 15) + '...'}</span>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Usage</span>
            <span>{secret.usage}/{secret.usageLimit}</span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`h-full ${isExpired ? 'bg-red-500' : 'bg-green-500'}`}
              style={{ width: `${usagePercentage}%` }}
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Timer className="w-4 h-4" />
            <span>Expiry: {new Date(secret.expiry).toLocaleString()}</span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={copyToClipboard}
              className={getButtonStyles()}
              title={revoked ? "Access Revoked" : "Copy IPFS Link"}
              disabled={revoked}
            >
              {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
            </button>
            <button
              onClick={handleDownload}
              className={getButtonStyles()}
              title={revoked ? "Access Revoked" : "Download"}
              disabled={revoked}
            >
              <Download className="w-5 h-5" />
            </button>
            <button
              onClick={handleRevoke(secret.cid)}
              className={`p-2 transition ${revoked
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-gray-600 hover:text-lime-700'
                }`}
              title={revoked ? "Already Revoked" : "Revoke Secret"}
              disabled={revoked}
            >
              <ShieldOffIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
