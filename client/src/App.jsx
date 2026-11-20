import Navbar from './components/Navbar.jsx';
import AppRoutes from './routes/AppRoutes.jsx';

function App() {
  return (
    <>
      <Navbar />
      <main className="container">
        <AppRoutes />
      </main>
      <footer className="footer">LearnHub &copy; 2026 | MERN Stack Final Project</footer>
    </>
  );
}

export default App;
