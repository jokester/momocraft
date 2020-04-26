import { Module } from "@nestjs/common";
import { UserService } from "../user/user.service";
import { DatabaseModule } from "../db/database.module";
import { UserModule } from "../user/user.module";

@Module({
  imports: [DatabaseModule, UserModule],
  controllers: [],
  providers: [],


})
export class MomoModule {

}
