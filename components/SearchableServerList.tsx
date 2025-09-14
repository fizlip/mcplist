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
        <p className='text-xl font-serif'>Spekter</p>
      </div>
      <div className='col-span-12 sm:col-span-7'>
        <input 
          className='w-[100%] border border-[#cccccc] p-2 pl-5 mb-5 rounded-full bg-[#f4f4f4]'
          placeholder="Search servers..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <h1 className="flex text-base">
          {filteredServers.length} servers found in {currentLatency} ms
        </h1>
        <div className='mt-5 text-sm'>
          <ServerList getNextPage={() => getNextPage()} list={filteredServers} filter={searchTerm} customFilter={filter} defaultPageSize={100} totalServerCount={filteredServers.length}/>
        </div>
      </div>
    </>
  );
}
