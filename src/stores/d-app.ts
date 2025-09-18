import { defineStore, acceptHMRUpdate } from 'pinia';
import { handleAddress } from 'src/common/tools';

export const useDAppStore = defineStore('d-app', {
  state: () => ({
    address: '',
    addressShort: '',
  }),

  actions: {
    setAddress(address: string) {
      this.address = address;
      this.addressShort = handleAddress(address);
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useDAppStore, import.meta.hot));
}
