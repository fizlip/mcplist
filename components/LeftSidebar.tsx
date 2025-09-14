import ItemButton from "./ItemButton";

export default function LeftSidebar() {
    return(
      <div>
        <h1 className="text-xl mx-auto font-serif">spekter</h1>
        <input 
          className="w-[90%] bg-white mx-auto text-xs border border-[#cccccc] rounded-md p-1" 
          placeholder="Search servers..." 
        />
        <div className='mt-5 text-sm ml-5'>
            <p>Filter by</p>
            <div>
                <input 
                  type="checkbox" 
                  onChange={(e) => null}
                />
                <label className='ml-2'>Streamable HTTP</label>
            </div>
            <div>
                <input 
                  type="checkbox" 
                  onChange={(e) => null}
                />
                <label className='ml-2'>SSE</label>
            </div>
            <div>
                <input 
                  type="checkbox" 
                  onChange={(e) => null}
                />
                <label className='ml-2'>Local</label>
            </div>
        </div>
        <div className='mt-5 text-xs ml-5 mr-5'>
          <p>Choose a category</p>
          <div className='flex flex-wrap'>
            <ItemButton label="Local Tools" onClick={() => null}/>
            <ItemButton label="Agentic Coding" onClick={() => null}/>
            <ItemButton label="Data Access & Data Analysis" onClick={() => null}/>
            <ItemButton label="Internet & Browser Use" onClick={() => null}/>
            <ItemButton label="Communication" onClick={() => null}/>
            <ItemButton label="Voice & Audio" onClick={() => null}/>
            <ItemButton label="Gateways" onClick={() => null}/>
            <ItemButton label="Education" onClick={() => null}/>
            <ItemButton label="Finance & Business" onClick={() => null}/>
            <ItemButton label="LLM Enhancements" onClick={() => null}/>
            <ItemButton label="Medical" onClick={() => null}/>
            <ItemButton label="Graphics & Design" onClick={() => null}/>
            <ItemButton label="Utilities" onClick={() => null}/>
          </div>
        </div>
      </div>
    )
}