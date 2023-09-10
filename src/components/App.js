import React from 'react';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import AppShell from './AppShell';
import Home from './Home';
import Texts from './Texts';
import Words from './Words';

class App extends React.Component {
    render() {
        return (
            <Router>
                <AppShell>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/texts" element={<Texts />} />
                        <Route path="/words" element={<Words />} />
                    </Routes>
                </AppShell>
            </Router>
        );
    }
}

export default App;