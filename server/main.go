package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/benmendoza3/WhatIf/database"
	"github.com/benmendoza3/WhatIf/routes"
	"github.com/gorilla/handlers"
	"github.com/gorilla/mux"
)

func main() {

	// Connecting to DB and saving connection as object
	db, err := database.Connect()
	if err != nil {
		fmt.Println("Error: could not connect to database")
	}

	// Sending DB object to handler so it can be passed from route to route rather than
	// disconnecting and reconnecting every time
	h := routes.NewConnection(db)

	r := mux.NewRouter()

	// SQL Database query routes

	r.HandleFunc("/bestDayCrypto", h.BestDayCrypto).Methods("POST")

	r.HandleFunc("/bestMarketDay", h.BestMarketDay).Methods("POST")

	r.HandleFunc("/betterCoinInvestments", h.BetterCoinInvestments).Methods("POST")

	r.HandleFunc("/graphPopulate", h.GraphPopulate).Methods("POST")

	r.HandleFunc("/worstSellDay", h.WorstSellDay).Methods("POST")

	// User account routes

	r.HandleFunc("/signup", h.CreateUser).Methods("POST")

	r.HandleFunc("/login", h.LoginUser).Methods("POST")

	// Allowing CORS and starting server

	headers := handlers.AllowedHeaders([]string{"X-Requested-With", "Content-Type", "Authorization"})
	methods := handlers.AllowedMethods([]string{"GET", "POST", "PUT", "DELETE"})
	origins := handlers.AllowedOrigins([]string{"http://localhost:3000"})
	log.Fatal(http.ListenAndServe(":8008", handlers.CORS(headers, methods, origins)(r)))
}
