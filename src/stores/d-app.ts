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
  }),

  actions: {
    clearDappAccount() {
      this.address = '';
      this.addressShort = '';
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
      const { walletProvider } = useAppKitProvider('eip155');
      const etherProvider = new BrowserProvider(walletProvider as Eip1193Provider);
      const signer = await etherProvider.getSigner();
      return await signer.signMessage(message);
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useDAppStore, import.meta.hot));
}
