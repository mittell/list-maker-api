import { Container } from 'inversify';
import { DummyController } from '../common/dummy/controllers/dummy.controller';
import { DummyService } from '../common/dummy/services/dummy.services';
import { IController } from '../common/interfaces/controller.interface';
import { IService } from '../common/interfaces/service.interface';
import { TYPES } from '../common/types/di.type';

const myContainer = new Container();
myContainer.bind<IService>(TYPES.IService).to(DummyService);
myContainer.bind<IController>(TYPES.IController).to(DummyController);

export { myContainer };
