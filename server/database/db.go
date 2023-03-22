// Database connection file

package database

import (
	"github.com/joho/godotenv"
	"fmt"
	"os"
	"database/sql"
	"log"
	_ "github.com/sijms/go-ora/v2"
)

// Connecting with the GoDotEnv string
// Error checking where needed
func Connect() (*sql.DB, error) {
	err := godotenv.Load()
	if err != nil {
   		log.Fatal("Error loading .env file")
	}	

	db, err := sql.Open("oracle", os.Getenv("DB_CONNECTION"))
	if err != nil {
		panic(fmt.Errorf("error in sql.Open: %w", err))
	}
	
	fmt.Println("successful connection")

	return db, err
}