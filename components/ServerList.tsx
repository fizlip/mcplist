"use client"

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

export default function ServerList({ list, filter }: { list: MCPServer[], filter?: string }) {
    return (
        <div>
          <p>{filter}</p>
            {list.map((item: MCPServer, index: number) => (
                <div key={index} className='mb-5'>
                    <p className='font-bold'>{item.name}</p>
                    <a className='text-blue-500 underline' href={item.repository.url} target="_blank" rel="noopener noreferrer">{item.repository.url}</a>
                    <p>{item.description}</p>
                    <div>{item.remotes?.map((x: Remote) => <div key={x.type}><span>{x.type}</span>: <a className='text-blue-500 underline' href={x.url} target="_blank" rel="noopener noreferrer">{x.url}</a></div>)}</div>
                </div>
            ))}
        </div>
    )    
}
