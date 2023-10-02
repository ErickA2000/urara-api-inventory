import dotenv from 'dotenv';
dotenv.config();

import App from "app";
import { createCategorias, createColors, createTallas } from '@Libs/initialSetup';

const server = new App();

createCategorias();
createTallas();
createColors();

server.start();