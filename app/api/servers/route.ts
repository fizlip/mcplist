export async function GET() {
  try {
    const response = await fetch("https://registry.modelcontextprotocol.io/v0/servers");
    const data = await response.json();
    
    return Response.json(data);
  } catch (error) {
    console.error('Error fetching servers:', error);
    return Response.json({ error: 'Failed to fetch servers' }, { status: 500 });
  }
}
