import React from "react";
import { Routes, Route } from "react-router-dom";
import Root from "./pages/AppLayout";
import Dashboard from "./pages/Dashboard/Dashboard";
import Events from "./pages/Events/Events";
import EventCreate from "./pages/Events/EventCreate/EventCreate";
import NotFound from "./pages/NotFound/NotFound";
import Login from "./pages/Login/Login";
import EventDetail from "./pages/Events/Detail/EventDetail";
import EventEdit from "./pages/Events/Edit/EventEdit";
import ProtectedRoute from "./components/protectetRoute/protectetRoute";

// Yeni importlar
import Questions from "./pages/Questions/Questions";
import AddQuestion from "./pages/Questions/AddQuestion";

const App = () => {
  return (
    <Routes>
      {/* Login publicdir */}
      <Route path="/" element={<Login />} />

      {/* Qorunan routelar */}
      <Route element={<ProtectedRoute />}>
        <Route element={<Root />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="events" element={<Events />} />
          <Route path="events/create" element={<EventCreate />} />
          <Route path="events/edit/:id" element={<EventEdit />} />
          <Route path="events/:id" element={<EventDetail />} />

          {/* 🔹 Tədbirə aid suallar */}
          <Route path="events/:eventId/questions" element={<Questions />} />
          <Route path="events/:eventId/questions/add" element={<AddQuestion />} />
        </Route>
      </Route>

      {/* 404 səhifə */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default App;
