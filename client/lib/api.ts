import axios from 'axios';
import { ENV } from './envs';

export const api = axios.create({
  baseURL: ENV.SERVER_URL,
  withCredentials: true,
});
