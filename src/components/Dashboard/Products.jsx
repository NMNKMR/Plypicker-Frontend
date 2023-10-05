  
function Products({products, handleAddToCart}) {

    return (
      <div className="bg-white">
        <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
          <h2 className="sr-only">Products</h2>
  
          <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-10">
            {products.map((product) => (
              <div key={product.id} >
                <a href='#' className="group">
                <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-gray-200 xl:aspect-h-8 xl:aspect-w-7">
                  <img
                    src={product.image}
                    alt=''
                    className="h-full w-full object-cover object-center group-hover:opacity-75"
                  />
                </div>
                <h3 className="mt-4 text-sm text-gray-700">{product.productName}</h3>
                <p className="mt-1 text-lg font-medium text-gray-900">Rs{product.price}</p>
              </a>
              <button className="bg-slate-500 mt-2 font-semibold px-2 py-2
               hover:bg-slate-400 " onClick={()=> handleAddToCart(product.id)}>Add To Cart</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
}

export default Products;  