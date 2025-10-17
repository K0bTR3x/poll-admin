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

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Root />}>
        <Route index element={<Login />} />   {/* Login əsas səhifədir */}
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="events" element={<Events />} />
        <Route path="events/create" element={<EventCreate />} />
        <Route path="/events/edit/:id" element={<EventEdit />} />
        <Route path="/events/:id" element={<EventDetail />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};

export default App;
