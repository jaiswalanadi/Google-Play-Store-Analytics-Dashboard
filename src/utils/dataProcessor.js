import _ from 'lodash';
import { INSTALL_RANGES } from './constants';

/**
 * Converts size string to bytes
 * @param {string} sizeString - Size string like "19M", "8.7M", "14k"
 * @returns {number} Size in bytes
 */
export const convertSizeToBytes = (sizeString) => {
  if (!sizeString || sizeString === 'Varies with device') {
    return null;
  }
  
  const sizeStr = String(sizeString).toLowerCase();
  const numericValue = parseFloat(sizeStr);
  
  if (sizeStr.includes('k')) {
    return numericValue * 1024;
  } else if (sizeStr.includes('m')) {
    return numericValue * 1024 * 1
