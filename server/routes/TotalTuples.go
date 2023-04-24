package routes

import (
	"encoding/json"
	"log"
	"net/http"
)

func (h DBRouter) TotalTuples(w http.ResponseWriter, r *http.Request) {

	if r.Method != "GET" {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	query := `SELECT COUNT(*)
			  FROM "B.MENDOZA"."DAILYCRYPTOS"`

	result, err := h.DB.Query(query)
	if err != nil {
		log.Fatal(err)
	}
	defer result.Close()

	// Initializing variables to store information from table row scan
	var value int

	// Scanning the one row that is turned by the SQL Query
	if result.Next() {
		err = result.Scan(&value)
		if err != nil {
			log.Fatal(err)
		}
	} else {
		http.Error(w, "No results found", http.StatusNotFound)
		return
	}

	// Establishing a response template
	type TotalTuplesResponse struct {
		Value int `json: "value"`
	}

	// Setting headers
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)

	// Setting response map to be the weekly value map created in the loop
	response := TotalTuplesResponse{Value: value}

	// Packing response as type JSON
	jsonResponse, err := json.Marshal(response)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	// Write JSON response
	w.Write(jsonResponse)

}
