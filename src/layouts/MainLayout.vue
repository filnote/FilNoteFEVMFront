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
          </q-list>
        </q-toolbar-title>
        <ConnectingWallets />
      </q-toolbar>
    </q-header>
    <q-page-container>
      <router-view />
    </q-page-container>
    <q-footer class="site-footer">
      <div class="container">
        <div class="links flex items-center space-x-3">
          <q-btn icon="fa-brands fa-github" href="https://github.com/filnote" target="_blank" />
          <q-btn :to="{ name: 'terms-service' }" no-caps label="Platform Terms of Service" flat dense></q-btn>
        </div>
      </div>
    </q-footer>
  </q-layout>
</template>

<script setup lang="ts">
import ConnectingWallets from 'components/ConnectingWallets.vue';
import { useDAppStore } from 'src/stores/d-app';
import { onMounted } from 'vue';

const dAppStore = useDAppStore();
onMounted(() => {
  void dAppStore.getAuditors();
});
</script>
