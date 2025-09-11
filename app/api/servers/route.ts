export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const cursor = searchParams.get('cursor');
    
    const url = `https://registry.modelcontextprotocol.io/v0/servers?limit=100${cursor ? `&cursor=${cursor}` : ''}`;
    const response = await fetch(url);
    const data = await response.json();
    
    return Response.json(data);
  } catch (error) {
    console.error('Error fetching servers:', error);
    return Response.json({ error: 'Failed to fetch servers' }, { status: 500 });
  }
}
