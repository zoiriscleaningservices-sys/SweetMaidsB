import { residentialPages } from './data_residential';
import { specializedPages } from './data_specialized';
import { commercialPages } from './data_commercial';
import { infoPages } from './data_info';
import { LongboatPageData } from './data_residential';

export const pageDefinitions: Record<string, LongboatPageData> = {
  ...residentialPages,
  ...specializedPages,
  ...commercialPages,
  ...infoPages
};
