process.loadEnvFile(".env");
const url = new URL(process.env.DATABASE_URL!);
url.pathname = "/venezuela_test";
process.env.DATABASE_URL = url.toString();
