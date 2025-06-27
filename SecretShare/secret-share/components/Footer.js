import { Shield, X, GitBranch } from 'lucide-react'
import Link from 'next/link'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="w-full py-8 mt-16 text-lime-500 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Shield className="w-6 h-6 text-[#dcfe50]" />
              <h3 className="text-xl font-bold text-white">SecretShare</h3>
            </div>
            <p className="text-gray-300 text-sm">
              Secure, time-limited secret sharing for developers.
              Share API keys and credentials safely.
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="text-white font-semibold">Quick Links</h4>
            <nav className="flex flex-col space-y-2">
              <Link 
                href="/dashboard" 
                className="text-gray-300 hover:text-[#dcfe50] transition-colors"
              >
                Dashboard
              </Link>
              <Link 
                href="/issue" 
                className="text-gray-300 hover:text-[#dcfe50] transition-colors"
              >
                Share Secret
              </Link>
              <Link 
                href="https://docs.storacha.network/" 
                className="text-gray-300 hover:text-[#dcfe50] transition-colors"
              >
                Documentation
              </Link>
            </nav>
          </div>

          <div className="space-y-4">
            <h4 className="text-white font-semibold">Connect</h4>
            <div className="flex space-x-4">
              <a
                href="https://github.com/Nkovaturient/secretshare"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-gray-700 hover:bg-gray-600 text-white transition-colors"
              >
                <GitBranch className="w-5 h-5" />
              </a>
              <a
                href="https://twitter.com/matriX_Nk"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-gray-700 hover:bg-gray-600 text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-white text-sm">
              © {currentYear} SecretShare. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link 
                href="https://github.com/storacha/ucanto/blob/main/Readme.md" 
                className="text-black hover:text-[#15283D] text-sm transition-colors"
              >
                Privacy Policy
              </Link>
              <Link 
                href="https://github.com/storacha/ucanto/blob/main/LICENSE-MIT" 
                className="text-black hover:text-[#15283D] text-sm transition-colors"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}