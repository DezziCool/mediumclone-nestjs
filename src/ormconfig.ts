import { ConnectionOptions } from 'typeorm';

const ormconfig: ConnectionOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'example',
  database: 'mediumclone',
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  // synchronize: true, // typeorm при запуске будет читать все наши сущности и создает под них таблицы (автоматически)
  synchronize: false,
  migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
  cli: {
    migrationsDir: 'src/migrations', // генерировать миграцию мы будем только в режиме разработки
  },
};

export default ormconfig;
// когда папка entity будет внутри продакшена это значит что dirname у нас будет не "src", а "dist"
// synchronize: true - не самый лучшйи вариант в продакшене. Для теста норм. Опция существует только в Nestjs
// Т.е. мы запускаем приложение - typeorm сравнивает наши сущности с таблицами, которые уже есть в БД.
// Если пявилось что то новое, либо БД пустая, то typeorm создаст по всем этим сущностям таблицы в БД
