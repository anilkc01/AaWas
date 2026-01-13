import { useState } from "react";
import Navbar from "../components/navBars/UserNavBar.jsx";
import BrowseProperties from "../pages/browseProperties.jsx";
import MyProperties from "../pages/myProperties.jsx";

export default function DashboardPage({ onLogout }) {
  const [view, setView] = useState("browse"); // "browse" | "my"

  return (
    <>
      <Navbar
        onLogout={onLogout}
        view={view}
        setView={setView}
      />

      <div className="pt-14 px-6">
        {view === "my" ? <MyProperties /> : <BrowseProperties />}
      </div>
    </>
  );
}
