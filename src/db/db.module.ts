import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Secrets } from '@src/common/secrets';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'mysql',
        host: Secrets.MYSQL_HOST,
        port: Secrets.MYSQL_PORT,
        database: Secrets.MYSQL_DATABASE,
        username: Secrets.MYSQL_USERNAME,
        password: Secrets.MYSQL_ROOT_PASSWORD,
        autoLoadEntities: true,
        synchronize: Secrets.NODE_ENV === 'development' ? true : false,
      }),
    }),
  ],
})
export class DbModule {}
