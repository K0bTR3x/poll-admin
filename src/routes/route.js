import Dashboard from "../pages/Dashboard/Dashboard"
import Login from "../pages/Login/Login"
import Root from "../pages/Root"
import Error from '../pages/Error/Error'
import Events from "../pages/Events/Events"
const ROUTES = [{
    path: '/',
    element: <Root />,
    children: [{
        path: 'dashboard',
        element: <Dashboard />
    }, {
        path: '',
        element: <Login />
    }, {
        path: 'events',
        element: <Events />
    }, {
        path: "*",
        element: <Error />
    }
    ]
}]
export default ROUTES