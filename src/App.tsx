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

import { AdminProvider } from './context/AdminContext';

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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <AdminProvider>
      <Router>
        <div className="min-h-screen bg-gray-50 flex flex-col">
          <Navbar user={user} />
          <main className="flex-1 container mx-auto px-4 py-8 max-w-5xl">
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
  );
}
