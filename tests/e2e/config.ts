import { Knex } from 'knex';
import { allVendors } from './get-dbs-to-test';

type Vendor = typeof allVendors[number];

export type Config = {
	knexConfig: Record<Vendor, Knex.Config & { waitTestSQL: string }>;
	names: Record<Vendor, string>;
	envs: Record<Vendor, Record<string, string | number>>;
};

const migrationsDir = './tests/e2e/setup/migrations';
const seedsDir = './tests/e2e/setup/seeds';

const knexConfig = {
	waitTestSQL: 'SELECT 1',
	migrations: {
		directory: migrationsDir,
	},
	seeds: {
		directory: seedsDir,
	},
};

const config: Config = {
	knexConfig: {
		postgres: {
			client: 'pg',
			connection: {
				database: 'directus',
				user: 'postgres',
				password: 'secret',
				host: 'localhost',
				port: 5100,
			},
			...knexConfig,
		},
		postgres10: {
			client: 'pg',
			connection: {
				database: 'directus',
				user: 'postgres',
				password: 'secret',
				host: 'localhost',
				port: 5111,
			},
			...knexConfig,
		},
		mysql: {
			client: 'mysql',
			connection: {
				database: 'directus',
				user: 'root',
				password: 'secret',
				host: 'localhost',
				port: 5101,
			},
			...knexConfig,
		},
		maria: {
			client: 'mysql',
			connection: {
				database: 'directus',
				user: 'root',
				password: 'secret',
				host: 'localhost',
				port: 5102,
			},
			...knexConfig,
		},
		mssql: {
			client: 'mssql',
			connection: {
				database: 'model',
				user: 'sa',
				password: 'Test@123',
				host: 'localhost',
				port: 5103,
			},
			...knexConfig,
		},
		oracle: {
			client: 'oracledb',
			connection: {
				user: 'secretsysuser',
				password: 'secretpassword',
				connectString: 'localhost:5104/XE',
			},
			...knexConfig,
			waitTestSQL: 'SELECT 1 FROM DUAL',
		},
		sqlite3: {
			client: 'sqlite3',
			connection: {
				filename: './data.db',
			},
			...knexConfig,
		},
	},
	names: {
		postgres: 'Postgres',
		postgres10: 'Postgres (10)',
		mysql: 'MySQL',
		maria: 'MariaDB',
		mssql: 'MS SQL Server',
		oracle: 'OracleDB',
		sqlite3: 'SQLite 3',
	},
	envs: {
		postgres: {
			DB_CLIENT: 'pg',
			DB_HOST: `localhost`,
			DB_USER: 'postgres',
			DB_PASSWORD: 'secret',
			DB_PORT: '5100',
			DB_DATABASE: 'directus',
			PORT: 49152,
		},
		postgres10: {
			DB_CLIENT: 'pg',
			DB_HOST: `localhost`,
			DB_USER: 'postgres',
			DB_PASSWORD: 'secret',
			DB_PORT: '5111',
			DB_DATABASE: 'directus',
			PORT: 49153,
		},
		mysql: {
			DB_CLIENT: 'mysql',
			DB_HOST: `localhost`,
			DB_PORT: '5101',
			DB_USER: 'root',
			DB_PASSWORD: 'secret',
			DB_DATABASE: 'directus',
			PORT: 49154,
		},
		maria: {
			DB_CLIENT: 'mysql',
			DB_HOST: `localhost`,
			DB_PORT: '5102',
			DB_USER: 'root',
			DB_PASSWORD: 'secret',
			DB_DATABASE: 'directus',
			PORT: 49155,
		},
		mssql: {
			DB_CLIENT: 'mssql',
			DB_HOST: `localhost`,
			DB_PORT: '5103',
			DB_USER: 'sa',
			DB_PASSWORD: 'Test@123',
			DB_DATABASE: 'model',
			PORT: 49156,
		},
		oracle: {
			DB_CLIENT: 'oracledb',
			DB_USER: 'secretsysuser',
			DB_PASSWORD: 'secretpassword',
			DB_CONNECT_STRING: `localhost:5104/XE`,
			PORT: 49157,
		},
		sqlite3: {
			DB_CLIENT: 'sqlite3',
			DB_FILENAME: './data.db',
			PORT: 49158,
		},
	},
};

export default config;