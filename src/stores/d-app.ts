import { defineStore, acceptHMRUpdate } from 'pinia';
import { handleAddress } from 'src/common/tools';
import { useAppKitProvider } from '@reown/appkit/vue';
import { BrowserProvider, type Eip1193Provider } from 'ethers';

export const useDAppStore = defineStore('d-app', {
  state: () => ({
    address: '',
    addressShort: '',
    ownerAddress: '',
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
