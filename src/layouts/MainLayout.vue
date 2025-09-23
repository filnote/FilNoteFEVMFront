<template>
  <q-layout view="lHh Lpr lFf">
    <q-header>
      <q-toolbar class="container py-4">
        <a href="/" class="text-3xl font-bold font-serif">F</a>
        <q-toolbar-title class="ml-5">
          <q-list class="main-menu" dense>
            <q-item clickable :to="{ name: 'home' }">
              <q-item-section>
                <q-item-label>
                  Home
                </q-item-label>
              </q-item-section>
            </q-item>
            <q-item clickable :to="{ name: 'dashboard' }">
              <q-item-section>
                <q-item-label>
                  Dashboard
                </q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-toolbar-title>
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
