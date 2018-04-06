import Seneca from 'seneca';
import SenecaPromise from 'seneca-promise';

export const createNode = ({node, context: parentContext, enviroment, register, worker}) => {

  if (!worker) {
    throw new Error("node.error.worker.undefined");
  }

  const {logger} = parentContext;

  const seneca = Seneca();
  seneca.use(SenecaPromise);

  const context = {
    seneca,
    ...parentContext
  };

  logger.debug("Register listener for service");
  register && register({node, context, enviroment});

  seneca.ready(async () => {
    logger.debug("Listener ready");
    await worker({node, context, enviroment});
  });

}
