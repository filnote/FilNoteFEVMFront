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
        </q-list>
      </div>
    </q-card-section>
  </q-card>
</template>
<script setup lang="ts">
import { type Note } from 'src/common/types';
import { type PropType } from 'vue';
import { NoteStatus, type NoteStatusKey } from 'src/common/const';
import { handleAddress, weiToEther, bpsToPercentage } from 'src/common/tools';

defineProps({
  item: {
    type: Object as PropType<Note>,
    required: true,
  },
});
</script>
