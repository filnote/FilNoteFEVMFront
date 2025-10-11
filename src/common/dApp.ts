import { Contract, JsonRpcProvider } from 'ethers';
import { Network } from './const';
import { FilNoteABI, FilNoteAddress } from './FilNoteABI';
import type { ReadArgs } from './types';
import { ProtocolsABI } from './ProtocolsABI';

export const contractRead = (args: ReadArgs) => {
  const rpcProvider = new JsonRpcProvider(Network.rpcUrls.default.http[0]);
  const contract = new Contract(FilNoteAddress, FilNoteABI, rpcProvider);
  const contractMethod = contract[args.functionName];
  if (typeof contractMethod === 'function') {
    return contractMethod(...args.args);
  }
  throw new Error(`Function ${args.functionName} not found on contract`);
};

export const contractReadProtocols = (args: ReadArgs, address: string) => {
  const rpcProvider = new JsonRpcProvider(Network.rpcUrls.default.http[0]);
  const contract = new Contract(address, ProtocolsABI, rpcProvider);
  const contractMethod = contract[args.functionName];
  if (typeof contractMethod === 'function') {
    return contractMethod(...args.args);
  }
  throw new Error(`Function ${args.functionName} not found on contract`);
};
