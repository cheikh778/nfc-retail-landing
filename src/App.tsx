import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { DEFAULT_MARKET, MARKET_ROUTE_PATTERNS, ROUTES } from './lib/routes';
import { LegalPlaceholderPage } from './pages/LegalPlaceholderPage';
import { MerciPage } from './pages/MerciPage';
import { VisibilitePage } from './pages/VisibilitePage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to={ROUTES.visibilite(DEFAULT_MARKET)} replace />} />
        <Route path={MARKET_ROUTE_PATTERNS.visibilite} element={<VisibilitePage />} />
        <Route path={MARKET_ROUTE_PATTERNS.merci} element={<MerciPage />} />
        <Route
          path={MARKET_ROUTE_PATTERNS.mentionsLegales}
          element={<LegalPlaceholderPage title="Mentions légales" />}
        />
        <Route
          path={MARKET_ROUTE_PATTERNS.politiqueConfidentialite}
          element={<LegalPlaceholderPage title="Politique de confidentialité" />}
        />
        <Route path="*" element={<Navigate to={ROUTES.visibilite(DEFAULT_MARKET)} replace />} />
      </Routes>
    </BrowserRouter>
  );
}
