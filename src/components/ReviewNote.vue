<template>
  <q-dialog v-model="visible" persistent>
    <WriteContract :on-success="handleReviewSuccess">
      <template #body="{ props }">
        <q-card-section class="bg-primary text-center">
          <h3 class="text-white text-2xl font-bold">Review Note</h3>
        </q-card-section>
        <q-card-section>
          <q-form @submit="reviewNote(props)">
            <div>
              <q-file :rules="[val => !emptyString(val) || 'Contract Hash is required']" v-model="form.contractFile"
                label="Please upload the contract file" outlined accept=".pdf" />
            </div>
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
import type { WriteProps } from 'src/common/types';
import WriteContract from 'components/WriteContract.vue';
import { emptyString, swalAlert } from 'src/common/tools';
import { httpApi } from 'src/common/api';
import { useDAppStore } from 'src/stores/d-app';
const visible = ref(false);
const noteId = ref<bigint>(BigInt(0));
const dAppStore = ref(useDAppStore());

const props = defineProps({
  refreshData: {
    type: Function,
    default: () => { },
  },
});
const form = ref({
  contractHash: '',
  contractFile: undefined,
});
function showReviewNote(id: bigint) {
  visible.value = true;
  noteId.value = id;
}

function hideReviewNote() {
  visible.value = false;
  resetForm();
}

function handleReviewSuccess() {
  hideReviewNote();
  props.refreshData?.();
}

async function reviewNote(writeProps: WriteProps) {
  let uid = '';
  try {
    if (!form.value.contractFile) {
      swalAlert.error('Contract file is required');
      return;
    }
    writeProps.setLoading(true);
    const address = dAppStore.value.address;
    const response = await httpApi.getVerifyUuid(address);
    const message = response.data;
    const formData = new FormData();
    const signature = await dAppStore.value.signMessage(message);
    formData.append('signature', signature);
    formData.append('file', form.value.contractFile);
    formData.append('address', address);
    const uploadResponse = await httpApi.uploadContract(formData);
    uid = uploadResponse.data;
  } catch (error) {
    swalAlert.error(`${error instanceof Error ? error.message : 'Unknown error'}`);
    return;
  } finally {
    writeProps.setLoading(false);
  }
  if (!uid) {
    return;
  }
  void writeProps.write({ functionName: 'pendingNote', args: [noteId.value, uid] });
}

function resetForm() {
  form.value.contractHash = '';
  form.value.contractFile = undefined;
}



defineExpose({ showReviewNote });
</script>
