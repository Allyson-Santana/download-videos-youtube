import 'dotenv/config';
import config from './config.js';
import server from './server.js';

server.listen(config.port, () => {
 console.info(`Listening: Server running at ${config.port}`)
})

process.on('uncaughtException', (error) => {
  console.error(`unhandledRejection happened: ${error.stack || error }`)
});
process.on('unhandledRejection', (error) => { 
  console.error(`unhandledRejection happened: ${error.stack || error }`)
});