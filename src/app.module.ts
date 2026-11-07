import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OrdersModule } from './orders/orders.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, //Hace que este modulo sea global.
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule, AuthModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST') ?? 'localhost',
        port: Number(configService.get<string>('DB_PORT') ?? 5433),
        username: configService.get<string>('DB_USERNAME') ?? 'postgres',
        password: configService.get<string>('DB_PASSWORD') ?? 'postgres',
        database: configService.get<string>('DB_DATABASE') ?? 'coffee_orders',
        autoLoadEntities: true,
        synchronize: configService.get<string>('DB_SYNC') === 'true',
        ssl: configService.get<string>('NODE_ENV') === 'production',
      }),
    }),
    OrdersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
