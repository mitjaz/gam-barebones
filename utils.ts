import {AdType, AdFormatLabel} from 'react-native-heja-gam';
import {AdTemplateType} from './types';

const replaceAdTitles = {
  pro: 'Heja-Pro: ',
  plus: 'Heja-Plus: ',
  plain: 'Heja: ',
};

export function decideAdTemplate(event?: AdType): AdTemplateType {
  if (!event?.type || event.type !== AdFormatLabel.NATIVE) {
    return AdTemplateType.TAGGED;
  }

  let headline = event.headline;

  if (__DEV__ && headline?.startsWith('Test mode:')) {
    headline = headline.replace('Test mode: ', '');
  }

  if (!headline) {
    return AdTemplateType.TAGGED;
  }

  if (headline.startsWith(replaceAdTitles.pro)) {
    return AdTemplateType.PRO;
  }

  if (headline.startsWith(replaceAdTitles.plus)) {
    return AdTemplateType.PLUS;
  }

  if (headline.startsWith(replaceAdTitles.plain)) {
    return AdTemplateType.PLAIN;
  }

  return AdTemplateType.TAGGED;
}

export function adHasIcon(ad?: AdType) {
  if (ad?.type !== AdFormatLabel.NATIVE) {
    return false;
  }

  return !!ad.icon;
}

export function getAdAspectRatio(ad?: AdType) {
  if (ad?.type !== AdFormatLabel.NATIVE || !ad.images?.[0]) {
    return undefined;
  }

  return ad.images[0].width / ad.images[0].height;
}

export function parseGamAdHeadline(title: string | null | undefined) {
  console.log('title', JSON.stringify(title, null, 2));

  if (!title) {
    return '';
  }

  for (const replace of Object.values(replaceAdTitles)) {
    if (title.includes(replace)) {
      return title.replace(replace, '').trim();
    }
  }

  return title;
}
