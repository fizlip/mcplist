"use client";
import { useState, useEffect } from 'react';

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
    <div className="">
      <main className="flex m-auto w-full">
        <div className='m-auto'>
          <h1 className="text-2xl mb-5 border-b">A list of all MCP servers in the official MCP registry</h1>
          <div>
            {list.length === 0 ? (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                <span className="ml-3">Loading MCP servers...</span>
              </div>
            ) : (
              list.map((e, i) => {
                return (
                  <div key={i} className='mb-5'>
                    <p className='font-bold'>{e.name}</p>
                    <p>{e.description}</p>
                    <div>{e.remotes?.map((x: Remote) => <div key={x.type}><span>{x.type}</span>: <a className='text-blue-500 underline' href={x.url} target="_blank" rel="noopener noreferrer">{x.url}</a></div>)}</div>
                    <a className='text-blue-500 underline' href={e.repository.url} target="_blank" rel="noopener noreferrer">{e.repository.url}</a>
                  </div>
                )
              })
            )}
          </div>
        </div>
      </main>
      <footer className="">
      </footer>
    </div>
  );
}
