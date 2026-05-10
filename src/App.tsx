/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from './lib/firebase';

// Pages (to be created)
import Home from './pages/Home';
import SubjectDetail from './pages/SubjectDetail';
import Quiz from './pages/Quiz';
import AddQuestion from './pages/AddQuestion';
import EditQuestion from './pages/EditQuestion';
import Navbar from './components/Navbar';
import SpaceBackground from './components/SpaceBackground';

import { AdminProvider } from './context/AdminContext';
import { ThemeProvider } from './context/ThemeContext';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#050510] relative overflow-hidden">
        <SpaceBackground />
        <div className="relative z-10 text-center">
          <div className="w-24 h-24 relative mb-6">
            <div className="absolute inset-0 border-t-4 border-violet-500 rounded-full animate-spin"></div>
            <div className="absolute inset-2 border-b-4 border-cyan-500 rounded-full animate-[spin_1.5s_linear_infinite_reverse]"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-4 h-4 bg-white rounded-full blur-[2px] animate-pulse"></div>
            </div>
          </div>
          <h2 className="text-2xl font-bold tracking-widest text-[#FFFFFF] uppercase glow-text animate-pulse">Initializing Knowledge Engine</h2>
          <p className="text-cyan-400 text-xs mt-2 font-mono uppercase tracking-[0.3em]">Connecting to Cosmic Database...</p>
        </div>
      </div>
    );
  }

  return (
    <ThemeProvider>
      <AdminProvider>
        <Router>
          <div className="min-h-screen flex flex-col transition-colors duration-300 relative">
            <SpaceBackground />
            <Navbar user={user} />
            <main className="flex-1 container mx-auto px-4 py-8 max-w-6xl relative z-10">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route 
                path="/subject/:id" 
                element={user ? <SubjectDetail /> : <Navigate to="/" />} 
              />
              <Route 
                path="/quiz/:id" 
                element={user ? <Quiz /> : <Navigate to="/" />} 
              />
              <Route 
                path="/add/:id" 
                element={user ? <AddQuestion /> : <Navigate to="/" />} 
              />
              <Route 
                path="/edit/:subjectId/:questionId" 
                element={user ? <EditQuestion /> : <Navigate to="/" />} 
              />
            </Routes>
          </main>
        </div>
      </Router>
      </AdminProvider>
    </ThemeProvider>
  );
}
