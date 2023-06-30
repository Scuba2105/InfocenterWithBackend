import './App.css';
import { Menu } from './components/Menu';
import { MainArea } from './components/MainArea';
import { useState } from 'react';
import { staffData } from "./staff-data";
import { QueryClient, QueryClientProvider} from 'react-query';

// Create a client
const queryClient = new QueryClient();

export default function App() {

    const [page, setPage] = useState('staff');
              
    //Update the page selected when a new page in the menu is selected
    function onPageSelect(page) {
        setPage(page);
    }
    
    return (
        <div className="wrapper">
            <div className="app-icon"></div>
            <div className="header-bar">HNECT Information Center</div>
            <Menu page={page} onPageSelect={onPageSelect} />
            <QueryClientProvider client={queryClient}>
                <MainArea page={page} />
            </QueryClientProvider>
            
        </div>
    );
}
