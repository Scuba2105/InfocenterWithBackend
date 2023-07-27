import './App.css';
import { Menu } from './components/Menu';
import { MainArea } from './components/MainArea';
import { useState } from 'react';
import { QueryClient, QueryClientProvider} from 'react-query';
import { serverConfig } from './server';

// Create a client
const queryClient = new QueryClient();

export default function App() {

    const [page, setPage] = useState('staff');
    const [selectedEntry, setSelectedEntry] = useState('60146568');
              
    //Update the page selected when a new page in the menu is selected
    function onPageSelect(page) {
        const initialEntry = page === 'staff' ? '60146568' : page === 'technical-info' ? 'MX450' : null
        setSelectedEntry(initialEntry);
        setPage(page);
    }

    // Update the selected entry on selecting a row
    function onRowClick(e) {
        const row = e.target.parentNode;
        const entryIdentifier = row.children[0].textContent === '-' ? row.children[1].textContent : row.children[0].textContent
        setSelectedEntry(entryIdentifier);
    }
    
    return (
        <div className="wrapper">
            <div className="app-icon-container"></div>
            <div className="header-bar">HNECT Information Center</div>
            <Menu page={page} onPageSelect={onPageSelect} />
            <QueryClientProvider client={queryClient}>
                <MainArea page={page} selectedEntry={selectedEntry} onRowClick={onRowClick} queryClient={queryClient} />
            </QueryClientProvider>
            
        </div>
    );
}
