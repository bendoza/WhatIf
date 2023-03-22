// Test route file that changes the hello print if the handle is reached

package routes

import (
	"net/http"
	"fmt"
)

func (h DBRouter) HelloHandler2(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintln(w, "Hello, peeps!")
}