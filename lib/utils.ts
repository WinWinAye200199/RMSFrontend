import { RES_TIME_FORMAT } from "@/constants/dayjs-format";
import { clsx, type ClassValue } from "clsx";
import dayjs from "dayjs";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function isEmptyObj(obj: object | string) {
  return typeof obj === 'object' && Object.keys(obj).length === 0;
}

export enum ConvertibleFormat {
  DATE = 'DD MMM, YYYY',
  TIME = 'hh:mm A'
}

export const convertToDayjs = (value: string, format: ConvertibleFormat) => format === ConvertibleFormat.DATE ?
  dayjs(value).format(format) :
  dayjs(value, RES_TIME_FORMAT).format(format);
