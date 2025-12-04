<template>
  <q-dialog v-model="visible">
    <q-card class="lg:w-[520px]">
      <q-card-section class="bg-primary text-center space-y-3">
        <h3 class="text-white text-2xl font-bold">
          Risk confirmation
        </h3>
        <q-tabs dense v-model="tab" align="center" active-color="white" class="text-white">
          <q-tab name="agreement" label="Risk Statement" />
          <q-tab name="contract" label="Contract" />
          <q-tab name="privacy" label="Privacy Preview" />
        </q-tabs>
      </q-card-section>
      <q-tab-panels v-model="tab">
        <q-tab-panel name="agreement" class="p-0">
          <q-scroll-area class="h-[500px]">
            <div class="risk-disclosure-statement">
              <h2>Risk Disclosure Statement (Revised Version)</h2>
              <p>
                In order to ensure transparency and help investors fully understand the nature and potential risks of
                products
                offered on the FilNote platform, the following statements are provided:
              </p>
              <h3>1. Investment Risk</h3>

              <p>
                FIL-denominated debt notes on FilNote are innovative digital asset instruments that carry both potential
                returns
                and associated risks.
              </p>
              <p>
                Investors should carefully assess their financial situation and risk tolerance before making investment
                decisions.
                FilNote does not guarantee any specific level of return or profit.
              </p>

              <h3>2. Smart Contract and Technical Operations</h3>
              <p>
                FilNote operates through open and verifiable smart contracts deployed on the Filecoin network.
                While the system has undergone internal testing and continuous optimization, its performance may still
                be
                influenced by network conditions or blockchain activity.
              </p>
              <p>
                FilNote is committed to maintaining system stability and improving user experience.
              </p>

              <h3> 3. Market and Liquidity</h3>
              <p>
                The market value and liquidity of FIL-denominated debt notes may fluctuate based on market demand,
                network
                conditions, and overall ecosystem dynamics.
              </p>
              <p>
                Such changes are part of normal market behavior.
              </p>
              <p>
                Investors should be aware that liquidity and yield levels are not guaranteed.

              </p>
              <h3> 4. Legal and Regulatory Considerations</h3>
              <p>Regulatory approaches toward digital assets may vary by jurisdiction.</p>
              <p>Users are responsible for ensuring that their participation complies with the laws and regulations of
                their
                respective regions.</p>
              <p> FilNote will continue to adhere to applicable legal frameworks and monitor relevant regulatory
                developments.
              </p>

              <h3> 5. Acknowledgment of Risk</h3>
              <p>By continuing to use the FilNote platform or participating in any investment activity, you acknowledge
                that
                you
                have read, understood, and accepted the contents of this Risk Disclosure Statement and that you agree to
                assume
                all relevant risks voluntarily.
              </p>
            </div>
          </q-scroll-area>
        </q-tab-panel>
        <q-tab-panel name="contract" class="p-0">
          <q-scroll-area class="h-[500px]">
            <div v-if="contractUrl" class="pdf-container">
              <VuePdfEmbed :source="contractUrl" :page="currentPage" class="pdf-viewer" @loaded="handlePdfLoaded" />
              <div v-if="totalPages > 1" class="pdf-controls flex items-center justify-center space-x-2 py-2">
                <q-btn dense flat icon="chevron_left" @click="previousPage" :disable="currentPage <= 1" />
                <span class="text-sm">{{ currentPage }} / {{ totalPages }}</span>
                <q-btn dense flat icon="chevron_right" @click="nextPage" :disable="currentPage >= totalPages" />
              </div>
            </div>
            <div v-else class="text-center text-grey py-10">
              <q-icon name="description" size="3em" />
              <p class="mt-4">No contract available</p>
            </div>
          </q-scroll-area>
        </q-tab-panel>
        <q-tab-panel name="privacy" class="p-0">
          <q-scroll-area class="h-[500px]">
            <div v-if="privacyDataLoading" class="text-center text-grey py-10">
              <q-spinner color="primary" size="3em" />
              <p class="mt-4">Loading privacy certificate preview...</p>
            </div>
            <q-list v-else-if="privacyData" separator>
              <q-item v-for="(value, key) in privacyData" :key="key">
                <q-item-section side>
                  {{ key }}
                </q-item-section>
                <q-item-section>
                  <q-item-label>{{ String(value) }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
            <div v-else class="text-center text-grey py-10">
              <q-icon name="lock" size="3em" />
              <p class="mt-4">No privacy certificate preview available</p>
            </div>
          </q-scroll-area>
        </q-tab-panel>
      </q-tab-panels>
      <q-card-section class="flex justify-center space-x-2">
        <q-btn label="Cancel" color="negative" unelevated @click="onCancel" />
        <q-btn :label="acceptDisabled ? `Accept risk (${acceptCountdown}s)` : 'Accept risk'" :disable="acceptDisabled"
          color="primary" unelevated @click="confirm" />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { noteContractUrl } from 'src/common/tools';
import { ref, onBeforeUnmount, computed, watch } from 'vue';
import type { Note } from 'src/common/types';
import VuePdfEmbed from 'vue-pdf-embed';

const visible = ref(false);
const noteRef = ref<Note>();
const confirmCallback = ref<() => void>();
const acceptDisabled = ref(true);
const acceptCountdown = ref(10);
let countdownTimer: number | undefined;
const tab = ref('agreement');
const currentPage = ref(1);
const totalPages = ref(0);
const privacyData = ref<Record<string, unknown> | null>(null);
const privacyDataLoading = ref(false);

const contractUrl = computed(() => {
  if (!noteRef.value?.contractHash) return null;
  return noteContractUrl(noteRef.value.contractHash);
});

const privacyPreviewUrl = computed(() => {
  if (!noteRef.value?.privacyCredentialsAbridgedHash) return null;
  return `https://indigo-electronic-camel-507.mypinata.cloud/ipfs/${noteRef.value.privacyCredentialsAbridgedHash}`;
});

async function loadPrivacyData() {
  if (!privacyPreviewUrl.value) {
    privacyData.value = null;
    return;
  }
  privacyDataLoading.value = true;
  try {
    const response = await fetch(privacyPreviewUrl.value);
    if (response.ok) {
      const data = await response.json();
      privacyData.value = data;
    } else {
      privacyData.value = null;
    }
  } catch (error) {
    console.error('Failed to load privacy data:', error);
    privacyData.value = null;
  } finally {
    privacyDataLoading.value = false;
  }
}

watch(privacyPreviewUrl, () => {
  if (privacyPreviewUrl.value) {
    void loadPrivacyData();
  } else {
    privacyData.value = null;
  }
});

watch(tab, (newTab) => {
  if (newTab === 'privacy' && privacyPreviewUrl.value && !privacyData.value && !privacyDataLoading.value) {
    void loadPrivacyData();
  }
});

watch(contractUrl, () => {
  currentPage.value = 1;
  totalPages.value = 0;
});

function previousPage() {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
}

function nextPage() {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
}

function handlePdfLoaded(pdf: { numPages: number } | null) {
  if (pdf && 'numPages' in pdf) {
    totalPages.value = pdf.numPages;
  }
}
function startCountdown() {
  acceptDisabled.value = true;
  acceptCountdown.value = 10;
  if (countdownTimer !== undefined) {
    clearInterval(countdownTimer);
    countdownTimer = undefined;
  }
  countdownTimer = window.setInterval(() => {
    if (acceptCountdown.value <= 1) {
      acceptCountdown.value = 0;
      acceptDisabled.value = false;
      if (countdownTimer !== undefined) {
        clearInterval(countdownTimer);
        countdownTimer = undefined;
      }
      return;
    }
    acceptCountdown.value -= 1;
  }, 1000);
}

function stopCountdown() {
  if (countdownTimer !== undefined) {
    clearInterval(countdownTimer);
    countdownTimer = undefined;
  }
}
function showInvestmentRecognition(note: Note, callback: () => void) {
  visible.value = true;
  noteRef.value = note;
  confirmCallback.value = callback;
  startCountdown();
}

function confirm() {
  if (acceptDisabled.value) return;
  visible.value = false;
  confirmCallback.value?.();
  stopCountdown();
}

function onCancel() {
  visible.value = false;
  stopCountdown();
}

onBeforeUnmount(() => {
  stopCountdown();
});

defineExpose({ showInvestmentRecognition });
</script>

<style scoped>
.pdf-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.pdf-viewer {
  width: 100%;
  max-width: 100%;
}

.pdf-controls {
  margin-top: 10px;
  padding: 8px;
  background-color: rgba(0, 0, 0, 0.05);
  border-radius: 4px;
}
</style>
