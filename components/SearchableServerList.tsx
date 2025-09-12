"use client"

import { useEffect, useState } from 'react';
import ServerList from './ServerList';

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

export default function SearchableServerList({ cachedServers, status, latency, ocursor, totalServerCount }: { cachedServers: MCPServer[], status: number | 'ERROR', latency: number, ocursor: string, totalServerCount: number }) {
  const [searchTerm, setSearchTerm] = useState('');

  const [filter, setFilter] = useState({streamableHttp: false, sse: false, localOnly: false})

  const [currentStatus, setCurrentStatus] = useState(status);
  const [currentLatency, setCurrentLatency] = useState(latency);

  const [servers, setServers] = useState<MCPServer[]>(cachedServers);
  const [cursor, setCursor] = useState<string>(ocursor);

  let filteredServers = servers.filter(server =>
    server.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    server.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getNextPage = async () => {

    if(cursor == undefined) return;

    const response = await fetch("api/servers" + (cursor ? `?cursor=${cursor}` : ''), {
      cache: 'force-cache', // Cache the response
      next: { revalidate: 60*5} // Revalidate five mins 
    });

    console.log("cursor: ", cursor)

    const data = await response.json();
    console.log("Page: ", data);
    setServers([...servers, ...data.servers]);
    setCursor(data.metadata.next_cursor);
  }

  if(filter.streamableHttp){
    filteredServers = filteredServers.filter(server => 
      Array.isArray(server.remotes) && server.remotes.some(remote => remote.type === 'streamable-http')
    );
  }

  if(filter.sse){
    filteredServers = filteredServers.filter(server => 
      Array.isArray(server.remotes) && server.remotes.some(remote => remote.type === "sse")
    );
  }

  if(filter.localOnly){
    filteredServers = filteredServers.filter(server => 
      !Array.isArray(server.remotes) || server.remotes.length === 0
    );
  }

  useEffect(() => {
    setCurrentStatus(status);
    setCurrentLatency(latency);
  }, [status, latency]);

  return (
    <>
      <div className='col-span-12 sm:col-span-3 bg-[#f4f4f4] border-b border-b-[#cccccc] border-t border-t-[#cccccc] flex flex-col'>
        <h1 className="text-xl mx-auto font-serif">spekter</h1>
        <input 
          className="w-[90%] bg-white mx-auto text-xs border border-[#cccccc] rounded-md p-1" 
          placeholder="Search servers..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className='mt-5 text-sm ml-5'>
            <p>Filter by</p>
            <div>
                <input 
                  type="checkbox" 
                  checked={filter.streamableHttp}
                  onChange={(e) => setFilter({ ...filter, streamableHttp: e.target.checked})}
                />
                <label className='ml-2'>Streamable HTTP</label>
            </div>
            <div>
                <input 
                  type="checkbox" 
                  checked={filter.sse}
                  onChange={(e) => setFilter({ ...filter, sse: e.target.checked })}
                />
                <label className='ml-2'>SSE</label>
            </div>
            <div>
                <input 
                  type="checkbox" 
                  checked={filter.localOnly}
                  onChange={(e) => setFilter({ ...filter, localOnly: e.target.checked })}
                />
                <label className='ml-2'>Local</label>
            </div>
        </div>
        <div className='mt-5 text-xs ml-5 mr-5'>
          <p>Choose a category</p>
          <div>
            <p className='text-blue-500 underline hover:bg-blue-100 p-1 hover:cursor-pointer'>Local Tools</p>
            <p className='text-blue-500 underline hover:bg-blue-100 p-1 hover:cursor-pointer'>Agentic Coding</p>
            <p className='text-blue-500 underline hover:bg-blue-100 p-1 hover:cursor-pointer'>Data Access & Data Analysis</p>
            <p className='text-blue-500 underline hover:bg-blue-100 p-1 hover:cursor-pointer'>Internet & Browser Use</p>
            <p className='text-blue-500 underline hover:bg-blue-100 p-1 hover:cursor-pointer'>Communication</p>
            <p className='text-blue-500 underline hover:bg-blue-100 p-1 hover:cursor-pointer'>Voice & Audio</p>
            <p className='text-blue-500 underline hover:bg-blue-100 p-1 hover:cursor-pointer'>Gateways</p>
            <p className='text-blue-500 underline hover:bg-blue-100 p-1 hover:cursor-pointer'>Education</p>
            <p className='text-blue-500 underline hover:bg-blue-100 p-1 hover:cursor-pointer'>Finance & Business</p>
            <p className='text-blue-500 underline hover:bg-blue-100 p-1 hover:cursor-pointer'>LLM Enhancements</p>
            <p className='text-blue-500 underline hover:bg-blue-100 p-1 hover:cursor-pointer'>Medical</p>
            <p className='text-blue-500 underline hover:bg-blue-100 p-1 hover:cursor-pointer'>Graphics & Design</p>
            <p className='text-blue-500 underline hover:bg-blue-100 p-1 hover:cursor-pointer'>Utilities</p>
          </div>
        </div>
      </div>
      <div className='col-span-12 sm:col-span-7'>
        <h1 className="text-xl bg-[#f4f4f4] border-t border-t-[#cccccc] border-b border-b-[#cccccc]">
          {totalServerCount} servers available
          {searchTerm && ` (filtered from ${servers.length})`}
          <div className='flex items-center gap-4'>
            <div className='flex items-center'>
              <p className="text-xs ">API Status: </p>
              <p className={`text-xs font-bold ${
                currentStatus === 200 ? 'text-green-600' : 
                currentStatus === 'ERROR' ? 'text-red-600' : 
                'text-red-600'
              }`}>
                {currentStatus}
              </p>
            </div>
            <div className='flex items-center'>
              <p className="text-xs ">Latency: </p>
              <p className="text-xs font-bold text-blue-600">
                {currentLatency}ms
              </p>
            </div>
          </div>
        </h1>
        <div className='mt-5 border-t border-t-[#cccccc] border-b border-b-[#cccccc] text-sm'>
          <ServerList getNextPage={() => getNextPage()} list={filteredServers} filter={searchTerm} customFilter={filter} defaultPageSize={100} totalServerCount={totalServerCount}/>
        </div>
      </div>
    </>
  );
}
