package routes

import (
	"database/sql"
	"encoding/json"
	"log"
	"net/http"
	"strings"
	"time"
)

// Code producing correct output
// Commented, and SHOULD be FINISHED, query is ACCURATE and COMPLEX

func (h DBRouter) BestDayCrypto(w http.ResponseWriter, r *http.Request) {

	if r.Method != "POST" {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var requestBody map[string]interface{}

	// Decoding body of the http request for the information for the query
	err := json.NewDecoder(r.Body).Decode(&requestBody)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	// Referring to front-end request in the JSON form
	// "TickerValues": [BTC-1.102, ETH-2040.304, etc.]
	// "BuyDate": "MM/DD/YYYY"
	// "SellDate": "MM/DD/YYYY"

	// Putting ticker string and values into slice for computations
	var TickerValues []string

	if TickerValuesInterface, ok := requestBody["TickerValues"]; ok {
		if TickerValuesSlice, ok := TickerValuesInterface.([]interface{}); ok {
			for _, TickerValue := range TickerValuesSlice {
				if TickerValueString, ok := TickerValue.(string); ok {
					TickerValues = append(TickerValues, TickerValueString)
				}
			}
		}
	}

	// Putting strictly ticker's string values into slice for computations
	var Tickers []string

	for _, tv := range TickerValues {
		parts := strings.Split(tv, "-")
		if err != nil {
			log.Fatal(err)
		}
		Tickers = append(Tickers, parts[0])
	}

	// Creating a TickerString for the embedded SQL queries
	TickerString := "('" + strings.Join(Tickers, "', '") + "')"

	var BuyDate string = requestBody["BuyDate"].(string)
	var SellDate string = requestBody["SellDate"].(string)

	// Formatting buy and sell date to be embedded into SQL query
	buy, err := time.Parse("01/02/2006", BuyDate)
	if err != nil {
		log.Fatal(err)
	}

	sell, err := time.Parse("01/02/2006", SellDate)
	if err != nil {
		log.Fatal(err)
	}

	sqlBuyDate := buy.Format("02-Jan-06")
	sqlSellDate := sell.Format("02-Jan-06")

	// SQL Query that selects the Ticker, the Date, and the % difference in price from all rows of the self join
	// of DailyCryptos where the ticker is the same, and the dates are consecutive.
	// Also filters out all rows except the row with the highest percent difference to be returned
	query := `SELECT A.Ticker, B.CryptoDate AS FirstDate, ((B.Price - A.Price) / A.Price) * 100 AS PercentIncrease
			  FROM "B.MENDOZA"."DAILYCRYPTOS" A
			  JOIN "B.MENDOZA"."DAILYCRYPTOS" B ON A.Ticker = B.Ticker AND A.CryptoDate = B.CryptoDate - 1
			  WHERE A.CryptoDate BETWEEN :startDate AND :endDate AND A.Ticker IN ` + TickerString + `
			  ORDER BY PercentIncrease DESC
			  FETCH FIRST 1 ROWS ONLY`

	result, err := h.DB.Query(query, sql.Named("startDate", sqlBuyDate), sql.Named("endDate", sqlSellDate))
	if err != nil {
		log.Fatal(err)
	}
	defer result.Close()

	// Initializing variables to store information from table row scan
	var ticker string
	var date time.Time
	var percentIncrease float64

	// Scanning the one row that is turned by the SQL Query
	if result.Next() {
		err = result.Scan(&ticker, &date, &percentIncrease)
		if err != nil {
			log.Fatal(err)
		}
	} else {
		http.Error(w, "No results found", http.StatusNotFound)
		return
	}

	// Establishing a response template
	type BestDayResponse struct {
		Ticker          string  `json: "ticker"`
		Date            string  `json: "date"`
		PercentIncrease float64 `json: "percentincrease"`
	}

	// Setting headers
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)

	// Setting response map to be the weekly value map created in the loop
	response := BestDayResponse{Ticker: ticker, Date: date.Format("01/02/2006"), PercentIncrease: percentIncrease}

	// Packing response as type JSON
	jsonResponse, err := json.Marshal(response)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	// Write JSON response
	w.Write(jsonResponse)

}
