import SearchableServerList from '@/components/SearchableServerList';
import D3LineChart from '../components/D3LineChart';
import { Github } from 'lucide';

interface Remote {
  type: string;
  url: string;
}

interface Repository {
  url: string;
}

interface MCPServer {
  name: string;
  description: string;
  remotes?: Remote[];
  repository: Repository;
}

async function getServers(): Promise<{ servers: MCPServer[], status: 'ONLINE' | 'OFFLINE', latency: number }> {
  const startTime = performance.now();
  
  try {
    const response = await fetch("https://registry.modelcontextprotocol.io/v0/servers?limit=100", {
      cache: 'force-cache', // Cache the response
      next: { revalidate: 60*5} // Revalidate five mins 
    });
    
    const endTime = performance.now();
    const latency = Math.round(endTime - startTime);
    
    if (response.status === 500) {
      return { servers: [], status: 'OFFLINE', latency };
    }
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    console.log("data: ", response)
    const data = await response.json();
    return { servers: data.servers || [], status: 'ONLINE', latency };
  } catch (error) {
    const endTime = performance.now();
    const latency = Math.round(endTime - startTime);
    console.error('Error fetching servers:', error);
    return { servers: [], status: 'OFFLINE', latency };
  }
}

export default async function Home() {
  const { servers, status, latency } = await getServers();

  return (
    <div className="flex w-[90vw] sm:w-[75vw] mx-auto mt-5 mb-5">
      <main className="grid grid-cols-12 gap-5">
        <SearchableServerList servers={servers} status={status} latency={latency} />
        <div className='hidden sm:block col-span-1'>
          <select className="text-xs bg-[#f4f4f4] border-t border-t-[#cccccc] border-b border-b-[#cccccc]">
            <option>English</option>
          </select>
          <div className="mt-4 p-1 bg-[#f4f4f4] border border-[#cccccc]">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-xs font-bold">Server count</h3>
            </div>
            <D3LineChart data={[27, 46, 49, 51]} height={50} />
          </div>
        </div>
        <a className='flex text-xs underline fixed bottom-2 right-2' target="_blank" href="https://github.com/fizlip/mcplist">github</a>
      </main>
    </div>
  );
}
