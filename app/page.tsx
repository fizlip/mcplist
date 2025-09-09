"use client";
import { useState, useEffect } from 'react';
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

export default function Home() {
  const [list, setList] = useState<MCPServer[]>([]);

  useEffect(() => {
    fetch("/api/servers")
      .then(response => response.json())
      .then(data => {
        console.log(data)
        setList(data.servers || [])
      })
      .catch(error => {
        console.error('Error:', error)
      })
  }, [])

  return (
    <div className="flex w-[75vw] mx-auto mt-5 mb-5">
      <main className="grid grid-cols-12 gap-5">
        <div className='col-span-3 bg-[#f4f4f4] border-b border-t flex flex-col'>
          <h1 className="text-xl mx-auto font-serif">spekter</h1>
          <input className="w-[90%] bg-white mx-auto text-xs border rounded-md p-1" placeholder="Search" />
        </div>
        <div className='col-span-8'>
          <h1 className="text-xl bg-[#f4f4f4] border-t border-b">{list.length} servers available</h1>
          <div className='mt-5 border-t border-b text-sm'>
            {list.length === 0 ? (
              <div className="py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                <span className="ml-3">Loading MCP servers...</span>
              </div>
            ) : (
              list.map((e, i) => {
                return (
                  <div key={i} className='mb-5'>
                    <p className='font-bold'>{e.name}</p>
                    <a className='text-blue-500 underline' href={e.repository.url} target="_blank" rel="noopener noreferrer">{e.repository.url}</a>
                    <p>{e.description}</p>
                    <div>{e.remotes?.map((x: Remote) => <div key={x.type}><span>{x.type}</span>: <a className='text-blue-500 underline' href={x.url} target="_blank" rel="noopener noreferrer">{x.url}</a></div>)}</div>
                  </div>
                )
              })
            )}
          </div>
          
        </div>
        <div className='col-span-1'>
          <select className="text-xs bg-[#f4f4f4] border-t border-b">
            <option>English</option>
          </select>
          <div className="mt-4 p-1 bg-[#f4f4f4] border">
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
