import { developmentConfig } from "./development";
import { productionConfig } from "./production";

export const gameConfig = process.env.NODE_ENV === "production" ? productionConfig : developmentConfig;
