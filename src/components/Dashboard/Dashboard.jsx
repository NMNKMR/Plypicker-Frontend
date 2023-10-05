import { Fragment, useEffect, useState } from 'react'
import { Disclosure, Menu, Transition } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import Products from './Products';
import Cart from './Cart';
import Attendance from './Attendance';

const user = {
    name: 'User',
    email: 'user@example.com',
    imageUrl:
      'vite.svg',
}
  
const userNavigation = [
    { name: 'Your Profile', href: '#' },
    { name: 'Settings', href: '#' },
    { name: 'Sign out', href: '#' },
]
  
function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

function Dashboard({jwtToken}) {
    const [productsData, setProductsData] = useState([]);
    const [cartOpen, setCartOpen] = useState(false)
    const [attendOpen, setAttendOpen] = useState(false);
    const [cartItems, setCartItems] = useState([]);
    const [attendRecord, setAttendRecord] = useState([]);

    
    const navigation = [
        { name: 'Dashboard', href: '#', current: true },
        { name: 'Cart', href: '#', onClick: function () { setCartOpen(true) }, current: false },
        { name: 'Attendance', href: '#', onClick: function () { setAttendOpen(true) }, current: false },
        { name: 'Calendar', href: '#', current: false },
        { name: 'Reports', href: '#', current: false },
    ]

    useEffect(() => {
        const fetchProducts = async () => {
            await fetch('https://64e0caef50713530432cafa1.mockapi.io/api/products', {
                method: 'GET'
            })
            .then((response) => response.json())
            .then((products) => {
                if(products) setProductsData(products)
            })
            .catch((err) => {
              console.log(err);
            });
        }

        const fetchCartItems = async () => {
            fetch(`${import.meta.env.VITE_API_URL}/cart`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${jwtToken}`,
                    'Content-Type': 'application/json'
                },
            })
                .then(response => response.json())
                .then(data => {
                    if(!data.error) setCartItems(data.cart);
                })
                .catch(error => {
                    console.log(error);
                });
        }

        fetchProducts();
        fetchCartItems();
    }, [])

    useEffect(()=> {
        const fetchAttendance = async () => {
            await fetch(`${import.meta.env.VITE_API_URL}/attendance`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${jwtToken}`,
                    'Content-Type': 'application/json'
                },
            })
                .then((response) => response.json())
                .then((record) => {
                    if(record) setAttendRecord(record.timestamps.reverse())
                })
                .catch((err) => {
                    console.log(err);
                });
        }
        fetchAttendance();
    }, [])

    const handleAddToCart = async (pid) => {
        const hasIndex = cartItems.findIndex((product) => product.pid === pid);

        if(hasIndex >= 0) {
            setCartItems((prevCart) => {
                return prevCart.map((product, index)=> {
                   return (index === hasIndex)? {...product, quantity: product.quantity+1} : product
                })
            })
        }
        else {
            await fetch(`https://64e0caef50713530432cafa1.mockapi.io/api/products/${pid}`, {
                method: 'GET',
            })
                .then((response) => response.json())
                .then((product) => {
                    const { productName: name, image, quantity = 1, price, id: pid } = product;
                    setCartItems((prevItems) => {
                        return [...prevItems, { name, image, quantity, price, pid }];
                    })
                })
                .catch((err) => {
                    console.log(err);
                });

        } 
            
        await fetch(`${import.meta.env.VITE_API_URL}/cart/add/${pid}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${jwtToken}`,
                'Content-Type': 'application/json'
            },
        })
            .then(response => response.json())
            .then(data => {
                console.log(data.message);
            })
            .catch(error => {
                console.log(error);
            });
    }

  return (
    <>
      <div className="min-h-full">
        <Disclosure as="nav" className="bg-gray-800">
          {({ open }) => (
            <>
              <div className="mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <img
                        className="h-8 w-8"
                        src="plypickerlogo.png"
                        alt="Your Company"
                      />
                    </div>
                    <div className="hidden md:block">
                      <div className="ml-10 flex items-baseline space-x-4">
                        {navigation.map((item) => (
                          <a
                            key={item.name}
                            href={item.href}
                            onClick={(item.onClick)? item.onClick : null}
                            className={classNames(
                              item.current
                                ? 'bg-gray-900 text-white'
                                : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                              'rounded-md px-3 py-2 text-sm font-medium'
                            )}
                            aria-current={item.current ? 'page' : undefined}
                          >
                            {item.name}
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="hidden md:block">
                    <div className="ml-4 flex items-center md:ml-6">
                        <h3 className='text-white'>Welcome, {user.name}</h3>

                      {/* Profile dropdown */}
                      <Menu as="div" className="relative ml-3">
                        <div>
                          <Menu.Button className="relative flex max-w-xs items-center rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                            <span className="absolute -inset-1.5" />
                            <span className="sr-only">Open user menu</span>
                            <img className="h-8 w-8 rounded-full" src={user.imageUrl} alt="" />
                          </Menu.Button>
                        </div>
                        <Transition
                          as={Fragment}
                          enter="transition ease-out duration-100"
                          enterFrom="transform opacity-0 scale-95"
                          enterTo="transform opacity-100 scale-100"
                          leave="transition ease-in duration-75"
                          leaveFrom="transform opacity-100 scale-100"
                          leaveTo="transform opacity-0 scale-95"
                        >
                          <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                            {userNavigation.map((item) => (
                              <Menu.Item key={item.name}>
                                {({ active }) => (
                                  <a
                                    href={item.href}
                                    className={classNames(
                                      active ? 'bg-gray-100' : '',
                                      'block px-4 py-2 text-sm text-gray-700'
                                    )}
                                  >
                                    {item.name}
                                  </a>
                                )}
                              </Menu.Item>
                            ))}
                          </Menu.Items>
                        </Transition>
                      </Menu>
                    </div>
                  </div>
                  <div className="-mr-2 flex md:hidden">
                    {/* Mobile menu button */}
                    <Disclosure.Button className="relative inline-flex items-center justify-center rounded-md bg-gray-800 p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                      <span className="absolute -inset-0.5" />
                      <span className="sr-only">Open main menu</span>
                      {open ? (
                        <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                      ) : (
                        <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                      )}
                    </Disclosure.Button>
                  </div>
                </div>
              </div>

              <Disclosure.Panel className="md:hidden">
                <div className="space-y-1 px-2 pb-3 pt-2 sm:px-3">
                  {navigation.map((item) => (
                    <Disclosure.Button
                      key={item.name}
                      as="a"
                      href={item.href}
                      onClick={(item.onClick)? item.onClick : null}
                      className={classNames(
                        item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                        'block rounded-md px-3 py-2 text-base font-medium'
                      )}
                      aria-current={item.current ? 'page' : undefined}
                    >
                      {item.name}
                    </Disclosure.Button>
                  ))}
                </div>
                <div className="border-t border-gray-700 pb-3 pt-4">
                  <div className="flex items-center px-5">
                    <div className="flex-shrink-0">
                      <img className="h-10 w-10 rounded-full" src={user.imageUrl} alt="" />
                    </div>
                    <div className="ml-3">
                      <div className="text-base font-medium leading-none text-white">{user.name}</div>
                      <div className="text-sm font-medium leading-none text-gray-400">{user.email}</div>
                    </div>
                  </div>
                  <div className="mt-3 space-y-1 px-2">
                    {userNavigation.map((item) => (
                      <Disclosure.Button
                        key={item.name}
                        as="a"
                        href={item.href}
                        className="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white"
                      >
                        {item.name}
                      </Disclosure.Button>
                    ))}
                  </div>
                </div>
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>

        <header className="bg-white shadow">
          <div className="mx-auto px-4 py-6 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Dashboard</h1>
          </div>
        </header>
        <main>
          <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
            <Products products={productsData} handleAddToCart={handleAddToCart} />
          </div>
          <div>
            {cartOpen && <Cart 
            open={cartOpen} 
            setOpen={setCartOpen}
            cartItems={cartItems}
            setCartItems={setCartItems}
            jwtToken={jwtToken}
            />}
          </div>
          <div>
            {attendOpen && <Attendance 
            open={attendOpen} 
            setOpen={setAttendOpen}
            attendRecord={attendRecord}
            jwtToken={jwtToken}
            />}
          </div>
        </main>
      </div>
    </>
  )
}

export default Dashboard