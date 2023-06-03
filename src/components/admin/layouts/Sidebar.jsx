import { Fragment, useState, useEffect } from 'react'
import { Dialog, Menu, Transition } from '@headlessui/react'
import {
  Bars3Icon,
  ChartPieIcon,
  Cog6ToothIcon,
  DocumentDuplicateIcon,
  HomeModernIcon,
  Squares2X2Icon,
  StarIcon,
  UserGroupIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'
import { ChevronDownIcon, MagnifyingGlassIcon } from '@heroicons/react/20/solid'
import Image from 'next/image';
import logo from '/src/images/logos/logo.png';
import { useRouter } from "next/router";
import LocaleSwitcher from "./locale-switcher";
import { useTranslation } from "next-i18next";
import Link from "next/link";


// const teams = [
//   { id: 1, name: 'Help', href: '#', initial: '?', current: false },
//   { id: 2, name: 'Tailwind Labs', href: '#', initial: 'T', current: false },
//   { id: 3, name: 'Workcation', href: '#', initial: 'W', current: false },
// ]

const userNavigation = [
  { name: 'Your profile', href: '#' },
  { name: 'Sign out', href: '#' },
]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function Sidebar({children}) {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const router = useRouter();
    const { t } = useTranslation("");
    
    const userImage = "/images/users/avatar-4.png";

    useEffect(() => {
      let dir = router.locale == "mm" ? "mm" : "mm";
      let lang = router.locale == "mm" ? "mm" : "en";
      document.querySelector("html").setAttribute("dir", dir);
      document.querySelector("html").setAttribute("lang", lang);
    }, [router.locale]);
    
    const navigation = [
      { name: t('sidebar.Dashboard'), href: '/admin/dashboard', icon: Squares2X2Icon },
      { name: t('sidebar.Households'), href: '/admin/households', icon: HomeModernIcon },
      { name: t('sidebar.Families'), href: '/admin/families', icon: UserGroupIcon },
      { name: t('sidebar.Deaths'), href: '/admin/deaths', icon: DocumentDuplicateIcon },
      { name: t('sidebar.Disabilities'), href: '/admin/disabilities', icon: StarIcon },
      { name: t('sidebar.Reports'), href: '/admin/reports', icon: ChartPieIcon },
    ];

    return (
      <>
        {/*
          This example requires updating your template:
  
          ```
          <html class="h-full bg-white">
          <body class="h-full">
          ```
        */}
        <div>
          <Transition.Root show={sidebarOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50 lg:hidden" onClose={setSidebarOpen}>
              <Transition.Child
                as={Fragment}
                enter="transition-opacity ease-linear duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="transition-opacity ease-linear duration-300"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <div className="fixed inset-0 bg-gray-900/80" />
              </Transition.Child>
  
              <div className="fixed inset-0 flex">
                <Transition.Child
                  as={Fragment}
                  enter="transition ease-in-out duration-300 transform"
                  enterFrom="-translate-x-full"
                  enterTo="translate-x-0"
                  leave="transition ease-in-out duration-300 transform"
                  leaveFrom="translate-x-0"
                  leaveTo="-translate-x-full"
                >
                  <Dialog.Panel className="relative flex flex-1 w-full max-w-xs mr-16">
                    <Transition.Child
                      as={Fragment}
                      enter="ease-in-out duration-300"
                      enterFrom="opacity-0"
                      enterTo="opacity-100"
                      leave="ease-in-out duration-300"
                      leaveFrom="opacity-100"
                      leaveTo="opacity-0"
                    >
                      <div className="absolute top-0 flex justify-center w-16 pt-5 left-full">
                        <button type="button" className="-m-2.5 p-2.5" onClick={() => setSidebarOpen(false)}>
                          <span className="sr-only">Close sidebar</span>
                          <XMarkIcon className="w-6 h-6 text-white" aria-hidden="true" />
                        </button>
                      </div>
                    </Transition.Child>
                    {/* Sidebar component, swap this element with another sidebar if you like */}
                    <div className="flex flex-col px-6 pb-4 overflow-y-auto bg-sky-600 grow gap-y-5">
                      <div className="flex items-center h-16 shrink-0">
                        <Image 
                            className="w-auto h-10"
                            src={logo} 
                            alt="Logo" 
                        />
                        <span className='px-2 font-semibold text-left text-white'>{t("sidebar.VIMS")}</span>
                      </div>
                      <nav className="flex flex-col flex-1">
                        <ul role="list" className="flex flex-col flex-1 gap-y-7">
                          <li>
                            <ul role="list" className="-mx-2 space-y-1">
                              {navigation.map((item) => (
                                <li key={item.name} className={item.href === router.asPath ? 'active' : ''}>
                                  <Link href={`/${router.locale}${item.href}`}
                                    className={classNames(
                                      item.href === router.asPath ? 'bg-sky-700 text-white' : 'text-sky-200 hover:text-white hover:bg-sky-700',
                                      'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'
                                    )}
                                  >
                                    <item.icon
                                      className={classNames(
                                        item.href === router.asPath ? 'text-white' : 'text-sky-200 group-hover:text-white',
                                        'h-6 w-6 shrink-0'
                                      )}
                                      aria-hidden="true"
                                    />
                                    {item.name}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </li>
                          {/* <li>
                            <div className="text-xs font-semibold leading-6 text-sky-200">Your teams</div>
                            <ul role="list" className="mt-2 -mx-2 space-y-1">
                              {teams.map((team) => (
                                <li key={team.name}>
                                  <a
                                    href={team.href}
                                    className={classNames(
                                      team.current
                                        ? 'bg-sky-700 text-white'
                                        : 'text-sky-200 hover:text-white hover:bg-sky-700',
                                      'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'
                                    )}
                                  >
                                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-sky-400 bg-sky-500 text-[0.625rem] font-medium text-white">
                                      {team.initial}
                                    </span>
                                    <span className="truncate">{team.name}</span>
                                  </a>
                                </li>
                              ))}
                            </ul>
                          </li> */}
                          <li className="mt-auto">
                            <a
                              href="#"
                              className="flex p-2 -mx-2 text-sm font-semibold leading-6 rounded-md text-sky-200 group gap-x-3 hover:bg-sky-700 hover:text-white"
                            >
                              <Cog6ToothIcon
                                className="w-6 h-6 text-sky-200 shrink-0 group-hover:text-white"
                                aria-hidden="true"
                              />
                              Settings
                            </a>
                          </li>
                        </ul>
                      </nav>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </Dialog>
          </Transition.Root>
  
          {/* Static sidebar for desktop */}
          <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
            {/* Sidebar component, swap this element with another sidebar if you like */}
            <div className="flex flex-col px-6 pb-4 overflow-y-auto bg-sky-600 grow gap-y-5">
              <div className="flex items-center h-16 shrink-0">
                  <Image 
                      className="w-auto h-10"
                      src={logo} 
                      alt="Logo" 
                  />
                  <span className='px-2 text-sm font-semibold text-left text-white'>{t("sidebar.VIMS")}</span>
              </div>
                {/* Web */}
              <nav className="flex flex-col flex-1">
                <ul role="list" className="flex flex-col flex-1 gap-y-7">
                  <li>
                    <ul role="list" className="-mx-2 space-y-1">
                      {navigation.map((item) => (
                        <li key={item.name} className={item.href === router.asPath ? 'active' : ''}>
                          <Link href={`/${router.locale}${item.href}`}
                            className={classNames(
                              item.href === router.asPath ? 'bg-sky-700 text-white' : 'text-sky-200 hover:text-white hover:bg-sky-700',
                              'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'
                            )}
                          >
                            <item.icon
                              className={classNames(
                                item.href === router.asPath ? 'text-white' : 'text-sky-200 group-hover:text-white',
                                'h-6 w-6 shrink-0'
                              )}
                              aria-hidden="true"
                            />
                            {item.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </li>
                  {/* <li>
                    <div className="text-xs font-semibold leading-6 text-sky-200">Your teams</div>
                    <ul role="list" className="mt-2 -mx-2 space-y-1">
                      {teams.map((team) => (
                        <li key={team.name}>
                          <a
                            href={team.href}
                            className={classNames(
                              team.current
                                ? 'bg-sky-700 text-white'
                                : 'text-sky-200 hover:text-white hover:bg-sky-700',
                              'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'
                            )}
                          >
                            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-sky-400 bg-sky-500 text-[0.625rem] font-medium text-white">
                              {team.initial}
                            </span>
                            <span className="truncate">{team.name}</span>
                          </a>
                        </li>
                      ))}
                    </ul>
                  </li> */}
                  <li className="mt-auto">
                    <a
                      href="#"
                      className="flex p-2 -mx-2 text-sm font-semibold leading-6 rounded-md text-sky-200 group gap-x-3 hover:bg-sky-700 hover:text-white"
                    >
                      <Cog6ToothIcon
                        className="w-6 h-6 text-sky-200 shrink-0 group-hover:text-white"
                        aria-hidden="true"
                      />
                      Settings
                    </a>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
  
          <div className="lg:pl-72">
            <div className="sticky top-0 z-40 flex items-center h-16 px-4 bg-white border-b border-gray-200 shadow-sm shrink-0 gap-x-4 sm:gap-x-6 sm:px-6 lg:px-8">
              <button type="button" className="-m-2.5 p-2.5 text-gray-700 lg:hidden" onClick={() => setSidebarOpen(true)}>
                <span className="sr-only">Open sidebar</span>
                <Bars3Icon className="w-6 h-6" aria-hidden="true" />
              </button>
  
              {/* Separator */}
              <div className="w-px h-6 bg-gray-900/10 lg:hidden" aria-hidden="true" />
  
              <div className="flex self-stretch flex-1 gap-x-4 lg:gap-x-6">
                <form className="relative flex flex-1" action="#" method="GET">
                  <label htmlFor="search-field" className="sr-only">
                    Search
                  </label>
                  <MagnifyingGlassIcon
                    className="absolute inset-y-0 left-0 w-5 h-full text-gray-400 pointer-events-none"
                    aria-hidden="true"
                  />
                  <input
                    id="search-field"
                    className="block w-full h-full py-0 pl-8 pr-0 text-gray-900 border-0 placeholder:text-gray-400 focus:ring-0 sm:text-sm"
                    placeholder="Search..."
                    type="search"
                    name="search"
                  />
                </form>
                <div className="flex items-center gap-x-4 lg:gap-x-6">
                  {/* <button type="button" className="-m-2.5 p-2.5 text-gray-400 hover:text-gray-500">
                    <span className="sr-only">View notifications</span>
                    <BellIcon className="w-6 h-6" aria-hidden="true" />
                  </button> */}
                  {/* Language */}
                  <LocaleSwitcher/>
                  {/* Language flags */}
                  {/* <div className="flex items-center gap-x-2">
                    <button type="button" className="-m-2.5 p-2.5 text-gray-400 hover:text-gray-500">
                      <img
                        className="w-6 h-6 rounded-full"
                        src="/src/images/flags/mm.png"
                        alt="English"
                      />
                    </button>
                    <button type="button" className="-m-2.5 p-2.5 text-gray-400 hover:text-gray-500">
                      <img
                        className="w-6 h-6 rounded-full"
                        src="/src/images/flags/en.png"
                        alt="Myanmar"
                      />
                    </button>
                  </div> */}
  
                  {/* Separator */}
                  <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-900/10" aria-hidden="true" />
  
                  {/* Profile dropdown */}
                  <Menu as="div" className="relative">
                    <Menu.Button className="-m-1.5 flex items-center p-1.5">
                      <span className="sr-only">Open user menu</span>
                      <Image
                        className="w-8 h-8 rounded-full bg-gray-50"
                        src={userImage}
                        alt="userImage"
                        width={50} // Specify the actual width of the image
                        height={50} // Specify the actual height of the image
                      />
                      <span className="hidden lg:flex lg:items-center">
                        <span className="ml-4 text-sm font-semibold leading-6 text-gray-900" aria-hidden="true">
                          {t("other.Admin")}
                        </span>
                        <ChevronDownIcon className="w-5 h-5 ml-2 text-gray-400" aria-hidden="true" />
                      </span>
                    </Menu.Button>
                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items className="absolute right-0 z-10 mt-2.5 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
                        {userNavigation.map((item) => (
                          <Menu.Item key={item.name}>
                            {({ active }) => (
                              <a
                                href={item.href}
                                className={classNames(
                                  active ? 'bg-gray-50' : '',
                                  'block px-3 py-1 text-sm leading-6 text-gray-900'
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
            </div>
  
            <main className="py-10">
              <div className="px-4 sm:px-6 lg:px-8">{children}</div>
            </main>
          </div>
        </div>
      </>
    )
}