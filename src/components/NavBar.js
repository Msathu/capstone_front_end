import React, { Fragment } from 'react';
import { Popover, Transition } from '@headlessui/react';
import { MenuIcon, XIcon } from '@heroicons/react/outline';
import { Link } from 'react-scroll';

import config from '../config/index.json';

const NavBar = () => {
  const { navigation, company, callToAction } = config;
  const { name: companyName, logo } = company;

  return (
    <Popover>
      <div className="relative pt-6 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <nav className="relative flex items-center justify-between sm:h-10 lg:justify-start" aria-label="Global">
          <div className="flex items-center flex-grow flex-shrink-0 lg:flex-grow-0">
            <div className="flex items-center justify-between w-full md:w-auto">
              <a href="/">
                <span className="sr-only">{companyName}</span>
                <img alt="logo" className="h-16 w-auto sm:h-16" src={logo} />
              </a>
              <div className="-mr-2 flex items-center md:hidden">
                <Popover.Button
                  className="bg-background rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-secondary"
                >
                  <span className="sr-only">Open main menu</span>
                  <MenuIcon className="h-6 w-6" aria-hidden="true" />
                </Popover.Button>
              </div>
            </div>
          </div>
          <div className="hidden md:block md:ml-10 md:pr-4 md:space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                spy={true}
                smooth={true}
                duration={1000}
                to={item.href}
                className="font-medium text-gray-500 hover:text-gray-900"
              >
                {item.name}
              </Link>
            ))}
            <a href={callToAction.href} className="font-medium text-primary hover:text-secondary">
              {callToAction.text}
            </a>
          </div>
        </nav>
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-200"
        enterFrom="opacity-0 scale-95"
        enterTo="opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="opacity-100 scale-100"
        leaveTo="opacity-0 scale-95"
      >
        <Popover.Panel
          focus
          className="fixed inset-0 z-50 overflow-y-auto bg-gray-100" // Adjust bg-gray-100 to your desired drawer background color
        >
          <div className="flex flex-col h-full justify-between">
            <div className="px-4 py-6">
              <div className="flex items-center justify-between mb-8">
                <a href="#">
                  <img className="h-8 w-auto" src={logo} alt={companyName} />
                </a>
                <div className="-mr-2">
                  <Popover.Button
                    className="rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-secondary"
                  >
                    <span className="sr-only">Close main menu</span>
                    <XIcon className="h-6 w-6" aria-hidden="true" />
                  </Popover.Button>
                </div>
              </div>
              <div className="space-y-4">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    spy={true}
                    smooth={true}
                    duration={1000}
                    to={item.href}
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
            <div className="px-4 py-4">
              <a
                href={callToAction.href}
                className="block w-full px-5 py-3 text-center font-medium text-primary bg-gray-50 hover:bg-gray-100 rounded-md"
              >
                {callToAction.text}
              </a>
            </div>
          </div>
        </Popover.Panel>
      </Transition>
    </Popover>
  );
};

export default NavBar;
