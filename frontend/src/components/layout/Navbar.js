import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import ThemeToggle from '../theme/ThemeToggle';

const Navbar = () => {
	const location = useLocation();

	return (
		<nav className='navbar bg-primary-700 text-white p-3 shadow-md'>
			<div className='container mx-auto flex items-center justify-between'>
				<div className='flex items-center'>
					<h1 className='logo text-xl text-white font-bold mr-8'>
						<Link to='/'>Duty Roster</Link>
					</h1>
					<ul className='flex space-x-6'>
						<li>
							<Link
								to='/'
								className={`hover:text-primary-200 transition-colors ${
									location.pathname === '/'
										? 'text-white font-medium border-b-2 border-white pb-1'
										: 'text-primary-100'
								}`}
							>
								Dashboard
							</Link>
						</li>
						<li>
							<Link
								to='/calendar'
								className={`hover:text-primary-200 transition-colors ${
									location.pathname === '/calendar'
										? 'text-white font-medium border-b-2 border-white pb-1'
										: 'text-primary-100'
								}`}
							>
								Calendar
							</Link>
						</li>
						<li>
							<Link
								to='/people'
								className={`hover:text-primary-200 transition-colors ${
									location.pathname === '/people'
										? 'text-white font-medium border-b-2 border-white pb-1'
										: 'text-primary-100'
								}`}
							>
								People
							</Link>
						</li>
						<li>
							<Link
								to='/duties'
								className={`hover:text-primary-200 transition-colors ${
									location.pathname === '/duties'
										? 'text-white font-medium border-b-2 border-white pb-1'
										: 'text-primary-100'
								}`}
							>
								Duties
							</Link>
						</li>
						<li>
							<Link
								to='/admin'
								className={`hover:text-primary-200 transition-colors ${
									location.pathname === '/admin'
										? 'text-white font-medium border-b-2 border-white pb-1'
										: 'text-primary-100'
								}`}
							>
								Admin
							</Link>
						</li>
					</ul>
				</div>
				<ThemeToggle />
			</div>
		</nav>
	);
};

export default Navbar;
