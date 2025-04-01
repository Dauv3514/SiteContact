import {createRouter, createWebHistory} from "vue-router"
import HomeView from "../views/HomeView.vue"
import ContactsView from "../views/ContactsView.vue"
import LoginView from "@/views/LoginView.vue"
import RegisterView from "@/views/RegisterView.vue"
import EditContact from "@/components/EditContact.vue"
import Chat from "@/components/Chat.vue"
import GetFavoris from "@/views/FavorisView.vue"

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: "/",
            name: "home",
            component: HomeView
        },
        {
            path: "/connexion",
            name: "connexion",
            component: LoginView
        },
        {
            path: "/inscription",
            name: "inscription",
            component: RegisterView
        },
        {
            path: "/contacts",
            name: "contacts",
            component: ContactsView
        },
        {
            path: "/contact/:id",
            name: "editContact",
            component: EditContact
        },
        {
            path: "/favoris",
            name: "getFavoris",
            component: GetFavoris
        },
        {
            path: "/chat",
            name: "chat",
            component: Chat
        },
    ]
})

export default router;