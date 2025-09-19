<template>
  <q-dialog v-model="visible">
    <WriteContract :on-success="refreshData" :user-submit="hideReviewNote">
      <template #body="{ props }">
        <q-card-section class="bg-primary text-center">
          <h3 class="text-white text-2xl font-bold">Review Note</h3>
        </q-card-section>
        <q-card-section>
          <q-form @submit="reviewNote(props.write)">
            <q-input :rules="[val => !emptyString(val) || 'Contract Hash is required']" v-model="form.contractHash"
              label="Contract Hash" outlined />
            <div class="flex justify-between space-x-2 mt-5">
              <q-btn class="flex-1" type="submit" label="Review Note" color="primary" unelevated />
              <q-btn type="button" icon="close" outline color="negative" unelevated @click="hideReviewNote" />
            </div>
          </q-form>
        </q-card-section>
      </template>
    </WriteContract>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { WriteArgs, WriteContractResult } from 'src/common/types';
import WriteContract from 'components/WriteContract.vue';
import { emptyString } from 'src/common/tools';
const visible = ref(false);
const noteId = ref<bigint>(BigInt(0));

defineProps({
  refreshData: {
    type: Function,
    default: () => { },
  },
});
const form = ref({
  contractHash: '',
});
function showReviewNote(id: bigint) {
  visible.value = true;
  noteId.value = id;
}

function hideReviewNote() {
  visible.value = false;
}

function reviewNote(write: (args: WriteArgs) => Promise<WriteContractResult | undefined>) {
  void write({ functionName: 'pendingNote', args: [noteId.value, form.value.contractHash] });
}



defineExpose({ showReviewNote });
</script>
