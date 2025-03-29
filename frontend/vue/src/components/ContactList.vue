<script setup>
    import { useAuthStore } from "../stores/auth.js";

    const authStore = useAuthStore();

    defineProps({
        contacts: {
            type: Array,
            required: true,
        },
    });

    const emit = defineEmits(["deleteContact", "addFavorisContact"]);
</script>

<template>
  <table class="table">
    <thead>
      <tr>
        <th>Nom</th>
        <th>Email</th>
        <th>Téléphone</th>
        <th>Poste</th>
        <th>Groupe</th>
        <th v-if="authStore.isAuthenticated">Actions</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="contact in contacts" :key="contact.id" class="table-secondary">
        <td>{{ contact.name }}</td>
        <td>{{ contact.email }}</td>
        <td>{{ contact.phone }}</td>
        <td>{{ contact.designation }}</td>
        <td>{{ contact.group_name }}</td>
        <td v-if="authStore.isAuthenticated">
            <div class="boutons-actions">
                <button @click="$emit('addFavorisContact', contact.id)" class="btn btn-favoris">
                    {{ contact.favoris ? "Retirer des favoris" : "Ajouter aux favoris" }} 
                </button>
                <router-link 
                    :to="{ name: 'editContact', params: { id: contact.id } }" 
                    class="btn btn-edit"
                >
                    Modifier
                </router-link>
                <button @click="$emit('deleteContact', contact.id)" class="btn btn-danger">
                    Supprimer
                </button>
            </div>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<style scoped>
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

    .boutons-actions {
        display: flex;
        gap: 6px;
    }

    .btn {
        padding: 3px 6px;
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
        font-size: 14px;
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

    .btn-favoris {
        background-color: #cdd00a;
        color: white;
        border: none;
    }

    .btn-favoris:hover {
        background-color: #cdd00a;
    }
</style>