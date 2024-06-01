import knex, { Knex } from 'knex';

import logger from './logger.util';
import defaultConfig from '../knexfile';

const dbConn = knex(defaultConfig);

interface PaginateOptions {
  currentPage: number;
  perPage: number;
  selectParams?: Array<string>;
  countParam?: string;
}

interface PaginationInfo {
  total: number;
  perPage: number;
  currentPage: number;
  lastPage: number;
  prevPage?: number;
  nextPage?: number;
}

const paginate = async <T>(
  queryBuilder: Knex.QueryBuilder,
  { currentPage, perPage, selectParams = ['*'], countParam = '*' }: PaginateOptions) => {
  if (currentPage < 1) {
    currentPage = 1;
  }

  const offSet = (currentPage - 1) * perPage;
  const data = await queryBuilder.clone().select(selectParams).limit(perPage).offset(offSet) as T[];
  const total = (await queryBuilder.clone().count(`${countParam} as count`).first()).count;
  const lastPage = Math.ceil(total / perPage);

  const paginationInfo: PaginationInfo = {
    total,
    perPage,
    currentPage,
    lastPage,
    prevPage: currentPage > 1 ? currentPage - 1 : undefined,
    nextPage: currentPage < lastPage ? currentPage + 1 : undefined,
  };

  return { data, paginationInfo };
};

const refreshDatabase = async () => {
  try {
    await dbConn.migrate.rollback({}, true);
    await dbConn.migrate.latest();
  } catch (err) {
    logger.error({ err }, "Error while refreshing database");
  }
};

export {
  dbConn,
  paginate,
  PaginationInfo,
  refreshDatabase
};
