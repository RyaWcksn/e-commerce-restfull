export const config = {
	DB: {
		user: process.env.PGUSER,
		host: process.env.PGHOST,
		database: process.env.PGDATABASE,
		password: process.env.PGPASSWORD,
		port: Number(process.env.PGPORT)
	},
	APP: {
		APIKEY: "ck_1cbb2c1902d56b629cd9a555cc032c4b478b26ce",
		APISECRET: "cs_7be10f0328c5b1d6a1a3077165b226af71d8b9dc",
		APIURL: "https://codetesting.jubelio.store",
	}

}
