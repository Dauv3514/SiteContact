import {createRouter, createWebHistory} from "vue-router"
import HomeView from "../views/HomeView.vue"
import ContactsView from "../views/ContactsView.vue"
import EditContact from "@/components/EditContact.vue";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: "/",
            name: "home",
            component: HomeView
        },
        {
            path: "/contacts",
            name: "contacts",
            component: ContactsView
        },
        {
            path: "/contact/:id?",
            name: "editContact",
            component: EditContact
        }
    ]
})

export default router;