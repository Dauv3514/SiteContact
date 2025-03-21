<script setup>
import Header from "../components/Header.vue";
</script>

<template>
  <div>
    <Header />
    <div class="container">
      <table class="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Contact No#</th>
            <th>Designation</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>John</td>
            <td>john@gmail.com</td>
            <td>555</td>
            <td>Web Developer</td>
            <td>
              <a href="#" class="btn btn-edit">Edit</a>
              <button class="btn btn-danger">Delete</button>
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