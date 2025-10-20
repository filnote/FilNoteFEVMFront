<template>
  <q-dialog v-model="visible">
    <q-card class="lg:w-[520px]">
      <q-card-section class="bg-primary text-center">
        <h3 class="text-white text-2xl font-bold">
          Risk confirmation
        </h3>
      </q-card-section>
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
            While the system has undergone internal testing and continuous optimization, its performance may still be
            influenced by network conditions or blockchain activity.
          </p>
          <p>
            FilNote is committed to maintaining system stability and improving user experience.
          </p>

          <h3> 3. Market and Liquidity</h3>
          <p>
            The market value and liquidity of FIL-denominated debt notes may fluctuate based on market demand, network
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
      <q-card-section class="flex justify-center space-x-2">
        <q-btn label="Cancel" color="negative" unelevated @click="onCancel" />
        <q-btn :label="acceptDisabled ? `Accept risk (${acceptCountdown}s)` : 'Accept risk'" :disable="acceptDisabled"
          color="primary" unelevated @click="confirm" />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, onBeforeUnmount } from 'vue';
import type { Note } from 'src/common/types';
const visible = ref(false);
const noteRef = ref<Note>();
const confirmCallback = ref<() => void>();
const acceptDisabled = ref(true);
const acceptCountdown = ref(10);
let countdownTimer: number | undefined;

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
