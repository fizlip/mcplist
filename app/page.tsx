import SearchableServerList from '@/components/SearchableServerList';
import D3LineChart from '../components/D3LineChart';

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

async function getServers(): Promise<{ servers: MCPServer[], status: number | 'ERROR', latency: number, cursor: string }> {
  const startTime = performance.now();
  
  try {
    const response = await fetch("https://spekter.io/api/index", {
      cache: 'force-cache', // Cache the response
      next: { revalidate: 60*5} // Revalidate five mins 
    });

    const endTime = performance.now();
    const latency = Math.round(endTime - startTime);
    
    if (response.status === 500) {
      return { servers: [], status: 500, latency, cursor: '' };
    }
    
    if (!response.ok) {
      return { servers: [], status: response.status, latency, cursor: '' };
    }
    
    // console.log("data: ", response)
    const data = await response.json();
    return { servers: data.servers || [], status: response.status, latency, cursor: "" };
  } catch (error) {
    const endTime = performance.now();
    const latency = Math.round(endTime - startTime);
    console.error('Error fetching servers:', error);
    return { servers: [], status: 'ERROR', latency, cursor: '' };
  }
}

export default async function Home() {
  const { servers, status, latency, cursor } = await getServers();
  const TOTAL_SERVER_COUNT:number = servers.length;

  return (
    <div className="flex w-[90vw] sm:w-[75vw] mx-auto mt-5 mb-5">
      <main className="grid grid-cols-12 gap-5">
        <SearchableServerList cachedServers={servers} status={status} latency={latency} ocursor={cursor} totalServerCount={TOTAL_SERVER_COUNT}/>
        <div className='hidden sm:block col-span-2'>
          <select className="text-xs bg-[#f4f4f4] border border-[#cccccc] rounded p-1">
            <option>English</option>
          </select>
          <div className="mt-4 p-2 rounded bg-[#f4f4f4] border border-[#cccccc]">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-xs font-bold">Server count</h3>
            </div>
            <D3LineChart data={[451, 471, 504, 571, 779]} height={50} />
          </div>
          <p className="text-xs bg-blue-100 p-1 border border-[#cccccc] mt-5 rounded">Servers are indexed every hour.</p>
        </div>
        <a className='flex text-xs underline fixed bottom-2 right-2' target="_blank" href="https://github.com/fizlip/mcplist">github</a>
      </main>
    </div>
  );
}
