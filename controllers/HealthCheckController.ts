import { Router } from "express";

import * as HealthCheckService from "../services/HealthCheckService";

const HealthCheckController: Router = Router();

HealthCheckController.get("/health-check", HealthCheckService.Check);

export default HealthCheckController;