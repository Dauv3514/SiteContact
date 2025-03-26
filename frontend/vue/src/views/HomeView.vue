<script setup>
    import Header from "../components/Header.vue";
    import axios from "axios";
    import {ref, onMounted} from "vue";
    import CLipLoader from 'vue-spinner/src/ClipLoader.vue'
    import {useToast} from 'vue-toastification'

    const apiUrl = 'http://localhost:3000/api/contacts';

    const toast = useToast();
    const contacts = ref([]);
    const loading = ref(true);

    const getContacts = async () => {
        try {
            const response = await axios.get(apiUrl);
            contacts.value = response.data.allcontacts;
        } catch(error) {
            console.error("Erreur lors de la récupération des contacts :", error);
        } finally {
            loading.value = false;
        }
    }

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

    onMounted(()=> {
        getContacts();
    })
</script>

<template>
  <div>
    <Header />
    <div class="container">
      <CLipLoader v-if="loading"/>
      <table v-else class="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Contact No#</th>
            <th>Designation</th>
            <th>Groupe</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
            <tr v-for="contact in contacts" :key="contact.id" class="table-secondary">
                <td>{{ contact.name }}</td>
                <td>{{ contact.email }}</td>
                <td>{{ contact.phone }}</td>
                <td>{{ contact.designation }}</td>
                <td>{{ contact.group_name }}</td>
                <td>
                <router-link 
                    :to="{ name: 'editContact', params: { id: contact.id } }" 
                    class="btn btn-edit"
                >
                    Edit
                </router-link>
                <button @click="deleteContact(contact.id)" class="btn btn-danger">Delete</button>
                </td>
            </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
    .container {
    max-width: 900px;
    margin: 60px auto;
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
</style>