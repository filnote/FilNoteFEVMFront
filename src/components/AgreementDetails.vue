<template>
  <q-dialog v-model="visible">
    <q-card>
      <q-card-section class="bg-video">
        <video class="video" src="/bg.mp4?v=1" autoplay loop muted />
        <div class="title-box space-y-5">
          <h1 class="text-white text-5xl font-bold">Agreement Details</h1>
          <div class="text-lg text-zinc-300">
            Agreement details for note #{{ note?.id }}
          </div>
        </div>
      </q-card-section>
      <q-card-section>
        <div class="space-y-2">
          <div class="text-2xl font-bold text-center">
            {{ weiToEther(note?.targetAmount) }} FIL
          </div>
          <div class="text-xs font-bold text-green-500 text-center">
            {{ note?.borrowingDays }} days
            Interest rate:
            {{ bpsToPercentage(note?.interestRateBps) }} % APR
          </div>
        </div>
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
                <WriteContract :show-box-loading="false" :alert-error="true" :no-card="true">
                  <template #body="{ props }">
                    <!-- Receive investment amount -->
                    <q-btn :loading="props.loading" size="sm" outline label="Withdrawal" color="primary" unelevated
                      @click="receiveInvestmentAmount(props.write)" />
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
      </q-card-section>
      <q-card-section>

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
import { handleAddress, openViewAddress, weiToEther, bpsToPercentage } from 'src/common/tools';
import { useDAppStore } from 'src/stores/d-app';
import { contractReadProtocols } from 'src/common/dApp';
import { NoteStatus, type NoteStatusKey } from 'src/common/const';
const visible = ref(false);
const note = ref<Note>();
const dAppStore = ref(useDAppStore());
const loading = ref(false);
const contractInfo = ref<{ fundingAmount: bigint; poolAmount: bigint } | null>(null);

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
      }, n.protocolContract) as { fundingAmount: bigint; poolAmount: bigint };
      contractInfo.value = info;
    } catch (error) {
      console.error('Failed to get contract info:', error);
    } finally {
      loading.value = false;
    }
  }
}

function receiveInvestmentAmount(write: (args: WriteArgs) => Promise<WriteContractResult | undefined>) {
  void write({
    functionName: 'withdrawFundingAmount',
    args: [],
    contractType: 'PROTOCOL',
    contractAddress: `${note.value?.protocolContract}`,
  });
}

defineExpose({ showAgreementDetails });
</script>
