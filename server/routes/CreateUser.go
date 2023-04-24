package routes

import (
	"database/sql"
	"encoding/json"
	"log"
	"net/http"

	"github.com/benmendoza3/WhatIf/models"
)

func (h DBRouter) CreateUser(w http.ResponseWriter, r *http.Request) {

	if r.Method != "POST" {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	type SignupAttempt struct {
		Success bool   `json: "success"`
		Message string `json: "message"`
	}

	// Creating two new variables to use as reference
	var requestBody map[string]interface{}
	var user models.RegisteredUser

	// Decoding body of the http request for the information for the user account
	err := json.NewDecoder(r.Body).Decode(&requestBody)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	// Added a line to check the database for any users with the same email as the new account
	result, err := h.DB.Query(`SELECT * FROM "B.MENDOZA"."REGISTEREDUSERS" WHERE email = :email`, sql.Named("email", requestBody["Email"].(string)))

	// Checking if the rows that have the email is 0 therefore nobody has the email
	if result.Next() == false {

		// Assigning Email and Password to new User
		user.Email = requestBody["Email"].(string)
		user.Password = requestBody["Password"].(string)

		stmt, err := h.DB.Prepare(`INSERT INTO "B.MENDOZA"."REGISTEREDUSERS" (Email, Password) VALUES (:1, :2)`)
		if err != nil {
			log.Fatal(err)
		}

		defer stmt.Close()

		_, err = stmt.Exec(user.Email, user.Password)
		if err != nil {
			log.Fatal(err)
		}

		// Setting headers
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)

		// Initalizing response variable to hold a boolean and a string message
		response := SignupAttempt{Success: true, Message: "User succesfully created account"}
		// Packing response as type JSON
		jsonResponse, err1 := json.Marshal(response)
		if err1 != nil {
			http.Error(w, err1.Error(), http.StatusBadRequest)
			return
		}
		// Write JSON response
		w.Write(jsonResponse)

	} else {
		// If Rows Affected (rows with email given) is greater than 0, therefore someone has an account with
		// the email given, we don't create a new user and tell them their email is taken.
		response := SignupAttempt{Success: false, Message: "Email is already in use"}
		jsonResponse, err2 := json.Marshal(response)
		if err2 != nil {
			http.Error(w, err2.Error(), http.StatusBadRequest)
			return
		}
		w.Write(jsonResponse)
	}
}
