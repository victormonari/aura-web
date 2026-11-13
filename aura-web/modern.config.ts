import { appTools, defineConfig } from '@modern-js/app-tools';

// https://modernjs.dev/en/configure/app/usage
export default defineConfig({
  plugins: [appTools()],
  source: {
    globalVars: {
      'process.env.SUPABASE_URL': process.env.SUPABASE_URL ?? '',
      'process.env.SUPABASE_ANON_KEY': process.env.SUPABASE_ANON_KEY ?? '',
    },
  },
  html: {
    title: 'Aura Rest',
    favicon: './config/public/aura-simbolo.png',
  },
});
