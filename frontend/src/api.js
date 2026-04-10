const API_BASE_URL = 'https://my-money-maker.onrender.com'

export async function fetchTransactions() {
  const response = await fetch(`${API_BASE_URL}/transactions`)

  if (!response.ok) {
    throw new Error('Failed to fetch transactions')
  }

  return response.json()
}

export async function createTransaction(text) {
  const formData = new FormData()
  formData.append('text', text)

  const response = await fetch(`${API_BASE_URL}/transactions`, {
    method : 'POST',
    body : formData,
  })

  if (!response.ok) {
    throw new Error('Failed to create transaction')
  }

  return response.json()
}
