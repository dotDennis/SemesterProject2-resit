import Navbar from "./Navbar";

export default function Layout({ children }) {
  return (
    <>
      <Navbar />
      <div className="content-wrapper bg-light">{children}</div>
      <footer className="bg-white text-dark py-4 text-center">
        <div>
          &copy; {new Date().getFullYear()} Copyright <strong>OneCoder</strong>
        </div>
      </footer>
    </>
  );
}
