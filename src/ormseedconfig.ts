import ormconfig from './ormconfig';
const ormseedconfig = {
  ...ormconfig,
  migrations: [__dirname + '/seeds/**/*{.ts,.js}'],
  cli: { migrationsDir: 'src/seeds' },
};

export default ormseedconfig;

// создали конфиг для orm, который использует наш стандартный конфиг.
// мы перезаписали существующие параметры конфига, указав другую папку для миграции
