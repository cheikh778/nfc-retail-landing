import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { ROUTES } from './lib/routes';
import { LegalPlaceholderPage } from './pages/LegalPlaceholderPage';
import { MerciPage } from './pages/MerciPage';
import { VisibilitePage } from './pages/VisibilitePage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to={ROUTES.visibilite} replace />} />
        <Route path={ROUTES.visibilite} element={<VisibilitePage />} />
        <Route path={ROUTES.merci} element={<MerciPage />} />
        <Route
          path={ROUTES.mentionsLegales}
          element={<LegalPlaceholderPage title="Mentions légales" />}
        />
        <Route
          path={ROUTES.politiqueConfidentialite}
          element={<LegalPlaceholderPage title="Politique de confidentialité" />}
        />
        <Route path="*" element={<Navigate to={ROUTES.visibilite} replace />} />
      </Routes>
    </BrowserRouter>
  );
}
