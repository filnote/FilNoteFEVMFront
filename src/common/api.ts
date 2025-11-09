import { api } from 'src/boot/axios';
export const httpApi = {
  //  /verify/get-verify-uuid/{address}
  getVerifyUuid: (address: string) => {
    return api.get(`/verify/get-verify-uuid/${address}`);
  },
  // /verify/upload
  uploadContract: (formData: FormData) => {
    return api.post(`/verify/upload`, formData);
  },
};
