import { Router, Request, Response } from 'express';
import { CustomRequest, addLogger } from '../../services/config/logger';

const loggerRouter = Router();

loggerRouter.get('/', (req: CustomRequest, res: Response) => {
  req.logger.error('Esta es una prueba de log error');
  req.logger.warn('Esta es una prueba de log warn');
  req.logger.info('Esta es una prueba de log info');
  req.logger.http('Esta es una prueba de log http');
  req.logger.verbose('Esta es una prueba de log verbose');
  req.logger.debug('Esta es una prueba de log debug');
  req.logger.silly('Esta es una prueba de log silly');
  res.status(200).send('ok');
});

export default loggerRouter;