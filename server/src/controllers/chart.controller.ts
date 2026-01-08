import { Request, Response } from 'express';
import { handleResponse } from '../lib/response';
import { asyncHandler } from '../lib/wrapper';
import { CHART_SERVICE } from '../services/chart.service';

const getChart = asyncHandler(async (_req: Request, res: Response) => {
  const chart = await CHART_SERVICE.FETCH_CHART();

  if (!chart) return handleResponse(res, false, 'No Chart available!', {}, 404);

  return handleResponse(res, true, '', { chart });
});

export const CHART_CONTROLLER = {
  GET_CHART: getChart,
};
