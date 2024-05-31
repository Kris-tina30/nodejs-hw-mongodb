import dotenv from 'dotenv';

dotenv.config();

export function env(envName, defaultValue) {
  const value = process.env[envName];

  if (value) return value;

  if (defaultValue) return defaultValue;

  throw new Error(`Missing: process.env['${envName}'].`);
}
