import {createRouter, createWebHistory} from 'vue-router'
import Todos from '../views/Todos'
import Options from '../views/Options'
import Improvements from '../views/Improvements'
import Requests from '../views/Requests'
import Ethan from '../views/Ethan'
import Clearsky from '../views/Clearsky'
import Birthdays from '../views/Birthdays'
import Events from '../views/Events'
import Addresses from '../views/Addresses'
import Tracker from '../views/Tracker'

const routes = [
    {
        path: '/',
        name: 'Options',
        component: Options
    },
    {
        path: '/todos',
        name: 'Todos',
        component: Todos
    },{
        path: '/improvements',
        name: 'Improvements',
        component: Improvements
    },
    {
        path: '/requests',
        name: 'requests',
        component: Requests
    },
    {
        path: '/ethan',
        name: 'ethan',
        component: Ethan
    },
    {
        path: '/clearsky',
        name: 'clearsky',
        component: Clearsky
    },
    {
        path: '/birthdays',
        name: 'birthdays',
        component: Birthdays
    },
    {
        path: '/events',
        name: 'events',
        component: Events
    },{
        path: '/addresses',
        name: 'addresses',
        component: Addresses
    },{
        path: '/tracker',
        name: 'Tracker',
        component: Tracker
    }
    
]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
})

export default router