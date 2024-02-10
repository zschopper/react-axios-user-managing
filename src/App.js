import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './pages/Layout';
import UserCards from './pages/UserCards';
import UserList from './pages/UserList';
import NoPage from './pages/NoPage';
import DataService from './model/DataService';

const ds = new DataService("http://127.0.0.1:8000/api");

export default function App() {
  return (
    <div className="container">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<UserCards dataService={ds}/>} />
            <Route path="user-list" element={<UserList dataService={ds}/>} />
            <Route path="*" element={<NoPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}
