<template>

<div class="layout">

<Navbar/>

<div class="content">

<h1>Doctor List</h1>

<table>

<tr>
<th>Name</th>
<th>Email</th>
<th>Group</th>
</tr>

<tr>
<td>Dr.A1</td>
<td>a1@mail.com</td>
<td>Group A</td>
</tr>

</table>

</div>

</div>

</template>

<script setup lang="ts">
import Navbar from "../../components/Navbar.vue"
</script>

<style scoped>

.layout{
display:flex;
font-family: Arial, Helvetica, sans-serif
}

.content{
padding:30px;
flex:1;
background:#fafafa;
}

table{
width:100%;
background:white;
border-collapse:collapse;
}

th,td{
padding:10px;
border-bottom:1px solid #eee;
text-align:left;
}

</style>