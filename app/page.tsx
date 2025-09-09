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

async function getServers(): Promise<MCPServer[]> {
  try {
    const response = await fetch("https://registry.modelcontextprotocol.io/v0/servers?limit=100", {
      cache: 'force-cache', // Cache the response
      next: { revalidate: 60*5} // Revalidate five mins 
    });
    const data = await response.json();
    return data.servers || [];
  } catch (error) {
    console.error('Error fetching servers:', error);
    return [];
  }
}

export default async function Home() {
  const servers = await getServers();

  return (
    <div className="flex w-[90vw] sm:w-[75vw] mx-auto mt-5 mb-5">
      <main className="grid grid-cols-12 gap-5">
        <SearchableServerList servers={servers} />
        <div className='hidden sm:block col-span-1'>
          <select className="text-xs bg-[#f4f4f4] border-t border-t-[#cccccc] border-b border-b-[#cccccc]">
            <option>English</option>
          </select>
          <div className="mt-4 p-1 bg-[#f4f4f4] border border-[#cccccc]">
            <h3 className="text-xs font-bold mb-2">Server count</h3>
            <D3LineChart data={[17, 27, 39]} height={50} />
          </div>
        </div>
        <a className='flex text-xs underline fixed bottom-2 right-2' target="_blank" href="https://github.com/fizlip/mcplist">github</a>
      </main>
    </div>
  );
}
