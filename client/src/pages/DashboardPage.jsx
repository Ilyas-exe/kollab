// Fichier: /client/src/pages/DashboardPage.jsx (Version finale corrigée)

import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

// Vue Freelancer (plus robuste)
const FreelancerView = ({ projects = [] }) => ( // On initialise "projects" à un tableau vide
    <div>
        <h1 className="text-3xl font-bold">My Assigned Projects</h1>
        <div className="mt-8 space-y-4">
            {projects.length > 0 ? (
                projects.map(proj => (
                    <Link 
                        to={`/projects/${proj._id}`}
                        key={proj._id} 
                        className="block p-4 bg-white rounded shadow hover:bg-gray-50 transition-colors"
                    >
                        <h3 className="font-bold text-gray-800">{proj.name}</h3>
                        {proj.workspaceId && <p className="text-sm text-gray-500">In Workspace: {proj.workspaceId.name}</p>}
                    </Link>
                ))
            ) : (
                <p>You have not been assigned to any projects yet.</p>
            )}
        </div>
    </div>
);

// Vue Client (pas de changement ici)
const ClientView = ({ workspaces = [], fetchWorkspaces }) => {
    const [newWorkspaceName, setNewWorkspaceName] = useState('');
    const { apiClient } = useAuth();

    const handleCreateWorkspace = async (e) => {
        e.preventDefault();
        if (!newWorkspaceName) return;
        try {
            await apiClient.post('/workspaces', { name: newWorkspaceName });
            setNewWorkspaceName('');
            fetchWorkspaces();
        } catch (error) {
            console.error("Failed to create workspace", error);
        }
    };

    return (
        <div>
            <h1 className="text-3xl font-bold">Your Workspaces</h1>
            <form onSubmit={handleCreateWorkspace} className="mt-8 mb-8 flex gap-2">
                <input 
                    type="text" 
                    value={newWorkspaceName}
                    onChange={(e) => setNewWorkspaceName(e.target.value)}
                    placeholder="New Workspace Name" 
                    className="p-2 border rounded flex-grow"
                />
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Create</button>
            </form>
            <div className="space-y-4">
                {workspaces.length > 0 ? (
                    workspaces.map(ws => (
                        <Link to={`/workspaces/${ws._id}`} key={ws._id} className="block p-4 bg-white rounded shadow hover:bg-gray-50">
                            <h3 className="font-bold text-gray-800">{ws.name}</h3>
                        </Link>
                    ))
                ) : (
                    <p>You don't have any workspaces yet. Create one!</p>
                )}
            </div>
        </div>
    );
};

// Composant Principal (entièrement revu)
const DashboardPage = () => {
    // ÉTAPE 1: Initialiser l'état avec un tableau vide pour éviter le crash
    const [data, setData] = useState([]); 
    const [loading, setLoading] = useState(true);
    const { apiClient, logout, user } = useAuth();

    // ÉTAPE 2: Améliorer la logique de chargement des données
    useEffect(() => {
        // Ne rien faire si l'objet 'user' n'est pas encore chargé
        if (!user || !user.role) {
            setLoading(false); // On peut arrêter de charger si on n'a pas d'utilisateur
            return;
        }

        const fetchData = async () => {
            let endpoint = '';
            // Choisir le bon endpoint en fonction du rôle
            if (user.role === 'Client') {
                endpoint = '/workspaces';
            } else if (user.role === 'Freelancer') {
                endpoint = '/projects/my-projects';
            }
            
            // Ne lancer la requête que si un endpoint a été défini
            if (endpoint) {
                try {
                    setLoading(true);
                    const { data } = await apiClient.get(endpoint);
                    setData(data);
                } catch (error) {
                    console.error("Failed to fetch data for dashboard", error);
                    // En cas d'erreur, on s'assure que 'data' reste un tableau vide
                    setData([]); 
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchData();
    }, [user, apiClient]); // Le useEffect se relancera si 'user' change (après le login)

    // Affiche un message de chargement tant que l'utilisateur n'est pas défini ou que les données chargent
    if (!user || loading) {
        return <div className="p-8">Loading dashboard...</div>;
    }

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-8">
                {/* On peut même personnaliser le message d'accueil ! */}
                <h2 className="text-2xl">Welcome, {user.name}</h2>
                <button onClick={logout} className="bg-red-500 text-white px-4 py-2 rounded">Logout</button>
            </div>
            
            {user.role === 'Client' && (
                <ClientView workspaces={data} fetchWorkspaces={() => { /* ... */}} />
            )}
            
            {user.role === 'Freelancer' && (
                <FreelancerView projects={data} />
            )}
        </div>
    );
};

export default DashboardPage;