<template>
  <q-page>
    <div class="bg-video">
      <video class="video" src="/bg.mp4?v=1" autoplay loop muted />
      <div class="title-box space-y-5">
        <h1 class="text-white text-5xl font-bold">Dashboard</h1>
        <div class="text-lg text-zinc-300">
          The NOTEs you create for lending or investing will be displayed here.
        </div>
      </div>
    </div>
    <ConnectingWallets show-type="slot" mode="card">
      <template #connected>
        <div class="container py-5 -mt-20 z-50 relative">
          <q-card flat>
            <q-card-section>
              <q-tabs dense active-bg-color="primary" active-color="white" v-model="tab" :items="tabs">
                <template v-for="tab in tabs" :key="tab">
                  <q-tab :name="tab" :label="tab" />
                </template>
              </q-tabs>
            </q-card-section>
            <q-table :loading="rowsLoading" flat :columns="columns" :rows="rows" :pagination="rowsPagination">
              <template v-slot:body-cell-target_amount="props">
                <q-td :props="props">
                  {{ weiToEther(props.row.targetAmount) }} FIL
                </q-td>
              </template>
              <template v-slot:body-cell-interest_rate="props">
                <q-td :props="props">
                  {{ bpsToPercentage(props.row.interestRateBps) }} %
                </q-td>
              </template>
              <template v-slot:body-cell-status="props">
                <q-td :props="props">
                  <q-chip :label="NoteStatus[props.row.status as NoteStatusKey]"
                    :color="NoteStatus[props.row.status as NoteStatusKey]" />
                </q-td>
              </template>
              <template v-slot:body-cell-actions="tableProps">
                <q-td :props="tableProps">
                  <WriteContract :show-box-loading="false" :alert-error="true" :no-card="true">
                    <template #body="{ props }">
                      <template v-if="tab === 'Financing'">
                        <!-- Withdrawal -->
                        <q-btn label="Withdrawal" color="secondary" unelevated
                          v-if="showSpWithdrawalButton(tableProps.row.status)"
                          @click="withdrawal(props.write, tableProps.row)" />
                      </template>
                      <template v-else>
                        <!-- Receive repayment -->
                        <q-btn label="Receive repayment" color="secondary" unelevated
                          @click="receiveRepayment(props.write, tableProps.row)" />
                      </template>
                    </template>
                  </WriteContract>
                </q-td>
              </template>
            </q-table>
          </q-card>
        </div>
      </template>
    </ConnectingWallets>
  </q-page>
</template>
<script setup lang="ts">
import { ref, watch } from 'vue';
import ConnectingWallets from 'components/ConnectingWallets.vue';
import WriteContract from 'components/WriteContract.vue';
import { contractRead } from 'src/common/dApp';
import { useDAppStore } from 'src/stores/d-app';
import { emptyString } from 'src/common/tools';
import { weiToEther, bpsToPercentage } from 'src/common/tools';
import { storeToRefs } from 'pinia';
import { NoteStatus, type NoteStatusKey } from 'src/common/const';
import type { Note, WriteArgs, WriteContractResult } from 'src/common/types';
const tab = ref('Financing');
const tabs = ref(['Financing', 'Investment']);
const dAppStore = useDAppStore();
const { address } = storeToRefs(dAppStore);
const rowsLoading = ref(false);

const columns = [
  {
    name: 'id',
    label: 'ID',
    field: 'id',
    align: 'left' as const
  }, {
    name: 'target_amount',
    field: 'targetAmount',
    label: 'Target Amount',
    align: 'center' as const
  }, {
    name: 'interest_rate',
    field: 'interestRateBps',
    label: 'Interest Rate',
    align: 'center' as const
  }, {
    name: 'borrowingDays',
    field: 'borrowingDays',
    label: 'Borrowing Days',
    align: 'center' as const
  }, {
    name: 'node_output_balance',
    field: 'nodeOutputBalance',
    label: 'Node output balance',
    align: 'center' as const
  }, {
    name: 'status',
    field: 'status',
    label: 'Status',
    align: 'center' as const
  }, {
    name: "actions",
    label: 'Actions',
    align: 'center' as const,
    field: ''
  }
]
const rows = ref<Note[]>([]);
const rowsPagination = ref({
  page: 1,
  rowsPerPage: 10,
})
const investmentRows = ref<Note[]>([]);
const financingRows = ref<Note[]>([]);

watch(tab, (val) => {
  rows.value = val === 'Financing' ? financingRows.value : investmentRows.value;
  if (investmentRows.value.length > 0 && financingRows.value.length > 0) {
    return;
  }
  if (emptyString(address.value)) {
    return;
  }
  getData();
});


watch(address, (newAddress) => {
  if (emptyString(newAddress)) {
    return;
  }
  getData();
}, { immediate: true, deep: true });



function getData() {
  if (tab.value === 'Financing') {
    void getMyFinancingNotes();
  } else {
    void getMyInvestmentNotes();
  }
}


// get my notes
async function getMyInvestmentNotes() {
  try {
    console.log('getMyInvestmentNotes');
    rowsLoading.value = true;
    const offset = (rowsPagination.value.page - 1) * rowsPagination.value.rowsPerPage;
    const result = await contractRead({
      functionName: 'getNotesByInvestor', args: [
        address.value, offset, rowsPagination.value.rowsPerPage
      ]
    }) as bigint[];
    const notes = await contractRead({
      functionName: 'getNoteByIds', args: [
        [...result],
      ]
    }) as Note[];
    investmentRows.value = [...notes];
    rows.value = investmentRows.value;
  }
  catch (error) {
    console.error(error);
  } finally {
    rowsLoading.value = false;
  }
}

// get my financing notes
async function getMyFinancingNotes() {
  try {
    console.log('getMyNotes');
    rowsLoading.value = true;
    const offset = (rowsPagination.value.page - 1) * rowsPagination.value.rowsPerPage;
    const result = await contractRead({
      functionName: 'getNotesByCreator', args: [
        address.value, offset, rowsPagination.value.rowsPerPage
      ]
    }) as bigint[];
    const notes = await contractRead({
      functionName: 'getNoteByIds', args: [
        [...result],
      ]
    }) as Note[];
    financingRows.value = [...notes];
    rows.value = financingRows.value;
  } catch (error) {
    console.error(error);
  } finally {
    rowsLoading.value = false;
  }
}



function showSpWithdrawalButton(status: number) {
  const statusKey = NoteStatus[status as NoteStatusKey];
  return statusKey === 'ACTIVE';
}

function withdrawal(write: (args: WriteArgs) => Promise<WriteContractResult | undefined>, id: bigint) {
  void write({ functionName: 'withdrawal', args: [id] });
}

function receiveRepayment(write: (args: WriteArgs) => Promise<WriteContractResult | undefined>, id: bigint) {
  void write({ functionName: 'receiveRepayment', args: [id] });
}
</script>
