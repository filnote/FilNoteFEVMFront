<template>
  <q-dialog v-model="visible" persistent>
    <WriteContract :on-success="handleReviewSuccess" :no-card="true">
      <template #body="{ props }">
        <q-card style="min-width: 500px">
          <q-card-section class="bg-primary text-white">
            <div class="text-h6 text-center">Review Note</div>
          </q-card-section>
          <q-card-section>
            <q-form @submit="reviewNote(props)" class="space-y-2">
              <q-file v-model="form.contractFile" label="Contract File *" outlined accept=".pdf"
                :rules="[(val) => !emptyString(val) || 'Required']" />
              <q-file v-model="form.privacyCertificateFile" label="Privacy Certificate File (Optional)" outlined
                accept=".pdf" />
              <div class="py-2 px-4 bg-grey-1 rounded-md space-y-2">
                <div class="flex items-center justify-between">
                  <div class="font-bold">
                    Public Information
                    <span v-if="form.privacyCertificateFile" class="text-negative">*</span>
                    <span v-else class="text-grey-6">(Optional)</span>
                  </div>
                  <q-btn icon="add" label="Add Field" outline @click="addJsonDataItem" />
                </div>
                <div v-for="(item, index) in form.jsonData" :key="index" class="flex items-center space-x-3">
                  <q-input v-model="item.key" label="Key" outlined dense class="flex-1" />
                  <q-input v-model="item.value" label="Value" outlined dense class="flex-1" />
                  <q-btn icon="delete" flat dense @click="removeJsonDataItem(index)" />
                </div>
              </div>
              <div class="flex items-center space-x-4">
                <q-btn class="flex-1" label="Cancel" outline @click="hideReviewNote" />
                <q-btn class="flex-1" type="submit" label="Submit" color="primary" :loading="props.loading" />
              </div>
            </q-form>
          </q-card-section>
        </q-card>
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
    // If privacy certificate is provided, jsonData (preview version) is required [如果提供了隐私凭证，则 jsonData（预览版本）是必填的]
    if (form.value.privacyCertificateFile) {
      const validJsonData = form.value.jsonData.filter(
        (item) => item.key && item.value,
      );
      if (validJsonData.length === 0) {
        swalAlert.error(
          'Public information (preview of privacy certificate) is required when privacy certificate file is provided',
        );
        return;
      }
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
