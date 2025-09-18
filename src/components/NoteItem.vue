<template>
  <q-card flat class="note-item" :class="NoteStatus[item.status as NoteStatusKey]">
    <q-card-section class="note-item-section">
      <div class="avatar">
        <span class="text-sm">#{{ item.id }}</span>
        <span class="amount">{{ weiToEther(item.targetAmount) }} FIL</span>
        <q-chip :label="NoteStatus[item.status as NoteStatusKey]" :color="NoteStatus[item.status as NoteStatusKey]" />
      </div>
      <div class="info">
        <q-list separator>
          <q-item>
            <q-item-section side>
              Creator
            </q-item-section>
            <q-item-section>
              {{ handleAddress(item.creator) }}
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section side>
              Borrowing period
            </q-item-section>
            <q-item-section>
              {{ item.borrowingDays }} days
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section side>
              Annual interest rate
            </q-item-section>
            <q-item-section>
              {{ bpsToPercentage(item.interestRateBps) }} %
            </q-item-section>
          </q-item>
          <WriteContract :show-box-loading="false" :alert-error="true">
            <template #body="{ props }">
              <q-item>
                <q-item-section>
                  <div class="flex items-center space-x-3">
                    <q-btn :loading="props.loading" outline v-if="showCloseButton(item.creator, item.status)"
                      label="Close Note" color="negative" unelevated @click="closeNote(props.write, item.id)"
                      type="button" size="md" />
                    <q-btn label="Subscription" color="primary" unelevated size="md"
                      v-if="showSubscriptionButton(item.creator, item.status)" />
                    <q-btn label="Review" color="primary" unelevated size="md" v-if="showReviewButton(item.status)" />
                  </div>
                </q-item-section>
              </q-item>
            </template>
          </WriteContract>
        </q-list>
      </div>
    </q-card-section>
  </q-card>
</template>
<script setup lang="ts">
import type { WriteArgs, WriteContractResult, Note } from 'src/common/types';
import { ref, type PropType } from 'vue';
import { NoteStatus, type NoteStatusKey } from 'src/common/const';
import { handleAddress, weiToEther, bpsToPercentage } from 'src/common/tools';
import { useDAppStore } from 'src/stores/d-app';
import WriteContract from 'components/WriteContract.vue';
defineProps({
  item: {
    type: Object as PropType<Note>,
    required: true,
  },
});

const dAppStore = ref(useDAppStore());

function showCloseButton(address: string, status: number) {
  const statusKey = NoteStatus[status as NoteStatusKey];
  const currentAddress = dAppStore.value.address;
  return (address === currentAddress || currentAddress === dAppStore.value.ownerAddress) && statusKey === 'INIT';
}

function showSubscriptionButton(address: string, status: number) {
  const statusKey = NoteStatus[status as NoteStatusKey];
  return statusKey === 'PENDING';
}

function showReviewButton(status: number) {
  const statusKey = NoteStatus[status as NoteStatusKey];
  const currentAddress = dAppStore.value.address;
  console.log('currentAddress', currentAddress);
  console.log('dAppStore.value.ownerAddress', dAppStore.value.ownerAddress);
  console.log('statusKey', statusKey);
  return currentAddress === dAppStore.value.ownerAddress && statusKey == 'INIT';
}

function closeNote(write: (args: WriteArgs) => Promise<WriteContractResult | undefined>, id: bigint) {
  void write({
    functionName: 'closeNote',
    args: [id],
  });
}
</script>
