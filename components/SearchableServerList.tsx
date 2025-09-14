"use client"

import { useEffect, useState } from 'react';
import ServerList from './ServerList';
import ItemButton from './ItemButton';
import LeftSidebar from './LeftSidebar';

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
      <div className='col-span-12 sm:col-span-2 bg-white flex flex-col'>
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
