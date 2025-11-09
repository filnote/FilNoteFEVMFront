<template>
  <template v-if="emptyString(dAppStore.address)">
    <template v-if="mode === 'default'">
      <q-btn :loading="loading" color="white" text-color="black" icon="wallet" label="Connect Wallet"
        @click="openConnectWallet" />
    </template>
    <template v-else-if="mode === 'card'">
      <q-card flat class="mx-auto lg:w-[400px]">
        <q-card-section class="text-center">
          <q-icon name="wallet" size="4em" />
          <p>You need to connect your wallet to continue</p>
        </q-card-section>
        <q-card-section class="text-center">
          <q-btn :loading="loading" color="secondary" unelevated icon="wallet" label="Connect Wallet"
            @click="openConnectWallet" />
        </q-card-section>
      </q-card>
    </template>
  </template>
  <template v-else>
    <template v-if="showType === 'button'">
      <q-btn @click="openAccount" :loading="loading" color="white" text-color="black" icon="wallet"
        :label="dAppStore.addressShort" />
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
import { useAppKit, useAppKitAccount, useAppKitState } from '@reown/appkit/vue';
import { contractRead } from 'src/common/dApp';

defineProps({
  showType: {
    type: String,
    default: 'button',
  },
  mode: {
    type: String,
    default: 'default',
  }
});

const dAppStore = ref(useDAppStore());
const accountData = ref(useAppKitAccount())
const appKitState = ref(useAppKitState());
const { open } = useAppKit();
const loading = ref(false);

watch(appKitState, (newVal) => {
  loading.value = newVal.open;
}, { deep: true });

watch(accountData, (newVal) => {
  if (!newVal.isConnected) {
    dAppStore.value.clearDappAccount();
    return;
  };
  dAppStore.value.setAddress(`${newVal.address}`);
  void getOwnerAddress();
  void dAppStore.value.updateBalance();
}, { deep: true });



async function getOwnerAddress() {
  try {
    const result = (await contractRead({ functionName: 'owner', args: [] })) as string;
    if (result) {
      dAppStore.value.setOwnerAddress(`${result}`);
    }
  } catch {
    // Silently fail - owner address is not critical for basic functionality
  }
}


function openConnectWallet() {
  loading.value = true;
  void open({
    view: 'Connect',
  });
}

function openAccount() {
  loading.value = true;
  void open({
    view: 'Account',
  });
}
</script>

<style scoped></style>
