"use client"

import { useState } from 'react';
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

export default function SearchableServerList({ servers }: { servers: MCPServer[] }) {
  const [searchTerm, setSearchTerm] = useState('');

  const [filter, setFilter] = useState({streamableHttp: false, sse: false, localOnly: false})

  let filteredServers = servers.filter(server =>
    server.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    server.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if(filter.streamableHttp){
    filteredServers = filteredServers.filter(server => server.remotes?.some(remote => remote.type === 'streamable-http'));
  }

  if(filter.sse){
    filteredServers = filteredServers.filter(server => server.remotes?.some(remote => remote.type == "sse"));
  }

  if(filter.localOnly){
    filteredServers = filteredServers.filter(server => !server.remotes || server.remotes.length === 0);
  }

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
                <label className='ml-2'>Local Only</label>
            </div>
        </div>
      </div>
      <div className='col-span-12 sm:col-span-8'>
        <h1 className="text-xl bg-[#f4f4f4] border-t border-t-[#cccccc] border-b border-b-[#cccccc]">
          {filteredServers.length} servers available
          {searchTerm && ` (filtered from ${servers.length})`}
        </h1>
        <div className='mt-5 border-t border-t-[#cccccc] border-b border-b-[#cccccc] text-sm'>
          <ServerList list={filteredServers} filter={searchTerm} customFilter={filter} />
        </div>
      </div>
    </>
  );
}
