<template>
  <q-dialog v-model="visible">
    <q-card class="lg:w-[400px]">
      <q-card-section class="bg-video">
        <video class="video" src="/bg.mp4?v=1" autoplay loop muted />
        <div class="title-box space-y-5">
          <h1 class="text-white text-4xl font-bold"> {{ weiToEther(note?.targetAmount) }} FIL</h1>
          <div class="text-lg text-zinc-300">
            {{ note?.borrowingDays }} days
            Interest rate:
            {{ bpsToPercentage(note?.interestRateBps) }} % APR
          </div>
        </div>
      </q-card-section>
      <q-card-section class="note-agreement-details-header">
        <div class="space-y-2 text-center">
          <q-btn icon="fingerprint" icon-right="open_in_new" :label="handleAddress(note?.contractHash, 6, 4)" flat
            class="text-xl font-bold" @click="openViewAddress(note?.contractHash)">
          </q-btn>
          <NoteCountdown :note="note!"></NoteCountdown>
        </div>
      </q-card-section>
      <q-list separator>
        <q-item>
          <q-item-section side>
            <div class="flex items-center space-x-2">
              <span>Creator</span>
              <q-badge v-if="note?.creator === dAppStore.address" color="blue" text-color="white">Me</q-badge>
            </div>
          </q-item-section>
          <q-item-section>
            {{ handleAddress(note?.creator) }}
          </q-item-section>
          <q-item-section side>
            <q-btn dense size="sm" flat unelevated color="blue" icon="open_in_new"
              @click="openViewAddress(note?.creator)" />
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section side>
            <div class="flex items-center space-x-2">
              <span>Investor</span>
              <q-badge v-if="note?.investor === dAppStore.address" color="blue" text-color="white">Me</q-badge>
            </div>
          </q-item-section>
          <q-item-section>
            {{ handleAddress(note?.investor) }}
          </q-item-section>
          <q-item-section side>
            <q-btn dense size="sm" flat unelevated color="blue" icon="open_in_new"
              @click="openViewAddress(note?.investor)" />
          </q-item-section>
        </q-item>
        <!-- Contract info for ACTIVE notes -->
        <template v-if="contractInfo">
          <q-item>
            <q-item-section side>
              <span>Funding amount</span>
            </q-item-section>
            <q-item-section>
              {{ weiToEther(contractInfo.fundingAmount) }} FIL
            </q-item-section>
            <q-item-section side v-if="note?.creator === dAppStore.address && contractInfo.fundingAmount > 0">
              <WriteContract :show-box-loading="false" :alert-error="true" :no-card="true"
                :on-success="handleWithdrawSuccess">
                <template #body="{ props }">
                  <!-- Receive investment amount -->
                  <q-btn :loading="props.loading" size="sm" outline label="Withdrawal" color="primary" unelevated
                    @click="withdrawFundingAmount(props.write)" />
                </template>
              </WriteContract>
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section side>
              <span>Current node balance</span>
            </q-item-section>
            <q-item-section>
              {{ weiToEther(contractInfo.poolAmount) }} FIL
            </q-item-section>
            <q-item-section side v-if="note?.creator === dAppStore.address && contractInfo.poolAmount > 0">
              <WriteContract :show-box-loading="false" :alert-error="true" :no-card="true"
                :on-success="handleWithdrawSuccess">
                <template #body="{ props }">
                  <q-btn :loading="props.loading" size="sm" outline label="Withdraw" color="primary" unelevated
                    @click="spWithdrawPoolAmount(props.write)" />
                </template>
              </WriteContract>
            </q-item-section>
          </q-item>
        </template>
        <!-- Platform rates -->
        <q-item>
          <q-item-section side>
            Platform rates
          </q-item-section>
          <q-item-section>
            {{ bpsToPercentage(note?.platformFeeRateBps) }} %
            ({{ weiToEther(note?.platformFeeAmount) }} FIL)
          </q-item-section>
        </q-item>
      </q-list>
      <q-card-section class="flex items-center justify-center space-x-5">
        <q-btn outline label="Close" color="negative" unelevated @click="visible = false" />
        <!-- is creator -->
        <template v-if="note?.creator === dAppStore.address">
          <WriteContract :show-box-loading="false" :alert-error="true" :no-card="true"
            :on-success="handleWithdrawSuccess">
            <template #body="{ props }">
              <q-btn label="Withdraw" class="flex-1" color="primary" unelevated :loading="props.loading"
                :disable="!contractInfo || contractInfo.poolAmount === BigInt(0)"
                @click="spWithdrawPoolAmount(props.write)" />
            </template>
          </WriteContract>
        </template>
        <!-- is investor -->
        <template v-if="note?.investor === dAppStore.address">
          <WriteContract :show-box-loading="false" :alert-error="true" :no-card="true"
            :on-success="handleWithdrawSuccess">
            <template #body="{ props }">
              <q-btn label="Withdrawal" class="flex-1" :disable="justExpiryTime(note?.expiryTime)"
                :color="justExpiryTime(note?.expiryTime) ? 'negative' : 'primary'" unelevated
                :icon-right="justExpiryTime(note?.expiryTime) ? 'error' : 'check_circle'" :loading="props.loading"
                @click="investorWithdrawPoolAmount(props.write)">
                <q-tooltip v-if="justExpiryTime(note?.expiryTime)">
                  Principal + interest rate can be received after the loan time expires
                </q-tooltip>
              </q-btn>
            </template>
          </WriteContract>
        </template>
      </q-card-section>
      <q-inner-loading :showing="loading">
        <q-spinner-radio size="1rem" color="primary" />
      </q-inner-loading>
    </q-card>
  </q-dialog>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import type { Note, WriteArgs, WriteContractResult } from 'src/common/types';
import WriteContract from 'components/WriteContract.vue';
import { handleAddress, openViewAddress, weiToEther, bpsToPercentage, justExpiryTime, swalAlert, filToWei } from 'src/common/tools';
import Swal from 'sweetalert2';
import { useDAppStore } from 'src/stores/d-app';
import { contractReadProtocols } from 'src/common/dApp';
import { NoteStatus, type NoteStatusKey } from 'src/common/const';

import NoteCountdown from 'components/NoteCountdown.vue';
interface ProtocolInfo {
  fundingAmount: bigint;
  poolAmount: bigint;
}

const visible = ref(false);
const note = ref<Note>();
const dAppStore = ref(useDAppStore());
const loading = ref(false);
const contractInfo = ref<ProtocolInfo | null>(null);

async function showAgreementDetails(n: Note) {
  visible.value = true;
  note.value = n;
  contractInfo.value = null;

  // Get contract info if note is ACTIVE and has protocol contract
  const statusKey = NoteStatus[Number(n.status) as NoteStatusKey];
  if (statusKey === 'ACTIVE' && n.protocolContract && n.protocolContract !== '0x0000000000000000000000000000000000000000') {
    loading.value = true;
    try {
      const info = await contractReadProtocols({
        functionName: 'getContractInfo',
        args: []
      }, n.protocolContract) as ProtocolInfo;
      contractInfo.value = info;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to get contract info';
      swalAlert.error(errorMessage);
    } finally {
      loading.value = false;
    }
  }
}

async function withdrawFundingAmount(write: (args: WriteArgs) => Promise<WriteContractResult | undefined>) {
  if (!note.value?.protocolContract || note.value.protocolContract === '0x0000000000000000000000000000000000000000') {
    swalAlert.error('Protocol contract not found');
    return;
  }
  const confirmed = await swalAlert.confirm(
    `Are you sure you want to withdraw ${weiToEther(contractInfo.value?.fundingAmount || BigInt(0))} FIL?`,
    'Confirm Withdrawal'
  );
  if (!confirmed) {
    return;
  }
  void write({
    functionName: 'withdrawFundingAmount',
    args: [],
    contractType: 'PROTOCOL',
    contractAddress: note.value.protocolContract,
  });
}

async function spWithdrawPoolAmount(write: (args: WriteArgs) => Promise<WriteContractResult | undefined>) {
  if (!note.value?.protocolContract || note.value.protocolContract === '0x0000000000000000000000000000000000000000') {
    swalAlert.error('Protocol contract not found');
    return;
  }
  if (!contractInfo.value || contractInfo.value.poolAmount === BigInt(0)) {
    swalAlert.error('No pool amount available to withdraw');
    return;
  }

  const maxAmount = contractInfo.value.poolAmount;
  const maxAmountFil = weiToEther(maxAmount);

  // Use SweetAlert2 input to get amount
  const { value: amountInput } = await Swal.fire({
    title: 'Withdraw Pool Amount',
    text: `Maximum available: ${maxAmountFil} FIL`,
    input: 'text',
    inputLabel: 'Amount (FIL)',
    inputPlaceholder: `Enter amount (max: ${maxAmountFil})`,
    inputValidator: (value) => {
      if (!value) {
        return 'Please enter an amount';
      }
      const amount = parseFloat(value);
      if (isNaN(amount) || amount <= 0) {
        return 'Please enter a valid positive number';
      }
      const amountWei = filToWei(amount);
      if (amountWei > maxAmount) {
        return `Amount exceeds maximum available: ${maxAmountFil} FIL`;
      }
      return null;
    },
    showCancelButton: true,
    confirmButtonText: 'Withdraw',
    cancelButtonText: 'Cancel',
    customClass: {
      confirmButton: 'q-btn q-btn-item non-selectable no-outline q-btn--rectangle bg-primary text-white q-btn--unelevated q-btn--actionable q-focusable q-hoverable',
      cancelButton: 'q-btn q-btn-item non-selectable no-outline q-btn--rectangle bg-grey text-white q-btn--unelevated q-btn--actionable q-focusable q-hoverable',
    },
  });

  if (!amountInput) {
    return;
  }

  const amountWei = filToWei(amountInput);
  void write({
    functionName: 'spWithdrawPoolAmount',
    args: [amountWei],
    contractType: 'PROTOCOL',
    contractAddress: note.value.protocolContract,
  });
}

function investorWithdrawPoolAmount(write: (args: WriteArgs) => Promise<WriteContractResult | undefined>) {
  if (note.value?.expiryTime && justExpiryTime(note.value.expiryTime)) {
    swalAlert.error('Principal + interest rate can be received after the loan time expires');
    return;
  }
  if (!note.value?.protocolContract || note.value.protocolContract === '0x0000000000000000000000000000000000000000') {
    swalAlert.error('Protocol contract not found');
    return;
  }
  void write({
    functionName: 'investorWithdrawPoolAmount',
    args: [],
    contractType: 'PROTOCOL',
    contractAddress: note.value.protocolContract,
  });
}

async function handleWithdrawSuccess() {
  // Refresh contract info after successful withdrawal
  if (note.value) {
    await refreshContractInfo();
  }
}

async function refreshContractInfo() {
  if (!note.value) return;
  const statusKey = NoteStatus[Number(note.value.status) as NoteStatusKey];
  if (statusKey === 'ACTIVE' && note.value.protocolContract && note.value.protocolContract !== '0x0000000000000000000000000000000000000000') {
    loading.value = true;
    try {
      const info = await contractReadProtocols({
        functionName: 'getContractInfo',
        args: []
      }, note.value.protocolContract) as ProtocolInfo;
      contractInfo.value = info;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to get contract info';
      swalAlert.error(errorMessage);
    } finally {
      loading.value = false;
    }
  }
}

defineExpose({ showAgreementDetails });
</script>
