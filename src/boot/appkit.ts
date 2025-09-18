import { defineBoot } from '@quasar/app-vite/wrappers';
import { createAppKit } from '@reown/appkit/vue';
import { Network } from 'src/common/const';
import { EthersAdapter } from '@reown/appkit-adapter-ethers';
import type { ChainAdapter } from '@reown/appkit-controllers';

export default defineBoot(({ app }) => {
  const appkit = createAppKit({
    projectId: process.env.APPKIT_PROJECT_ID,
    networks: [Network],
    adapters: [new EthersAdapter() as ChainAdapter],
    features: {
      analytics: true,
      email: false,
      socials: [],
      history: true,
    },
    themeMode: 'dark',
  });
  app.config.globalProperties.$appkit = appkit;
});
