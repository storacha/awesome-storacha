const SECRETS_KEY = 'secretshare_secrets'

export class SecretStorage {
  static getSecrets() {
    if (typeof window === 'undefined') return []
    const secrets = localStorage.getItem(SECRETS_KEY)
    return secrets ? JSON.parse(secrets) : []
  }

  static addSecret(secret) {
    const secrets = SecretStorage.getSecrets()
    const newSecret = {
      id: `secret_${Date.now()}`,
      ...secret,
      createdAt: new Date().toISOString(),
      status: 'active'
    }
    secrets.unshift(newSecret)
    localStorage.setItem(SECRETS_KEY, JSON.stringify(secrets))
    return newSecret
  }

  static removeSecret(id) {
    const secrets = SecretStorage.getSecrets()
    const filtered = secrets.filter(s => s.id !== id)
    localStorage.setItem(SECRETS_KEY, JSON.stringify(filtered))
  }

  static updateSecretStatus = (id, status) => {
    const secrets = SecretStorage.getSecrets()
    const updatedSecrets = secrets.map(secret =>
      secret.id === id ? { ...secret, revoked: status } : secret
    )
    localStorage.setItem(SECRETS_KEY, JSON.stringify(updatedSecrets))
  }
}