<template>
  <ul class="note-countdown">
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
</template>
<script setup lang="ts">
import type { Note } from 'src/common/types';
import { onMounted, type PropType, ref } from 'vue';

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


onMounted(() => {
  startCountdown();
});

function startCountdown() {
  const countdown = setInterval(() => {
    const now = new Date();
    const diff = Number(props.note.expiryTime) * 1000 - now.getTime();
    if (diff <= 0) {
      clearInterval(countdown);
      d.value = 0;
      h.value = 0;
      m.value = 0;
      s.value = 0;
      return;
    }
    d.value = Math.floor(diff / (1000 * 60 * 60 * 24));
    h.value = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    m.value = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    s.value = Math.floor((diff % (1000 * 60)) / 1000);
  }, 1000);
  return countdown;
}

</script>
