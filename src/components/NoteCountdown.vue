<template>
  <div v-if="isExpired" class="text-center text-negative">
    <q-icon name="error" size="md" />
    <span class="ml-2">Expired</span>
  </div>
  <ul v-else-if="isValid" class="note-countdown">
    <li>
      <span>{{ d }}</span>
      <span class="label">.D</span>
    </li>
    <li>
      <span>{{ h }}</span>
      <span class="label">.H</span>
    </li>
    <li>
      <span>{{ m }}</span>
      <span class="label">.M</span>
    </li>
    <li>
      <span>{{ s }}</span>
      <span class="label">.S</span>
    </li>
  </ul>
  <div v-else class="text-center text-grey">
    <span>Invalid expiry time</span>
  </div>
</template>
<script setup lang="ts">
import type { Note } from 'src/common/types';
import { onMounted, onBeforeUnmount, watch, type PropType, ref } from 'vue';

const props = defineProps({
  note: {
    type: Object as PropType<Note>,
    required: true,
  },
});

const d = ref(0);
const h = ref(0);
const m = ref(0);
const s = ref(0);
const isExpired = ref(false);
const isValid = ref(true);

let countdownTimer: number | undefined;

onMounted(() => {
  startCountdown();
});

onBeforeUnmount(() => {
  if (countdownTimer !== undefined) {
    clearInterval(countdownTimer);
    countdownTimer = undefined;
  }
});

// Watch for note changes to restart countdown
watch(() => props.note?.expiryTime, () => {
  startCountdown();
}, { deep: true });

function startCountdown() {
  // Check if expiryTime is valid
  const expiryTime = props.note?.expiryTime;
  if (!expiryTime || expiryTime === 0 || expiryTime === null || expiryTime === undefined) {
    isValid.value = false;
    isExpired.value = false;
    return;
  }

  isValid.value = true;

  if (countdownTimer !== undefined) {
    clearInterval(countdownTimer);
  }

  countdownTimer = window.setInterval(() => {
    const now = new Date();
    const expiryTimestamp = Number(expiryTime) * 1000;
    const diff = expiryTimestamp - now.getTime();

    if (diff <= 0) {
      if (countdownTimer !== undefined) {
        clearInterval(countdownTimer);
        countdownTimer = undefined;
      }
      d.value = 0;
      h.value = 0;
      m.value = 0;
      s.value = 0;
      isExpired.value = true;
      return;
    }

    isExpired.value = false;
    d.value = Math.floor(diff / (1000 * 60 * 60 * 24));
    h.value = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    m.value = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    s.value = Math.floor((diff % (1000 * 60)) / 1000);
  }, 1000);
}

</script>
