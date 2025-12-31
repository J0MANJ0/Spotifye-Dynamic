import { CHART_CONTROLLER } from 'controllers/chart.controller';
import { Router } from 'express';

const chartRouter = Router();

chartRouter.get('/', CHART_CONTROLLER.GET_CHART);

export default chartRouter;
