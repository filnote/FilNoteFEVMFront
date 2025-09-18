<template>
  <q-layout view="lHh Lpr lFf">
    <q-header>
      <q-toolbar class="container py-4">
        <a href="/" class="text-3xl font-bold font-serif">F</a>
        <q-toolbar-title> </q-toolbar-title>
        <ConnectingWallets />
      </q-toolbar>
    </q-header>
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import ConnectingWallets from 'components/ConnectingWallets.vue';
</script>
