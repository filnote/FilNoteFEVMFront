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
              <q-file :rules="[(val) => !emptyString(val) || 'Contract file is required']" v-model="form.contractFile"
                label="Please upload the contract file (Required)" outlined accept=".pdf" />
            </div>
            <div class="mt-3">
              <q-file v-model="form.privacyCertificateFile"
                label="Please upload the privacy certificate file (Optional)" outlined accept=".pdf" />
            </div>
            <div class="mt-3">
              <div class="text-subtitle2 q-mb-sm">Public Information (Optional)</div>
              <div v-for="(item, index) in form.jsonData" :key="index" class="row q-gutter-sm q-mb-sm">
                <q-input v-model="item.key" label="Key" outlined dense class="col-5"
                  :rules="[(val) => !!val || 'Key is required']" />
                <q-input v-model="item.value" label="Value" outlined dense class="col-5"
                  :rules="[(val) => !!val || 'Value is required']" />
                <q-btn icon="delete" color="negative" outline unelevated dense @click="removeJsonDataItem(index)"
                  class="col-1" />
              </div>
              <q-btn icon="add" label="Add Field" color="primary" outline unelevated dense @click="addJsonDataItem"
                class="q-mt-sm" />
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
interface JsonDataItem {
  key: string;
  value: string;
}

const form = ref({
  contractHash: '',
  contractFile: undefined as File | undefined,
  privacyCertificateFile: undefined as File | undefined,
  jsonData: [] as JsonDataItem[],
});

function addJsonDataItem() {
  form.value.jsonData.push({ key: '', value: '' });
}

function removeJsonDataItem(index: number) {
  form.value.jsonData.splice(index, 1);
}
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
  let contractHash = '';
  let encryptedPrivacyCertificateHash = '';
  let privacyCredentialsAbridgedHash = '';
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
    formData.append('address', address);
    // Append contract file with fieldname 'contract'
    formData.append('contract', form.value.contractFile);
    // Append privacy certificate file if provided
    if (form.value.privacyCertificateFile) {
      formData.append('privacyCertificate', form.value.privacyCertificateFile);
    }
    // Append jsonData if provided
    if (form.value.jsonData.length > 0) {
      const jsonDataObj: Record<string, unknown> = {};
      form.value.jsonData.forEach((item) => {
        if (item.key && item.value) {
          jsonDataObj[item.key] = item.value;
        }
      });
      if (Object.keys(jsonDataObj).length > 0) {
        formData.append('jsonData', JSON.stringify(jsonDataObj));
      }
    }
    const uploadResponse = await httpApi.uploadContract(formData);
    contractHash = uploadResponse.data.contractHash;
    encryptedPrivacyCertificateHash =
      uploadResponse.data.encryptedPrivacyCertificateHash || '';
    privacyCredentialsAbridgedHash =
      uploadResponse.data.privacyCredentialsAbridgedHash || '';
  } catch (error) {
    swalAlert.error(`${error instanceof Error ? error.message : 'Unknown error'}`);
    return;
  } finally {
    writeProps.setLoading(false);
  }
  if (!contractHash) {
    return;
  }
  void writeProps.write({
    functionName: 'pendingNote',
    args: [
      noteId.value,
      contractHash,
      encryptedPrivacyCertificateHash,
      privacyCredentialsAbridgedHash,
    ],
  });
}

function resetForm() {
  form.value.contractHash = '';
  form.value.contractFile = undefined;
  form.value.privacyCertificateFile = undefined;
  form.value.jsonData = [];
}



defineExpose({ showReviewNote });
</script>
