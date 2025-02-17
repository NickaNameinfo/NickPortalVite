module.exports = {
  /**
   * Here you may specify which of the database connections below you wish
   * to use as your default connection for all database work.
   */
  connection: process.env.DB_CONNECTION || "mysql",

  /**
   * Here you may specify the host address of database which will be
   * used for connection
   */
  host: process.env.DB_HOST || "nicknameinfotech.com",

  /**
   * Here you may specify the port of database which will be
   * used for connection
   */
  port: process.env.DB_PORT || 3306,

  /**
   * Here you may specify the database name of connection which will be
   * used for connection
   */
  database: process.env.DB_DATABASE || "u490757224_nicknameportal",

  /**
   * Here you may specify the username of database which will be
   * used for connection
   */
  username: process.env.DB_USERNAME || "u490757224_nicknameportal",

  /**
   * Here you may specify the password of database which will be
   * used for connection
   */
  password: process.env.DB_PASSWORD || "Nicknameportal@2024",
};
