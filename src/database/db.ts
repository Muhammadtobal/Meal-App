import "reflect-metadata"
import {DataSource} from "typeorm"
import {resolve} from "path"
import { User } from "../entities/user.entity";
import { Reservation } from "../entities/reservation.entity";
import { Payment } from "../entities/payments.entity";
import { Order } from "../entities/order.entity";
import { OrderDetail } from "../entities/orderdetail.entity";
import { Item } from "../entities/item.entity";
import { Category } from "../entities/category.entitiy";
import { Table } from "../entities/tabel.entitiy";
import {config} from "dotenv"
config()
const AppDataSource = new DataSource({
    type: "mysql",
    host: process.env.LOCALHOST,
    port: Number(process.env.PORTDATABASDE)  ,
    username: process.env.USER_NAME,
    password: process.env.PASSWORD,
    database:process.env.DATABASE_NAME,
    synchronize: false, 
    logging: true,
    entities: [Table,User,Reservation,Payment,Order,OrderDetail,Item,Category], // تأكد من إدخال الكيانات الخاصة بك هنا
    // تأكد من المسار الصحيح للمهاجرات، هنا نعتمد على ملفات .ts في بيئة التطوير
    migrations: [resolve(__dirname, "../database/migrations/*.ts")],
    // إذا كنت في بيئة الإنتاج، تأكد من استخدام .js بعد الترجمة
    // migrations: [resolve(__dirname, "../migrations/*.js")],
    migrationsRun:false,
    timezone: "Z",
});

export default AppDataSource;