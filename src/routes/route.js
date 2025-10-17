import Dashboard from "../pages/Dashboard/Dashboard";
import Login from "../pages/Login/Login";
import Root from "../pages/Root";
import Error from "../pages/Error/Error";
import Events from "../pages/Events/Events";
import EventCreate from "../pages/Events/EventCreate/EventCreate"; // əlavə et

const ROUTES = [
    {
        path: '/',
        element: <Root />,
        children: [
            {
                path: 'dashboard',
                element: <Dashboard />
            },
            {
                path: '',
                element: <Login />
            },
            {
                path: 'events',
                element: <Events /> // parent state və darkMode prop əlavə etməyi unutma
            },
            {
                path: 'events/create',
                element: <EventCreate /> // darkMode və addEvent prop-larını əlavə et
            },
            {
                path: "*",
                element: <Error />
            }
        ]
    }
];

export default ROUTES;
