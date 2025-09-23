<template>
  <q-page>
    <div class="bg-video">
      <video class="video" src="/bg.mp4?v=1" autoplay loop muted />
      <div class="title-box space-y-5">
        <h1 class="text-white text-5xl font-bold">Dashboard</h1>
      </div>
    </div>
    <div class="container py-5 -mt-20 z-50 relative">
      <q-card flat>
        <q-tabs v-model="tab" :items="tabs">
          <template v-for="tab in tabs" :key="tab">
            <q-tab :name="tab" :label="tab" />
          </template>
        </q-tabs>
        <q-card-section>
          <q-tab-panels v-model="tab">
            <q-tab-panel name="Investment">
              <q-table flat :columns="columns" :rows="rows"></q-table>
            </q-tab-panel>
            <q-tab-panel name="Financing">
              <q-table flat :columns="financingColumns" :rows="financingRows"></q-table>
            </q-tab-panel>
          </q-tab-panels>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue';
const tab = ref('Financing');
const tabs = ref(['Financing', 'Investment']);
const columns = [
  {
    name: 'id',
    label: 'ID',
    field: 'id'
  }, {
    name: 'Target Amount',
    field: 'targetAmount',
    label: 'Target Amount'
  }, {
    name: 'Interest Rate',
    field: 'interestRateBps',
    label: 'Interest Rate'
  }, {
    name: 'borrowingDays',
    field: 'borrowingDays',
    label: 'Borrowing Days'
  }
]
const rows = ref([]);
const financingColumns = [...columns]
const financingRows = ref([]);

onMounted(() => {
  void getMyNotes();
});


function getMyNotes() { }

function getMyFinancingNotes() { }

</script>
