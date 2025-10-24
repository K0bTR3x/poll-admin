import React from "react";
import { Routes, Route } from "react-router-dom";
import Root from "./pages/AppLayout";
import Dashboard from "./pages/Dashboard/Dashboard";
import Meetings from "./pages/Meetings/Meetings";
import NotFound from "./pages/NotFound/NotFound";
import Login from "./pages/Login/Login";
import MeetingCreate from "./pages/Meetings/Meeting/MeetingCreate";
import MeetingDetail from "./pages/Meetings/Detail/MeetingDetail";
import MeetingEdit from "./pages/Meetings/Edit/MeetingEdit";
import ProtectedRoute from "./components/protectetRoute/protectetRoute";
import Questions from "./pages/Questions/Questions";
const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<Root />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="meetings" element={<Meetings />} />
          <Route path="meetings/create" element={<MeetingCreate />} />
          <Route path="meetings/edit/:id" element={<MeetingEdit />} />
          <Route path="meetings/:id" element={<MeetingDetail />} />
          <Route path="meetings/:meetingId/questions" element={<Questions />} />
        </Route>
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default App;
