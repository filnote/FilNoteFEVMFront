<template>
  <div>
    <slot name="body" :read="read"></slot>
  </div>
</template>
<script setup lang="ts">
import { Contract, JsonRpcProvider } from 'ethers';
import { Network } from 'src/common/const';
import { FilNoteABI, FilNoteAddress } from 'src/common/FilNoteABI';

type ContractArg = string | number | bigint | boolean;
type ReadArgs = {
  functionName: string;
  args: ContractArg[];
};

function read(args: ReadArgs) {
  const rpcProvider = new JsonRpcProvider(Network.rpcUrls.default.http[0]);
  const contract = new Contract(FilNoteAddress, FilNoteABI, rpcProvider);
  const contractMethod = contract[args.functionName];
  if (typeof contractMethod === 'function') {
    console.log(args.args);
    return contractMethod(...args.args);
  }
  throw new Error(`Function ${args.functionName} not found on contract`);
}
export type { ReadArgs, ContractArg };
defineExpose({ read });
</script>
