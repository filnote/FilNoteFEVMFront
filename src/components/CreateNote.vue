<template>
  <ConnectingWallets show-type="slot">
    <template #connected>
      <q-btn @click="openCreateNote" unelevated size="lg" rounded color="secondary" icon="note_add"
        label="Create Note" />
      <q-dialog v-model="open" persistent>
        <WriteContract :on-success="createNoteSuccess">
          <template #body="{ props }">
            <q-card-section class="bg-primary text-center">
              <h3 class="text-white text-2xl font-bold">Create Note</h3>
            </q-card-section>
            <q-card-section>
              <q-form class="space-y-3" @submit="createNote(props.write)">
                <q-input :rules="[(val: number) => val > 0 || 'Target Amount must be greater than 0']" outlined
                  v-model="form.targetAmount" label="Target Amount">
                  <template #append>
                    <q-img src="/filecoin.png" width="20px" height="20px" />
                  </template>
                </q-input>
                <q-input
                  :rules="[(val: number) => val > 0 && val < 10000 || 'Interest Rate must be greater than 0 and less than 10000']"
                  outlined v-model="form.interestRateBps" label="Interest Rate (bps)">
                  <template #append>
                    <q-icon name="percent" />
                  </template>
                </q-input>
                <q-input :rules="[(val: number) => val > 0 || 'Borrowing Days must be greater than 0']" outlined
                  v-model="form.borrowingDays" label="Borrowing Days" />
                <div class="flex justify-center !mt-10 space-x-3">
                  <q-btn class="flex-1" icon="note_add" color="primary" unelevated size="lg" type="submit"
                    label="Create Note" />
                  <q-btn icon="close" color="negative" unelevated size="lg" type="button" @click="closeCreateNote" />
                </div>
              </q-form>
            </q-card-section>

          </template>
        </WriteContract>
      </q-dialog>
    </template>
  </ConnectingWallets>
</template>
<script setup lang="ts">
import ConnectingWallets from 'components/ConnectingWallets.vue';
import WriteContract from 'components/WriteContract.vue';
import { filToWei, swalAlert, weiToEther } from 'src/common/tools';
import { useDAppStore } from 'src/stores/d-app';
import type { WriteArgs, WriteContractResult } from 'src/common/types';
import { ref } from 'vue';
const open = ref(false);
const props = defineProps({
  refreshData: {
    type: Function,
    default: () => { },
  },
});
const form = ref({
  targetAmount: 0,
  interestRateBps: 20,
  borrowingDays: 0,
});
const dAppStore = useDAppStore();

function openCreateNote() {
  open.value = true;
}
function closeCreateNote() {
  open.value = false;
}

function createNoteSuccess() {
  props.refreshData?.();
  swalAlert.success('Note created successfully');
  resetForm();
  closeCreateNote();
}

function resetForm() {
  form.value.targetAmount = 0;
  form.value.interestRateBps = 20;
  form.value.borrowingDays = 0;
}

async function createNote(writeContract: (args: WriteArgs) => Promise<WriteContractResult | undefined>) {
  // Check wallet balance (for gas fees)
  const address = dAppStore.address;
  if (!address) {
    swalAlert.error('Please connect your wallet first');
    return;
  }

  // Update balance first to ensure we have the latest balance
  await dAppStore.updateBalance();

  const balance = dAppStore.balance;
  // Check if balance is sufficient for gas fees (at least 0.01 FIL)
  const minBalance = filToWei(0.01);
  if (balance < minBalance) {
    swalAlert.error(
      `Insufficient balance for gas fees. You need at least ${weiToEther(minBalance)} FIL but only have ${weiToEther(balance)} FIL.`
    );
    return;
  }

  const targetAmount = filToWei(form.value.targetAmount);
  void writeContract({
    functionName: 'createNote',
    args: [targetAmount, form.value.interestRateBps, form.value.borrowingDays, ''],
  });
}
</script>
