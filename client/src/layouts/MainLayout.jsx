// Fichier: /client/src/layouts/MainLayout.jsx
import { Outlet } from 'react-router-dom';
import Header from '../components/Header';

const MainLayout = () => {
  return (
    <div>
      <Header />
      <main>
        <Outlet /> {/* C'est ici que le contenu de vos pages s'affichera */}
      </main>
    </div>
  );
};

export default MainLayout;