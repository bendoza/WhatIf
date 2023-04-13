package main

import (
	"github.com/benmendoza3/WhatIf/database"
	"github.com/benmendoza3/WhatIf/routes"
	"fmt"
	"net/http"
	"github.com/gorilla/mux"
	"github.com/gorilla/handlers"
	"log"
)

func main() {

	db, err := database.Connect()
	if err != nil {
		fmt.Println("Error: could not connect to database")
	}

	h := routes.NewConnection(db)

	r := mux.NewRouter()

	r.HandleFunc("/", h.GraphPopulate).Methods("POST")

	r.HandleFunc("/signup", h.CreateUser).Methods("POST")

	r.HandleFunc("/login", h.LoginUser).Methods("POST")

	headers := handlers.AllowedHeaders([]string{"X-Requested-With", "Content-Type", "Authorization"})
	methods := handlers.AllowedMethods([]string{"GET", "POST", "PUT", "DELETE"})
	origins := handlers.AllowedOrigins([]string{"http://localhost:3000"})
	log.Fatal(http.ListenAndServe(":8008", handlers.CORS(headers, methods, origins)(r)))
}