<template>
  <q-card v-if="!noCard" flat class="relative w-[380px]">
    <slot name="body" :props="{ write: writeContract, loading, setLoading: (value: boolean) => loading = value }">
    </slot>
    <q-banner v-if="transactionError" class="bg-red-100 text-red-500 break-words break-all leading-loose text-xs">
      {{ transactionError }}
    </q-banner>
    <q-inner-loading :showing="loading" v-if="showBoxLoading">
      <q-spinner-radio size="1rem" color="primary" />
    </q-inner-loading>
  </q-card>
  <div v-else>
    <slot name="body" :props="{ write: writeContract, loading, setLoading: (value: boolean) => loading = value }">
    </slot>
  </div>


  <q-dialog persistent v-model="isConfirming">
    <q-card class="min-w-[400px]">
      <q-card-section class="text-center space-y-4 bg-primary">
        <h3 class="text-lg font-serif font-bold text-white">Transaction confirmation</h3>
      </q-card-section>
      <q-card-section class="text-center space-y-4">
        <div class="text-warning space-y-2" v-if="!isConfirmed">
          <q-spinner-gears class="mx-auto" color="warning" size="4em" />
          <p id="waiting_tips" class="text-lg font-serif font-bold"></p>
        </div>
        <div class="text-positive space-y-2" v-if="isConfirmed">
          <q-icon name="check_circle" color="positive" size="5em" />
          <p class="text-positive text-lg font-serif font-bold">Transaction confirmed!</p>
        </div>
      </q-card-section>
      <q-card-section align="center" class="space-x-3">
        <q-btn v-if="result.hash" padding="5px 15px" dense :label="`View on tx: ${handleAddress(result.hash, 3, 4)}`"
          unelevated color="blue" icon="open_in_new" @click="openTx"></q-btn>
        <q-btn v-if="isConfirmed" padding="5px 15px" icon="close" label="Close" outline dense unelevated
          color="negative" @click="closeWriteContract"></q-btn>
      </q-card-section>
    </q-card>
  </q-dialog>

</template>
<script setup lang="ts">
import { useAppKitProvider } from '@reown/appkit/vue';
import type { InterfaceAbi } from 'ethers';
import { BrowserProvider, Contract, type Eip1193Provider } from 'ethers';
import { Network } from 'src/common/const';
import { FilNoteABI, FilNoteAddress } from 'src/common/FilNoteABI';
import { ProtocolsABI } from 'src/common/ProtocolsABI';
import { handleAddress, handleEthErr, swalAlert } from 'src/common/tools';
import type { WriteContractResult, WriteArgs } from 'src/common/types';
import { ref } from 'vue';


const props = defineProps({
  onClose: {
    type: Function,
    default: () => { },
  },
  onSuccess: {
    type: Function,
    default: () => { },
  },
  userSubmit: {
    type: Function,
    default: () => { },
  },
  showBoxLoading: {
    type: Boolean,
    default: true,
  },
  alertError: {
    type: Boolean,
    default: false,
  },
  noCard: {
    type: Boolean,
    default: false,
  },
})

const loading = ref(false);
const transactionError = ref<string>('');
const isConfirming = ref(false);
const isConfirmed = ref(false);
const result = ref<WriteContractResult>({
  hash: '',
});

function openTx() {
  window.open(`${Network.blockExplorers.default.url}/tx/${result.value.hash}`, '_blank');
}

function closeWriteContract() {
  isConfirming.value = false;
  isConfirmed.value = false;
  result.value = {
    hash: '',
  };
  transactionError.value = '';
  loading.value = false;
  props.onClose?.();
}

async function writeContract(args: WriteArgs) {
  try {
    loading.value = true;
    transactionError.value = '';
    const { walletProvider } = useAppKitProvider('eip155');
    const etherProvider = new BrowserProvider(walletProvider as Eip1193Provider);
    const signer = await etherProvider.getSigner();
    let contractAddress = FilNoteAddress;
    let contractABI: InterfaceAbi = FilNoteABI;
    if (args.contractType === 'PROTOCOL') {
      contractAddress = args.contractAddress as string;
      contractABI = ProtocolsABI;
    }
    const contract = new Contract(contractAddress, contractABI, signer);
    const contractMethod = contract[args.functionName];
    if (typeof contractMethod !== 'function') {
      throw new Error(`Function ${args.functionName} not found on contract`);
    }
    if (args.value !== undefined) {
      const set = {
        value: args.value,
      };
      result.value = await contractMethod(...args.args, set);
    } else {
      result.value = await contractMethod(...args.args);
    }
    startWaiting();
    await etherProvider.waitForTransaction(result.value.hash, 1);
    confirmSuccessful();
    return result.value;
  } catch (error) {
    let errorMessage = await handleEthErr(error as object & { message: string });
    const vmErrorMatch = /vm error=\[Error\((.*?)\)\]/.exec(errorMessage)
    if (vmErrorMatch && vmErrorMatch[1]) {
      errorMessage = vmErrorMatch[1]
    }
    loading.value = false;
    if (props.alertError) {
      swalAlert.error(errorMessage);
      return;
    }
    transactionError.value = errorMessage;
  }
}

function confirmSuccessful() {
  isConfirmed.value = true;
  props.onSuccess?.();
}

function startWaiting() {
  props.userSubmit?.();
  isConfirming.value = true;
  const waitingTips = 'Waiting for confirmation.....';
  const waitingTipsElement = document.getElementById('waiting_tips');
  if (waitingTipsElement) {
    let index = 0;
    waitingTipsElement.innerHTML = '';
    const print = () => {
      if (index < waitingTips.length) {
        waitingTipsElement.innerHTML += waitingTips.charAt(index);
        index++;
        setTimeout(print, 100);
      } else {
        setTimeout(() => {
          waitingTipsElement.innerHTML = '';
          index = 0;
          print();
        }, 1000);
      }
    };
    print();
  }
}
</script>
