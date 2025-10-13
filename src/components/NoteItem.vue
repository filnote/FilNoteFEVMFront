<template>
  <q-card flat class="note-item" :class="NoteStatus[item.status as NoteStatusKey]">
    <q-card-section class="space-y-2">
      <div class="flex justify-between items-center">
        <div class="text-lg font-bold font-mono">
          #{{ item.id }}
        </div>
        <WriteContract :show-box-loading="false" :alert-error="true" :no-card="true">
          <template #body="{ props }">
            <div class="flex items-center space-x-3">
              <q-btn :loading="props.loading && action === 'close'" outline v-if="showCloseButton()" label="Close Note"
                color="negative" unelevated @click="closeNote(props.write, item.id)" type="button" size="md" />
              <q-btn label="Subscription" color="secondary" unelevated size="md"
                :loading="props.loading && action === 'invest'" v-if="showSubscriptionButton()"
                @click="investNote(props.write)" />
              <q-btn label="Review" color="primary" unelevated size="md" v-if="showReviewButton()"
                @click="openReviewNote" />
              <q-btn v-if="showAgreementDetailsBtn()" label="Agreement details" color="green" unelevated
                @click="showAgreementDetails(item)" />
            </div>
          </template>
        </WriteContract>
      </div>
      <div class="text-sm text-meta">
        Borrow for <span class="text-secondary font-bold">{{ item.borrowingDays }} days</span> at <span
          class="text-green-500 font-bold">{{ bpsToPercentage(item.interestRateBps) }} % APR</span>
      </div>
    </q-card-section>
    <q-card-section class="note-item-section py-0">
      <div class="relative">
        <div class="avatar">
          <span class="amount">{{ weiToEther(item.targetAmount) }} FIL</span>
          <q-chip :label="NoteStatus[item.status as NoteStatusKey]" :color="NoteStatus[item.status as NoteStatusKey]" />
        </div>
        <div class="info">
          <q-list separator dense>
            <q-item clickable @click="openViewAddress(item.creator)">
              <q-item-section side>
                Creator
              </q-item-section>
              <q-item-section class="text-link">
                {{ handleAddress(item.creator) }}
              </q-item-section>
            </q-item>
            <!-- income -->
            <q-item>
              <q-item-section side>
                Income
              </q-item-section>
              <q-item-section>
                {{ weiToEther(calculateInterest(item.targetAmount, item.interestRateBps, item.borrowingDays),
                  true) }}
                FIL
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section side>
                Legal contracts hash
              </q-item-section>
              <q-item-section>
                {{ handleAddress(item.contractHash, 6, 4) }}
              </q-item-section>
            </q-item>
            <!-- investor -->
            <q-item clickable @click="openViewAddress(item.investor)">
              <q-item-section side>
                Investor
              </q-item-section>
              <q-item-section class="text-link">
                {{ handleAddress(item.investor) }}
              </q-item-section>
            </q-item>
            <!-- protocolContract -->
            <q-item clickable @click="openViewAddress(item.protocolContract)">
              <q-item-section side>
                Protocol Contract
              </q-item-section>
              <q-item-section class="text-link">
                {{ handleAddress(item.protocolContract) }}
              </q-item-section>
            </q-item>
          </q-list>
        </div>
      </div>
    </q-card-section>
  </q-card>
  <ReviewNote :refresh-data="refreshData" ref="reviewNoteRef" />
</template>
<script setup lang="ts">
import type { WriteArgs, WriteContractResult, Note } from 'src/common/types';
import { ref, type PropType } from 'vue';
import { NoteStatus, type NoteStatusKey } from 'src/common/const';
import { openViewAddress } from 'src/common/tools';
import { handleAddress, weiToEther, bpsToPercentage, calculateInterest } from 'src/common/tools';
import { useDAppStore } from 'src/stores/d-app';
import WriteContract from 'components/WriteContract.vue';
import ReviewNote from 'components/ReviewNote.vue';
const props = defineProps({
  item: {
    type: Object as PropType<Note>,
    required: true,
  },
  refreshData: {
    type: Function,
    default: () => { },
  },
  showAgreementDetails: {
    type: Function,
    default: () => { },
  },
});

const dAppStore = ref(useDAppStore());
const reviewNoteRef = ref<InstanceType<typeof ReviewNote>>();
const action = ref('close');

function openReviewNote() {
  console.log(reviewNoteRef)
  reviewNoteRef.value?.showReviewNote(props.item.id);
}

function showCloseButton() {
  const statusKey = NoteStatus[props.item.status as NoteStatusKey];
  const currentAddress = dAppStore.value.address;
  return (props.item.creator === currentAddress || currentAddress === dAppStore.value.ownerAddress) && statusKey === 'INIT';
}

function showSubscriptionButton() {
  const statusKey = NoteStatus[props.item.status as NoteStatusKey];
  return statusKey === 'PENDING';
}

function showReviewButton() {
  const statusKey = NoteStatus[props.item.status as NoteStatusKey];
  const currentAddress = dAppStore.value.address;

  return currentAddress === dAppStore.value.ownerAddress && statusKey === 'INIT';
}

function showAgreementDetailsBtn() {
  const statusKey = NoteStatus[props.item.status as NoteStatusKey];
  const currentAddress = dAppStore.value.address;
  return statusKey === 'ACTIVE' && (props.item.creator === currentAddress || currentAddress === dAppStore.value.ownerAddress || props.item.investor === currentAddress);
}

function closeNote(write: (args: WriteArgs) => Promise<WriteContractResult | undefined>, id: bigint) {
  action.value = 'close';
  void write({
    functionName: 'closeNote',
    args: [id],
  });
}

function investNote(write: (args: WriteArgs) => Promise<WriteContractResult | undefined>) {
  action.value = 'invest';
  void write({
    functionName: 'invest',
    args: [props.item.id],
    value: props.item.targetAmount,
  });
}
</script>
