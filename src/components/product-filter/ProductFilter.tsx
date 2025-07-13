import React from 'react'

const ProductFilter: React.FunctionComponent = () => {
  return (
    <div className="w-full h-auto !mb-7.5 border-1 border-[#eee]">
        <div className="w-full bg-[#eee] !p-2.5 !mb-2.5">
            <div className="w-full flex items-center gap-2">
                <img 
                    width="24" 
                    height="24" 
                    src="https://img.icons8.com/badges/48/sorting-options.png" 
                    alt="filter-icons"
                />
                <span className="text-[#333] text-xl uppercase font-bold">Bộ lọc sản phẩm</span>
            </div>
        </div>
    </div>
  )
}

export {
    ProductFilter
}