import './App.css';
import { useEffect } from 'react';
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
    
    // Get the state setter for last selected medical device in Technical Info.  
    const setCurrentDevice = useDevice((state) => state.setDevice);

    // Get the current session data if the browser is refreshed during the current session to prevent logging in again.
    useEffect(() => {
        if (loggedIn) {
            const sessionData = sessionStorage.getItem("currentInfoCentreSession");
            const currentSessionData = JSON.parse(sessionData);
            setSelectedEntry(currentSessionData.staffId);
        }
    }, [loggedIn])

    // Dynamically import the christmas theme CSS if it is December.
    useEffect(() => {
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth();
        if (currentMonth === 11) {
            import ("./Christmas-Theme.css");
        }
    }, [])

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

    const date = new Date();
    const month = date.getMonth();

    return (
        <ErrorBoundary children fallback={ErrorPage}>
            <div className="wrapper">
                <div className="app-icon-container"></div>
                <div className={month === 11 ? "header-bar-christmas flex-c" : "header-bar flex-c"}>
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
