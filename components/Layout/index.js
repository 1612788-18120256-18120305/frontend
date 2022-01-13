import Navbar from './Navbar.js';
import Sidebar from './Sidebar.js';
import Footer from '../Footer';

export default function Layout({ children, active, url }) {
  return (
    <>
      <div className="hidden md:block">
        <div className="flex ">
          <div className="min-w-1/4">
            <Sidebar active={active} />
          </div>
          <div className="min-w-3/4 w-full">
            <Navbar active={active} url={url} />
            <div className="flex justify-center">
              <div className="min-h-screen w-full p-5">{children}</div>
            </div>
          </div>
        </div>
      </div>
      <div className="block md:hidden">
        <Navbar />
        <div className="flex justify-center">
          <div className="min-h-screen w-full p-5">{children}</div>
        </div>
      </div>
      {/* <Footer /> */}
    </>
  );
}
