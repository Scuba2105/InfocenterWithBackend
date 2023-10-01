import './App.css';
import { useEffect } from 'react'
import { Menu } from './components/Menu';
import { MainArea } from './components/MainArea';
import { useState } from 'react';
import { QueryClient, QueryClientProvider} from 'react-query';
import { Login } from './components/Login';
import { useLoggedIn, useDevice } from './components/StateStore';
import { Avatar } from './components/Avatar';
import ErrorBoundary from './components/ErrorBoundary';
import { ErrorPage } from './components/ErrorPage';

// Create a client
const queryClient = new QueryClient();

export default function App() {

    const [page, setPage] = useState('staff');
    const [selectedEntry, setSelectedEntry] = useState('60146774');
    
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogMessage, setDialogMessage] = useState({type: "info", message: ""});
    
    // Get loggedIn state from Zustand state
    const loggedIn = useLoggedIn((state) => state.loggedIn);
    const initialDevice = useDevice((state) => state.device);
    
    // Get the state setter for selected device from Zustand state
    const setCurrentDevice = useDevice((state) => state.setDevice);

    useEffect(() => {
        if (loggedIn) {
            const sessionData = sessionStorage.getItem("currentInfoCentreSession");
            const currentSessionData = JSON.parse(sessionData);
            setSelectedEntry(currentSessionData.staffId);
        }
    }, [loggedIn])

    //Update the page selected when a new page in the menu is selected
    function onPageSelect(page) {
        const sessionData = sessionStorage.getItem("currentInfoCentreSession");
        const currentSessionData = JSON.parse(sessionData);
        const initialEntry = page === 'staff' ? currentSessionData.staffId : page === 'technical-info' ? initialDevice : null;
        setSelectedEntry(initialEntry);
        setPage(page);
    }

    // Update the selected entry on selecting a row
    function onRowClick(e) {
        const row = e.target.parentNode;
        const entryIdentifier = row.children[0].textContent === '-' ? row.children[1].textContent : row.children[0].textContent
        if (page === 'technical-info') {
            setSelectedEntry(entryIdentifier);
            setCurrentDevice(entryIdentifier);
        }
        else {
            setSelectedEntry(entryIdentifier);
        } 
    }

    function closeDialog() {
        setDialogOpen(false);
    };
    
    function showMessage(dialogType, message) {
        setDialogMessage({type: dialogType, message: message});
        setDialogOpen(true);
    }

    if (!loggedIn) {
        return (
           <Login></Login> 
        )
    }

    return (
        <ErrorBoundary children fallback={ErrorPage}>
            <div className="wrapper">
                <div className="app-icon-container"></div>
                <div className="header-bar">
                    <div id='header-aligner'></div>
                    HNECT Information Center
                    <Avatar showMessage={showMessage} closeDialog={closeDialog}></Avatar>
                </div>
                <Menu page={page} onPageSelect={onPageSelect} />
                <QueryClientProvider client={queryClient}>
                    <MainArea page={page} setPage={setPage} selectedEntry={selectedEntry} dialogOpen={dialogOpen} dialogMessage={dialogMessage} closeDialog={closeDialog} showMessage={showMessage} onRowClick={onRowClick} queryClient={queryClient} />
                </QueryClientProvider>
            </div>
        </ErrorBoundary>
    );
}
