import LazyModule from './lazyModule';
import { setSession } from '@/utils/element';

const isSpaMode = process.env.BUILD_MODE === 'spa';
const resourceCdn = isSpaMode
  ? ''
  : typeof window !== 'undefined'
  ? window.cdn + '/'
  : '/';
const lazyModule = new LazyModule({
  sourceMap: {
    light: { type: 'css', path: resourceCdn + 'themes/light.css' },
    dark: { type: 'css', path: resourceCdn + 'themes/dark.css' }
  },
  versionMeta: 'resource-version'
});
const STATIC_THEME = process.env.THEME;

export let THEME = process.env.THEME;

export async function changeTheme(theme) {
  let lastTheme = THEME;

  if (theme && lastTheme !== theme) {
    // 修改主题
    THEME = theme;
    setSession('theme', theme);
    if (STATIC_THEME === theme) {
      await lazyModule.remove(lastTheme);
    } else {
      await lazyModule.load(theme);
    }
  }

  return theme;
}
