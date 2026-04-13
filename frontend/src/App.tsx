import { Routes, Route } from 'react-router-dom';

// Pages wired in Phase 3+
function App() {
  return (
    <Routes>
      <Route path="/" element={<div>playlist_me — coming soon</div>} />
      <Route path="/callback" element={<div>Callback</div>} />
      <Route path="*" element={<div>404</div>} />
    </Routes>
  );
}

export default App;
