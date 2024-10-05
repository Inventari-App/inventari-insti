import { DocumentWithFields } from "../db/middlewares"

export function getExpirationTs(expiresInMs = 10 * 60 * 1000) { // 10 mins
  const nowMs = new Date().getTime()
  const expirationMs = nowMs + expiresInMs
  return expirationMs
}

export function getProtocol() {
  return process.env.NODE_ENV === 'prod' ? 'https' : 'http'
}

export function localizeBoolean(val: boolean) {
  return val ? "Si" : "No"
}

export function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export function twoDecimals(val: string) {
  try {
    return parseFloat(val).toFixed(2)
  } catch {
    return val
  }
}

export function capitalizeFirstLetter(str: string) {
  if (str.length === 0) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export function sortByKey(items: DocumentWithFields[], key: string) {
  try {
    return items.sort((a, b) => a[key].toLowerCase() < b[key].toLowerCase() ? -1 : 1)
  } catch  {
    return items
  }
}

export const isProduction = process.env.NODE_ENV === "production"

