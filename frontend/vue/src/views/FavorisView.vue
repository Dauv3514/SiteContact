<script setup>
    import Header from "../components/Header.vue";
    import ContactList from "../components/ContactList.vue";
    import axios from "axios";
    import { ref, watch } from "vue";
    import CLipLoader from "vue-spinner/src/ClipLoader.vue";
    import { useToast } from "vue-toastification";
    import { useAuthStore } from "../stores/auth.js";

    const apiUrl = "http://localhost:3000/api/favoris";
    const authStore = useAuthStore();

    const toast = useToast();
    const contacts = ref([]);
    const loading = ref(true);

    const fakeContacts = [
    { id: 1, name: "Jean Dupont", email: "jean.dupont@example.com", phone: "123456789", designation: "Développeur", group_name: "Amis" },
    { id: 2, name: "Marie Curie", email: "marie.curie@example.com", phone: "987654321", designation: "Scientifique", group_name: "Famille" },
    { id: 3, name: "Albert Einstein", email: "albert.einstein@example.com", phone: "456123789", designation: "Physicien", group_name: "Collègues" },
    { id: 4, name: "Isaac Newton", email: "isaac.newton@example.com", phone: "321654987", designation: "Mathematique", group_name: "Réseau pro" },
    { id: 5, name: "Charles Darwin", email: "charles.darwin@example.com", phone: "654987321", designation: "Biologiste", group_name: "Clients" },
    { id: 6, name: "Nikola Tesla", email: "nikola.tesla@example.com", phone: "987321654", designation: "Ingénieur", group_name: "Autre" }
    ];

    const getContacts = async () => {
        try {
            const response = await axios.get(apiUrl);
            contacts.value = response.data.allcontacts;
        } catch (error) {
            console.error("Erreur lors de la récupération des contacts :", error);
        } finally {
            loading.value = false;
        }
    };

    const deleteContact = async (id) => {
        try {
            const url = `http://localhost:3000/api/contacts/${id}`;
            const confirmation = confirm('Es-tu sûr de supprimer le contact ?');
            if (!confirmation) return;
            const response = await axios.delete(url);
            if(response.status === 200) {
                toast.error("Tu as bien supprimé le contact");
                getContacts();
            }
        } catch(error) {
            console.error("Erreur lors de la suppression du contact:", error);
        }
    }

    const addFavorisContact = async(id) => {
        try {
            const url = `http://localhost:3000/api/favoris/${id}`;
            const response = await axios.patch(url);
            if(response.status === 200) {
                if(response.data.favoris.favoris === true) {
                toast.success("Le contact a été ajouté dans les favoris");
                } else if(response.data.favoris.favoris === false) {
                    toast.success("Le contact a été retiré des favoris");
                }
                getContacts();
            } else {
                console.warn("La mise à jour des favoris a échoué avec le statut:", response.status);
            }
        } catch(err) {
            console.error("Erreur lors de la mise en favoris du contact:", err); // Log 5: Log erreur en cas de problème avec l'API
        }
    }

    watch(() => authStore.isAuthenticated, async (newValue) => {
        loading.value = true;
        if (newValue) {
            await getContacts();
        }
        loading.value = false;
    }, { immediate: true });

</script>

<template>
  <div>
    <Header />
    <div class="container">
      <CLipLoader v-if="loading" />
      <div v-else>
        <div class="message-container" v-if="!authStore.isAuthenticated">
          <h2>Tableau de démonstration</h2>
          <p class="info-message">Pour ajouter un contact favori retourne sur la page d'accueil</p>
        </div>
        
        <div class="message-container" v-else-if="authStore.isAuthenticated && contacts.length === 0">
          <h2>Aucun contacts dans tes favoris pour le moment</h2>
          <p class="info-message">Pour ajouter un contact favori retourne sur la page d'accueil</p>
        </div>
        <ContactList 
          :contacts="authStore.isAuthenticated ? contacts : fakeContacts" 
          @deleteContact="deleteContact" 
          @addFavorisContact="addFavorisContact"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
    .container {
        max-width: 900px;
        margin: 100px auto;
        padding: 20px;
        background: white;
        border-radius: 8px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }

    .table {
        width: 100%;
        border-collapse: collapse;
        background: #fff;
        border-radius: 8px;
        overflow: hidden;
    }

    .table thead {
        background-color: grey;
        color: white;
        text-align: left;
    }

    .table th, 
    .table td {
        padding: 12px 15px;
        border-bottom: 1px solid #ddd;
    }

    .table tbody tr:nth-child(even) {
        background-color: #f9f9f9;
    }

    .table tbody tr:hover {
        background-color: #e6e6e6;
    }

    .btn {
        padding: 6px 12px;
        margin-right: 5px;
        border-radius: 4px;
        text-decoration: none;
        display: inline-block;
        transition: 0.3s;
        cursor: pointer;
    }

    .btn-edit {
        background-color: #007bff;
        color: white;
    }

    .btn-edit:hover {
        background-color: #0056b3;
    }

    .btn-danger {
        background-color: #dc3545;
        color: white;
        border: none;
    }

    .btn-danger:hover {
        background-color: #a71d2a;
    }

    .message-container {
        text-align: center;
        margin-bottom: 20px;
    }

    .info-message {
        color: #666;
        font-size: 1.2em;
        margin: 15px 0;
        padding: 15px;
        background-color: #f8f9fa;
        border-radius: 6px;
        border: 1px solid #dee2e6;
    }

    h2 {
        color: #333;
        margin-bottom: 15px;
    }
</style>