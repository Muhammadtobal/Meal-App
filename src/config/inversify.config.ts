import "reflect-metadata";
import { Container } from "inversify";
import { AuthService } from "../services/auth.service";
import { TYPES } from "../config/types.config";
import { UserController } from "../controllers/user.controller";
import { UserService } from "../services/user.service";
import { AuthController } from "../controllers/auth.controller";
import { CategoryService } from "../services/category.service";
import { CategoryController } from "../controllers/category.controller";
import { ItemController } from "../controllers/item.controller";
import { ItemService } from "../services/item.service";
import { OrderService } from "../services/order.service";
import { ReservationService } from "../services/reservation.service";
import { ReservationController } from "../controllers/reservation.controller";
import { OrderController } from "../controllers/order.cotroller";
import { OrderDetailController } from "../controllers/orderdetail.controller";
import { OrderDetailService } from "../services/orderdetail.service";
import { PaymentService } from "../services/payments.service";
import { PaymentController } from "../controllers/payments.controller";
import { TableController } from "../controllers/table.controller";
import { TableService } from "../services/table.service";
import { PassportConfig } from "../middleware/passport";
const container = new Container();
container.bind<AuthController>(TYPES.AuthController).to(AuthController);
container.bind<AuthService>(TYPES.AuthService).to(AuthService);
container.bind<UserController>(TYPES.UserController).to(UserController);
container.bind<UserService>(TYPES.UserService).to(UserService);
container.bind<CategoryService>(TYPES.CategoryService).to(CategoryService);
container
  .bind<CategoryController>(TYPES.CategoryController)
  .to(CategoryController);
container.bind<ItemController>(TYPES.ItemController).to(ItemController);
container.bind<ItemService>(TYPES.ItemService).to(ItemService);
container.bind<OrderService>(TYPES.OrderService).to(OrderService);
container.bind<OrderController>(TYPES.OrderController).to(OrderController);
container
  .bind<ReservationService>(TYPES.ReservationService)
  .to(ReservationService);
container
  .bind<ReservationController>(TYPES.ReservationController)
  .to(ReservationController);
container
  .bind<OrderDetailController>(TYPES.OrderDetailController)
  .to(OrderDetailController);
container
  .bind<OrderDetailService>(TYPES.OrderDetailService)
  .to(OrderDetailService);
container.bind<PaymentService>(TYPES.PaymentService).to(PaymentService);
container
  .bind<PaymentController>(TYPES.PaymentController)
  .to(PaymentController);
container.bind<TableController>(TYPES.TableController).to(TableController);
container.bind<TableService>(TYPES.TableService).to(TableService);
container.bind(PassportConfig).to(PassportConfig).inSingletonScope();
export { container };
