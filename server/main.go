package main

import (
	"github.com/benmendoza3/WhatIf/database"
	"github.com/benmendoza3/WhatIf/routes"
	"fmt"
	"net/http"
	"github.com/gorilla/mux"
)

func main() {

	db, err := database.Connect()
	if err != nil {
		fmt.Println("Error: could not connect to database")
	}

	h := routes.NewConnection(db)

	r := mux.NewRouter()

	r.HandleFunc("/test", h.HelloHandler2)

	http.HandleFunc("/", HelloHandler)
	fmt.Println("Listening on http://localhost:8008/")
	err = http.ListenAndServe(":8008", nil)
	if err != nil {
		panic(err)
	}
}

func HelloHandler(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintln(w, "Hello, world!")
}