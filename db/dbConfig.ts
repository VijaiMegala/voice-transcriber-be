import * as dotenv from 'dotenv';
dotenv.config();

import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions";
import {
    Dictionary,
    Transcript,
    User
} from '../schema';

export const dbConfig: PostgresConnectionOptions = {
  type: 'postgres',
  url: process.env.DB_URL,
  entities: [
    Dictionary,
    Transcript,
    User,
  ],
  synchronize: true,
};