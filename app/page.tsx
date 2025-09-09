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

async function getServers(): Promise<MCPServer[]> {
  try {
    const response = await fetch("https://registry.modelcontextprotocol.io/v0/servers", {
      cache: 'force-cache', // Cache the response
      next: { revalidate: 3600 } // Revalidate every hour
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
        <div className='col-span-12 sm:col-span-3 bg-[#f4f4f4] border-b border-b-[#cccccc] border-t border-t-[#cccccc] flex flex-col'>
          <h1 className="text-xl mx-auto font-serif">spekter</h1>
          <input className="w-[90%] bg-white mx-auto text-xs border border-[#cccccc] rounded-md p-1" placeholder="Search" />
        </div>
        <div className='col-span-12 sm:col-span-8'>
          <h1 className="text-xl bg-[#f4f4f4] border-t border-t-[#cccccc] border-b border-b-[#cccccc]">{servers.length} servers available</h1>
          <div className='mt-5 border-t border-t-[#cccccc] border-b border-b-[#cccccc] text-sm'>
            {servers.map((e: MCPServer, i: number) => {
              return (
                <div key={i} className='mb-5'>
                  <p className='font-bold'>{e.name}</p>
                  <a className='text-blue-500 underline' href={e.repository.url} target="_blank" rel="noopener noreferrer">{e.repository.url}</a>
                  <p>{e.description}</p>
                  <div>{e.remotes?.map((x: Remote) => <div key={x.type}><span>{x.type}</span>: <a className='text-blue-500 underline' href={x.url} target="_blank" rel="noopener noreferrer">{x.url}</a></div>)}</div>
                </div>
              )
            })}
          </div>
          
        </div>
        <div className='hidden sm:block col-span-1'>
          <select className="text-xs bg-[#f4f4f4] border-t border-t-[#cccccc] border-b border-b-[#cccccc]">
            <option>English</option>
          </select>
          <div className="mt-4 p-1 bg-[#f4f4f4] border border-[#cccccc]">
            <h3 className="text-xs font-bold mb-2">Server count</h3>
            <D3LineChart data={[17, 26]} height={50} />
          </div>
        </div>
      </main>
      <footer className="">
      </footer>
    </div>
  );
}
