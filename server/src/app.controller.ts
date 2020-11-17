import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@Controller()
export class AppController {

	@ApiTags('health')
	@Get('/ping')
	ping(): any {
		return {
			pong: new Date().toISOString(),
		};
	}
}
