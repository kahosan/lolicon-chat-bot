import { loliconBot } from '@/lolicon_bot';

loliconBot()
  .launch()
  .catch((e) => {
    console.error(e);
  });
