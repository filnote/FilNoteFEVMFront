<template>
  <template v-if="emptyString(dAppStore.address)">
    <q-btn :loading="loading" color="white" text-color="black" icon="wallet" label="Connect Wallet"
      @click="openConnectWallet" />
  </template>
  <template v-else>
    <template v-if="showType === 'button'">
      <q-btn :loading="loading" color="white" text-color="black" icon="wallet" :label="dAppStore.addressShort" />
    </template>
    <template v-else>
      <slot name="connected"></slot>
    </template>
  </template>

</template>

<script setup lang="ts">
import { useDAppStore } from 'src/stores/d-app';
import { ref, watch } from 'vue';
import { emptyString } from 'src/common/tools';
import { useAppKit, useAppKitAccount } from '@reown/appkit/vue';
import { contractRead } from 'src/common/dApp';

defineProps({
  showType: {
    type: String,
    default: 'button',
  },
});

const dAppStore = ref(useDAppStore());
const accountData = ref(useAppKitAccount())
const { open } = useAppKit();
const loading = ref(false);

watch(accountData, (newVal) => {
  if (!newVal.isConnected) return;
  dAppStore.value.setAddress(`${newVal.address}`);
  void getOwnerAddress();
}, { deep: true });



async function getOwnerAddress() {
  const result = await contractRead({ functionName: 'owner', args: [] }) as string;
  console.log('ownerAddress', result);
  dAppStore.value.setOwnerAddress(`${result}`);
}


function openConnectWallet() {
  loading.value = true;
  void open({
    view: 'Connect',
  });
}

</script>

<style scoped></style>
