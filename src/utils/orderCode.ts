"use client";
const MONTH_CODE_MAP = [
  'A',
  'B',
  'C',
  'D',
  'E',
  'F',
  'G',
  'H',
  'I',
  'J',
  'K',
  'L',
];

export const generateOrderCode = (date = new Date()) => {
  const monthCode = MONTH_CODE_MAP[date.getMonth()] || 'X';
  const yearCode = String(date.getFullYear()).slice(-2);
  const rand = String(Math.floor(Math.random() * 10000)).padStart(4, '0');

  return `ORD-${monthCode}${yearCode}-${rand}`;
};

export const getOrderCode = (order) => {
  if (order?.orderCode) return order.orderCode;

  const fallbackId = String(order?.id || '')
    .slice(-6)
    .toUpperCase();

  return fallbackId ? `ORD-LEG-${fallbackId}` : 'ORD-UNKNOWN';
};
