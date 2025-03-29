<script setup>
    import {ref} from 'vue';
    import axios from "axios";
    import {useToast} from 'vue-toastification'

    const toast = useToast();
    const apiUrl = 'http://localhost:3000/api/contacts';

    const name = ref('');
    const email = ref('');
    const phone = ref('');
    const poste = ref('');
    const group_name = ref(
        ["Amis", 
        "Famille", 
        "Collègues", 
        "Réseau pro", 
        "Clients", 
        "Autre"]
    );
    const selectedGroup = ref('');

    const saveContact = async () => {
        if (!name.value || !email.value || !phone.value || !poste.value || !selectedGroup.value) {
            toast.error("Tous les champs sont obligatoires!");
            return;
        }
        try {
          const response = await axios.post(apiUrl, {
            name: name.value,
            email: email.value,
            phone: phone.value,
            designation: poste.value,
            group_name: selectedGroup.value 
          }, {
            withCredentials: true
          });
            if(response.status === 201) {
                toast.success('Le contact a été ajouté')
                name.value = '';
                email.value = '';
                phone.value = '';
                poste.value = '';
                selectedGroup.value = '';
            }
        } catch(error) {
            console.error("Erreur lors de l'envoi du contact", error);
        }
    };
</script>

<template>
    <div class="contact-form-container">
      <h3>Ajouter un contact</h3>
      <form @submit.prevent="saveContact" class="contact-form">
        <div class="form-group">
          <label for="name">Nom:</label>
          <input 
            type="text" 
            id="name" 
            v-model="name"
            placeholder="Entrez votre nom" 
          />
        </div>
  
        <div class="form-group">
          <label for="email">Email:</label>
          <input 
            type="email" 
            id="email" 
            v-model="email" 
            placeholder="Entrez votre email" 
          />
        </div>
  
        <div class="form-group">
          <label for="phone">Téléphone:</label>
          <input 
            type="tel" 
            id="phone" 
            v-model="phone" 
            placeholder="Entrez votre numéro de téléphone" 
          />
        </div>
  
        <div class="form-group">
          <label for="poste">Poste:</label>
          <textarea 
            id="poste" 
            v-model="poste" 
            placeholder="Entrez le nom de votre poste (métier)"
          ></textarea>
        </div>
        <div class="form-group">
            <label for="poste">Groupe:</label>
            <select v-model="selectedGroup">
                <option value="">Sélectionnez un groupe</option>
                <option v-for="g in group_name" :key="g" :value="g">
                    {{ g }}
                </option>
            </select>
        </div>
  
        <button type="submit" class="submit-btn">Envoyer</button>
      </form>
    </div>
  </template>
  
  <style scoped>
    .contact-form-container {
        max-width: 500px;
        margin: 200px auto;
        padding: 20px;
        background-color: #f9f9f9;
        border-radius: 8px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }
    
    h3 {
        text-align: center;
        color: #333;
    }
    
    .contact-form {
        display: flex;
        flex-direction: column;
        gap: 15px;
    }
    
    .form-group {
        display: flex;
        flex-direction: column;
    }
    
    .form-group label {
        font-weight: bold;
        margin-bottom: 5px;
        color: #555;
    }
    
    .form-group input,
    .form-group textarea {
        padding: 10px;
        font-size: 16px;
        border: 1px solid #ddd;
        border-radius: 4px;
        transition: border-color 0.3s ease;
    }
    
    .form-group input:focus,
    .form-group textarea:focus {
        border-color: #007bff;
        outline: none;
    }
    
    .form-group textarea {
        resize: vertical;
        min-height: 100px;
    }
    
    .submit-btn {
        padding: 10px 20px;
        background-color: #007bff;
        color: white;
        border: none;
        border-radius: 4px;
        font-size: 16px;
        cursor: pointer;
        transition: background-color 0.3s ease;
    }
    
    .submit-btn:hover {
        background-color: #0056b3;
    }
  </style>