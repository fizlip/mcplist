"use client"

import { useEffect, useState } from "react";

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

export default function ServerList({ getNextPage, list, filter, defaultPageSize, totalServerCount }: { getNextPage: () => void, list: MCPServer[], filter?: string, customFilter?: { streamableHttp?: boolean, sse?: boolean, localOnly?: boolean }, defaultPageSize: number, totalServerCount: number }) {
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(defaultPageSize);

    // Calculate total pages based on total server count and page size
    const totalPages = Math.ceil(totalServerCount / pageSize);
    
    useEffect(() => {
      if(list.slice((page - 1) * pageSize, page * pageSize).length < pageSize) {
        getNextPage();
      }
      // Scroll to top when page changes
      window.scrollTo({ top: 0, behavior: 'auto' });
    }, [page])

    return (
        <div>
            <div className="flex items-right bg-[#f4f4f4] border-b border-b-[#cccccc]">
              <p className="">Page size:</p> 
              <select className="text-right font-bold" onChange={(e) => setPageSize(Number(e.target.value))}>
                <option value="10">10</option>
                <option value="30">30</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
            </div>
            {filter && filter?.length > 0 ? <p>Search: {filter}</p> : null}
            {list.slice((page - 1) * pageSize, page * pageSize).map((item: MCPServer, index: number) => (
                <div key={index} className='mb-5'>
                    <p className='font-bold'>{item.name}</p>
                    <p>{item.description}</p>
                    <a className='text-blue-500 underline' href={item.repository.url} target="_blank" rel="noopener noreferrer">{item.repository.url}</a>
                </div>
            ))}
            <div className='flex justify-center gap-2 bg-[#f4f4f4] border-b border-b-[#cccccc] border-t border-t-[#cccccc]'>
              <button 
                className="hover:underline hover:bg-blue-100 hover:font-bold cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed" 
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
              >
                Previous
              </button>
              {
                Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                  <button 
                    key={pageNum} 
                    className={`mx-1 hover:underline hover:bg-blue-100 hover:font-bold cursor-pointer ${page === pageNum ? 'font-bold' : ''}`} 
                    onClick={() => setPage(pageNum)}
                  >
                    {pageNum}
                  </button>
                ))
              }
              <button 
                className="hover:underline hover:bg-blue-100 hover:font-bold cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed" 
                onClick={() => setPage(page + 1)}
                disabled={page === totalPages}
              >
                Next
              </button>
            </div>
        </div>
    )    
}
