import { Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { Link } from 'react-router-dom';

export default function Attendance({open, setOpen, attendRecord, jwtToken}) {

    const checkTodayAttend = ()=> {
      if(attendRecord.length===0) return false;
      else {
        const formattedDate = attendRecord[0].split(', ')[0];
        const today = new Date().toLocaleString().split(', ')[0];
        if(today === formattedDate) return true;
        else return false;
      }
    }

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={setOpen}>
        <Transition.Child
          as={Fragment}
          enter="ease-in-out duration-500"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-500"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                  <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                    <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                      <div className="flex items-start justify-between">
                        <Dialog.Title className="text-lg font-medium text-gray-900">Attendance Record</Dialog.Title>
                        <div className="ml-3 flex h-7 items-center">
                          <button
                            type="button"
                            className="relative -m-2 p-2 text-gray-400 hover:text-gray-500"
                            onClick={() => setOpen(false)}
                          >
                            <span className="absolute -inset-0.5" />
                            <span className="sr-only">Close panel</span>
                            <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                          </button>
                        </div>
                      </div>

                      <div className="mt-8">
                        <div className="flow-root">
                          {attendRecord.length === 0? <p>Mark Your First Attendance</p> :
                          <ul role="list" className="divide-y divide-gray-300">
                          {attendRecord.map((record, index) => (
                            <li key={index} className="flex rounded justify-between gap-x-6 py-5 ">
                              <div className="flex min-w-0">
                                <p className="text-lg font-semibold leading-6 text-gray-900">{record.toLocaleString()}</p>
                              </div>
                            </li>
                          ))}
                        </ul>}
                        </div>
                      </div>
                    </div>

                    <div className="border-t text-center border-gray-200 px-4 py-6 sm:px-6">
                      {checkTodayAttend()?
                        <h3>Today's Attendance is done.</h3> :
                        <div>
                          <p className="mt-0.5 text-sm text-gray-500">Mark Your Today's Attendance</p>
                          <div className="mt-6">
                            <Link
                              to='/attendance'
                              className="flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700"
                            >
                              Mark Attendance
                            </Link>
                          </div>
                        </div>}
                      <div className="mt-6 flex justify-center text-center text-sm text-gray-500">
                      <button
                            type="button"
                            className="font-medium text-indigo-600 hover:text-indigo-500"
                            onClick={() => setOpen(false)}
                          >
                            Continue Shopping
                            <span aria-hidden="true"> &rarr;</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}