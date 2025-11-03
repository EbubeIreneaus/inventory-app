
export const clients = new Set<any>()
export const adminClients = new Set<any>()

export function adminBroadcast(data: any) {
  data = `data: ${JSON.stringify(data)}\n\n`
  for (const client of adminClients) {
    try {
      client.write(data)
    } catch (error) {
      adminClients.delete(client)
    }
  }
}

export function broadcast(data: any) {
    data = `data: ${JSON.stringify(data)}\n\n`
  for (const client of clients) {
   try {
      client.write(data)
    } catch (error) {
      clients.delete(client)
    }
  }
}