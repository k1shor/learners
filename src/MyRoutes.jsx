import { BrowserRouter, Route, Routes } from "react-router-dom";
import Homepage from "./pages/Homepage";
import SectionPage from "./pages/SectionPage";
import Layout from "./components/layout/Layout";

const MyRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Homepage />} />
          <Route path="tasks" element={<SectionPage title="Tasks" />} />
          <Route
            path="certificates"
            element={<SectionPage title="Certificates" />}
          />
          <Route path="referrals" element={<SectionPage title="Referrals" />} />
          <Route path="payments" element={<SectionPage title="Payments" />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default MyRoutes;
