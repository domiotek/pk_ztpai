import React from 'react';
import ReactDOM from 'react-dom/client';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import App  from './App';
import Portal from "./pages/Portal/Portal";
import Logout from "./pages/Logout/Logout";

import "./index.css";
import MainLayout from './pages/MainLayout/MainLayout';
import NewGroup from './pages/NewGroup/NewGroup';
import Dashboard from './pages/Dashboard/Dashboard';
import Items from './pages/Items/Items';
import Group from './pages/Group/Group';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import Invite from './pages/Invite/Invite';


const Login = React.lazy(()=>import('./pages/Login/Login'));
const Register = React.lazy(()=>import('./pages/Register/Register'));

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const qClient = new QueryClient();

root.render(
  <React.StrictMode>
		<QueryClientProvider client={qClient}>
			<BrowserRouter>
				<Routes>
					<Route path="*"element={<App />}>
						<Route path="*" element={<MainLayout />}>
							<Route path="dashboard" element={<Dashboard />}/>
							<Route index element={<Dashboard />}/>
							<Route path="items" element={<Items />} />
							<Route path='group' element={<Group />} />
						</Route>
						<Route path="new" element={<NewGroup />}/>
					</Route>
					<Route path="/login" element={<Portal />}>
						<Route index element={<Login />} />
					</Route>

					<Route path="/register" element={<Portal />}>
						<Route index element={<Register />} />
					</Route>

					<Route path='/logout' element={<Portal />}>
						<Route index element={<Logout />} />
					</Route>

					<Route path="/invite" element={<Portal />}>
						<Route index element={<Invite />} />
					</Route>
				</Routes>
			</BrowserRouter>
			<ReactQueryDevtools initialIsOpen={false} />
		</QueryClientProvider>
  </React.StrictMode>
);
