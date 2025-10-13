import BigNumber from 'bignumber.js';
import { formatEther, parseEther, ZeroAddress } from 'ethers';
import { ErrorDecoder } from 'ethers-decode-error';
import Swal from 'sweetalert2';
import { Network } from './const';

export const emptyString = function (str: unknown) {
  return typeof str === 'undefined' || str == null || str === '';
};

export const isZeroAddress = function (address: string) {
  return address === '0x0000000000000000000000000000000000000000000000000000000000000000';
};

export const handleAddress = function (str: string | undefined, before = 6, after = 4) {
  if (emptyString(str) || str === undefined) {
    return '...';
  }
  if (isZeroAddress(str) || str === ZeroAddress) {
    return '...';
  }
  let newStr = str.substring(0, before) + '...';
  newStr += str.substring(str.length - after, str.length);
  return newStr;
};

export const weiToEther = function (
  wei: bigint | number | string | undefined,
  processingAmount = false,
) {
  if (emptyString(wei)) return '...';
  const val = formatEther(wei);
  if (processingAmount) {
    return processingBigAmount(val);
  }
  return val;
};

export const processingBigAmount = function (input: number | string, decimalPlaces = 6) {
  if (isNaN(Number(input)) || !isFinite(Number(input))) return input;
  let [integer, decimal] = input.toString().split('.');
  integer = integer?.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  if (!decimal || decimalPlaces === 0) return integer;
  decimal = decimal.substring(0, decimalPlaces);
  decimal = decimal.replace(/0+$/, '');
  return decimal ? `${integer}.${decimal}` : integer;
};

export const bpsToPercentage = function (bps: bigint | number | string | undefined) {
  if (emptyString(bps)) return '...';
  const bpsBigNumber = new BigNumber(bps.toString());
  const percentage = bpsBigNumber.dividedBy(100);
  return percentage.toNumber();
};

export const calculateInterest = function (
  principalWei: number | string | bigint,
  annualRateBps: number | string | bigint,
  days: number,
): string {
  const principalBN = new BigNumber(principalWei.toString());
  const rateBpsBN = new BigNumber(annualRateBps.toString());

  const dailyRate = rateBpsBN.dividedBy(10000).dividedBy(365);
  const interest = principalBN.multipliedBy(dailyRate).multipliedBy(days);

  return interest.toFixed(0);
};

export async function handleEthErr(err: object & { message: string }) {
  const e = JSON.parse(JSON.stringify(err));
  const { info } = e;
  if (info !== undefined) {
    const { error: jsonE } = info;
    if (jsonE !== undefined) {
      const { data } = jsonE;
      if (data !== undefined && !emptyString(data.message)) {
        return data.message;
      }
    }
  }
  const errorDecoder = ErrorDecoder.create();
  const decodedError = await errorDecoder.decode(err);
  if (!emptyString(decodedError.reason)) {
    return decodedError.reason;
  }
  const match = /"message": "(.*?)"/.exec(err.message);
  if (match && match[1]) {
    const errorMessage = match[1];
    const errorMessageArr = errorMessage.split(':');
    if (errorMessageArr.length > 1) {
      return errorMessageArr[errorMessageArr.length - 1];
    }
    return errorMessage;
  }
  return err.message;
}

export const filToWei = function (fil: number | string) {
  return parseEther(fil.toString());
};

export const swalAlert = {
  warning: (message: string) => {
    void Swal.fire({
      icon: 'warning',
      title: 'Warning',
      text: message,
    });
  },
  error: (message: string) => {
    void Swal.fire({
      icon: 'error',
      customClass: {
        confirmButton:
          'q-btn q-btn-item non-selectable no-outline  q-btn--rectangle bg-negative text-white q-btn--unelevated q-btn--actionable q-focusable q-hoverable ',
      },
      title: 'Error',
      text: message,
      confirmButtonText: `<span class="q-focus-helper" tabindex="-1"></span><span class="q-btn__content text-center col items-center q-anchor--skip justify-center row">I know</span>`,
    });
  },
  success: (message: string) => {
    void Swal.fire({
      icon: 'success',
      customClass: {
        confirmButton:
          'q-btn q-btn-item non-selectable no-outline  q-btn--rectangle bg-primary text-white q-btn--unelevated q-btn--actionable q-focusable q-hoverable ',
      },
      title: 'Success',
      text: message,
      confirmButtonText: `<span class="q-focus-helper" tabindex="-1"></span><span class="q-btn__content text-center col items-center q-anchor--skip justify-center row">I know</span>`,
    });
  },
};

export const openViewAddress = function (address: string | undefined) {
  if (emptyString(address)) return;
  window.open(`${Network.blockExplorers.default.url}/address/${address}`, '_blank');
};

export const justExpiryTime = function (expiryTime: number) {
  const now = new Date();
  const diff = Number(expiryTime) * 1000 - now.getTime();
  if (diff <= 0) {
    return false;
  }
  return true;
};
