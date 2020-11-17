import { NestFactory } from '@nestjs/core';
import { ExpressAdapter, NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as express from 'express';
import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import * as helmet from 'helmet';
import { AppModule } from './app.module';

admin.initializeApp(functions.config().firebase);

const server: express.Express = express();

const startNestApplication = async (expressInstance: express.Express) => {
	const adapter = new ExpressAdapter(expressInstance);
	const app = await NestFactory.create<NestExpressApplication>(AppModule, adapter, {});

	app.use(helmet());
	app.disable('x-powered-by');
	app.disable('X-Powered-By');
	app.use(helmet.hidePoweredBy());
	app.use(helmet.hsts({
		maxAge: 15552000,
		includeSubDomains: false,
	}));

	const allowedOrigins = ['https://admin.cmor.ai', 'https://cmor-admin-dev.web.app'];
	const corsOptions = {
		origin: (origin: string, callback: any) => {
			if (!origin || allowedOrigins.indexOf(origin) !== -1) {
				callback(null, true);
			} else {
				callback(new Error('Not allowed by CORS'));
			}
		},
	};

	app.enableCors(corsOptions);

	const options = new DocumentBuilder()
		.setTitle('CMOR')
		.setDescription('CMOR API documentation')
		.setVersion('1.0')
		.addServer('/api')
		// .addServer('/web-scanner-dev/us-central1/api')
		.addApiKey({
			type: 'apiKey',
			name: 'api-key',
		}, 'api-key')
		.build();
	const document = SwaggerModule.createDocument(app, options, {
	});

	SwaggerModule.setup('doc', app, document);

	const internalOptions = new DocumentBuilder()
		.setTitle('CMOR Admin')
		.setDescription('CMOR Admin API documentation')
		.setVersion('1.0')
		.addServer('/api')
		// .addServer('/web-scanner-dev/us-central1/api')
		.addApiKey({
			type: 'apiKey',
			name: 'api-key',
		}, 'api-key')
		.build();
	const internalDocument = SwaggerModule.createDocument(app, internalOptions, {
	});

	SwaggerModule.setup('doc/admin', app, internalDocument);

	await app.init();
	return app;
};

const main = startNestApplication(server);

export const api = functions.https.onRequest(server as any);
