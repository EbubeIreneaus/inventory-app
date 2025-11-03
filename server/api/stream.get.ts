import { clients, adminClients } from "../utils/broadcast";

export default defineEventHandler(async (event) => {
  const user = event.context.auth;
  setResponseHeader(event, "Content-Type", "text/event-stream");
  setResponseHeader(event, "Cache-Control", "no-cache");
  setResponseHeader(event, "Connection", "keep-alive");
  setResponseHeader(event, "Content-Encoding", "identity"); // IMPORTANT: disable compression


  
  const client = event.node.res;
   event.node.req.socket.setKeepAlive(true);
  client.flushHeaders?.();

  if (user?.previlage == "admin") {
    adminClients.add(client);
  }

  clients.add(client);

  client.write(':\n\n')

  const heartbeat = setInterval(() => {
    try {
      client.write(":\n\n")
    } catch {
      clients.delete(client)
      adminClients.delete(client)
      clearInterval(heartbeat)
    }
  }, 30000)

  event.node.req.on("close", () => {
    clients.delete(client);
    adminClients.delete(client);
    clearInterval(heartbeat)
  });
});
