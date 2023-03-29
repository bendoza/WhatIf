// Models which follow the relational schemas
package models

import ()

type RegisteredUser struct {
    Email 		string `json: "email"`
	Password 	string `json: "password"`
	Name 		string `json: "name"`
}

type Search struct {
	SearchID 	string `json: "searchid"`
	Email 		string `json: "email"`
	dateTo 		string `json: "dateto"`
	dateFrom 	string `json: "datefrom"`
}

type DailyCryptos struct {
	cryptoID 	string 	`json: "cryptoid"`
	ticker 		string 	`json: "ticker"`
	price 		float64 `json: "price"`
	cryptoDate 	string 	`json: "cryptodate"`
}