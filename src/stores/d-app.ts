import { defineStore, acceptHMRUpdate } from 'pinia';
import { handleAddress } from 'src/common/tools';
import { useAppKitProvider } from '@reown/appkit/vue';
import { BrowserProvider, type Eip1193Provider } from 'ethers';
import { contractRead } from 'src/common/dApp';

export const useDAppStore = defineStore('d-app', {
  state: () => ({
    address: '',
    addressShort: '',
    ownerAddress: '',
    auditors: [] as string[],
    balance: BigInt(0),
  }),

  actions: {
    clearDappAccount() {
      this.address = '';
      this.addressShort = '';
      this.balance = BigInt(0);
    },
    setAddress(address: string) {
      this.address = address;
      this.addressShort = handleAddress(address);
    },
    setOwnerAddress(address: string) {
      this.ownerAddress = address;
    },
    isAuditor(address: string): boolean {
      return this.auditors.includes(address);
    },
    async getAuditors() {
      try {
        const result = (await contractRead({ functionName: 'getAuditors', args: [] })) as string[];
        this.auditors = result;
      } catch {
        this.auditors = [];
      }
    },
    async signMessage(message: string): Promise<string> {
      try {
        const { walletProvider } = useAppKitProvider('eip155');
        if (!walletProvider) {
          throw new Error('Wallet not connected');
        }
        const etherProvider = new BrowserProvider(walletProvider as Eip1193Provider);
        const signer = await etherProvider.getSigner();
        return await signer.signMessage(message);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to sign message';
        throw new Error(errorMessage);
      }
    },
    async updateBalance() {
      if (!this.address) {
        this.balance = BigInt(0);
        return;
      }
      try {
        const { walletProvider } = useAppKitProvider('eip155');
        if (!walletProvider) {
          this.balance = BigInt(0);
          return;
        }
        const etherProvider = new BrowserProvider(walletProvider as Eip1193Provider);
        const balance = await etherProvider.getBalance(this.address);
        this.balance = balance;
      } catch {
        // Silently fail - balance update is not critical
      }
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useDAppStore, import.meta.hot));
}
