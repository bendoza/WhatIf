package main

import (
	"fmt"
	"net/http"
)

func main() {
	http.HandleFunc("/", HelloHandler)
	fmt.Println("Listening on http://localhost:8008/")
	err := http.ListenAndServe(":8008", nil)
	if err != nil {
		panic(err)
	}
}

func HelloHandler(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintln(w, "Hello, world!")
}