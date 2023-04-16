package routes

import (
	"encoding/json"
	"net/http"
	"log"
	"database/sql"
)

func (h DBRouter) LoginUser(w http.ResponseWriter, r *http.Request) {
	
	if r.Method != "POST" {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	type LoginAttempt struct {
		LoggedIn 	bool   	`json: "success"`
		Email		string	`json: "email"`
		Message 	string 	`json: "message"`
	}

	var requestBody map[string]interface{}

	// Decoding body of the http request for the information for the user account
	err := json.NewDecoder(r.Body).Decode(&requestBody)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	// Added a line to check the database for any users with the same email as the new account
	result, err := h.DB.Query("SELECT * FROM \"B.MENDOZA\".\"REGISTEREDUSERS\" WHERE email = :email", sql.Named("email", requestBody["Email"].(string)))

	// Checking if the rows that have the email is 0 therefore nobody has the email
	if result.Next() == true {

		result, err := h.DB.Query("SELECT password FROM \"B.MENDOZA\".\"REGISTEREDUSERS\" WHERE email = :email", sql.Named("email", requestBody["Email"].(string)))
		if err != nil {
			log.Fatal(err)
		}
		defer result.Close()

		if result.Next() == true {
			var column2Value string
    		err = result.Scan(&column2Value)
    		if err != nil {
    		    log.Fatal(err)
    		}
    		if column2Value == requestBody["Password"].(string) {
    		    
				w.Header().Set("Content-Type", "application/json")
				w.WriteHeader(http.StatusOK)

				response := LoginAttempt{ LoggedIn: true, Email: requestBody["Email"].(string), Message: "User succesfully logged in" }
				// Packing response as type JSON
				jsonResponse, err1 := json.Marshal(response)
				if err1 != nil {
					http.Error(w, err1.Error(), http.StatusBadRequest)
					return
				}
				// Write JSON response
				w.Write(jsonResponse)

    		} else {
				w.Header().Set("Content-Type", "application/json")
				w.WriteHeader(http.StatusOK)

				response := LoginAttempt{ LoggedIn: false, Email: requestBody["Email"].(string), Message: "Email and password combo do not exist."}
				// Packing response as type JSON
				jsonResponse, err1 := json.Marshal(response)
				if err1 != nil {
					http.Error(w, err1.Error(), http.StatusBadRequest)
					return
				}
				// Write JSON response
				w.Write(jsonResponse)
			}
		}
	} else {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)

		response := LoginAttempt{ LoggedIn: false, Email: requestBody["Email"].(string), Message: "Email does not exist in our database."}
		// Packing response as type JSON
		jsonResponse, err1 := json.Marshal(response)
		if err1 != nil {
			http.Error(w, err1.Error(), http.StatusBadRequest)
			return
		}
		// Write JSON response
		w.Write(jsonResponse)
	}
}