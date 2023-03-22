// New file to package the DB connection into a handler so that
// we can use the 1 DB connection for all functions

package routes

import (
	"database/sql"
)

type DBRouter struct {
	DB *sql.DB
}

// Takes in database and creates object for it to be passed
func NewConnection(db *sql.DB) DBRouter {
	return DBRouter{db}
}