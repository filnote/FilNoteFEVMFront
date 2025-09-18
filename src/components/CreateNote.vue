<template>
  <ConnectingWallets show-type="slot">
    <template #connected>
      <q-btn unelevated size="lg" rounded color="secondary" icon="note_add" label="Create Note" />
      <q-dialog v-model="open">

      </q-dialog>
    </template>
  </ConnectingWallets>
</template>
<script setup lang="ts">
import ConnectingWallets from 'components/ConnectingWallets.vue';
import { ref } from 'vue';
const open = ref(false);
</script>
