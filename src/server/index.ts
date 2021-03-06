// process.env.NODE_ENV = 'production';

import { webpack } from 'webpack';
import { webpackDevMiddleware } from 'webpack-dev-middleware';
import { webpackHotMiddleware } from 'webpack-hot-middleware';
let indexPage = require('./index.jade');
let iframePage = require('./iframe.jade');
import { express } from 'express';
import { program } from 'commander';
import { packageJson } from '../../package.json';
import { config } from './webpack.config';
import { path } from 'path';
import { fs } from 'fs';

const logger = console;

program
  .version(packageJson.version)
  .option('-p, --port [number]', 'Port to run Storybook (Required)', parseInt)
  .option('-s, --static-dir [dir-name]', 'Directory where to load static files from')
  .parse(process.argv);

if (!program.port) {
  logger.error('Error: port to run Storybook is required!\n');
  program.help();
  process.exit(-1);
}

const app = express();

if (program.staticDir) {
  const staticPath = path.resolve(program.staticDir);
  if (fs.existsSync(staticPath)) {
    logger.log(`=> Loading static files from: ${staticPath} .`);
    app.use(express.static(staticPath));
  } else {
    logger.error(`Error: no such directory to load static files: ${staticPath}`);
    process.exit(-1);
  }
}

const compiler = webpack(config);
const devMiddlewareOptions = {
  noInfo: true,
  publicPath: config.output.publicPath,
};
app.use(webpackDevMiddleware(compiler, devMiddlewareOptions));
app.use(webpackHotMiddleware(compiler));

app.get('/', function (req, res) {
  res.send(indexPage);
});

app.get('/iframe', function (req, res) {
  res.send(iframePage);
});

app.listen(program.port, function (error) {
  if (error) {
    throw error;
  } else {
    logger.info(`\nNg2 Storybook started on => http://localhost:${program.port}/ \n`);
  }
});
