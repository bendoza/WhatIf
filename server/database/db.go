// Database connection file

package database

import (
	"database/sql"
	"fmt"
	"log"
	"os"

	"github.com/joho/godotenv"
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

	db.SetMaxIdleConns(0)
	db.SetMaxOpenConns(9)

	fmt.Println("successful connection")

	return db, err
}
