package routes

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"sort"
	"strconv"
	"strings"
	"time"
)

// Code producing correct output
// Commented, and SHOULD be FINISHED, query is ACCURATE and COMPLEX

func (h DBRouter) BetterCoinInvestments(w http.ResponseWriter, r *http.Request) {

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

	// Saving Ticker data straight from request body
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

	// Putting strictly string values into slice for computations but also adding the
	// string and their amount to a map for computations based on portfolio value
	TickerValueMap := make(map[string]float64)
	var Tickers []string

	for _, tv := range TickerValues {
		parts := strings.Split(tv, "-")
		valueFloat, err := strconv.ParseFloat(parts[1], 64)
		if err != nil {
			log.Fatal(err)
		}
		TickerValueMap[parts[0]] = valueFloat
		Tickers = append(Tickers, parts[0])
	}

	// Sorting and creating a TickerString for the embedded SQL queries
	sort.Strings(Tickers)
	var TickerString string = "('" + strings.Join(Tickers, "', '") + "')"

	var SellDate string = requestBody["SellDate"].(string)

	// Formatting sell date to be embedded into SQL query

	sell, err := time.Parse("2006-01-02", SellDate)
	if err != nil {
		log.Fatal(err)
	}

	sqlSellDate := sell.Format("02-Jan-06")

	query := `SELECT MIN(CryptoDate)
			  FROM "B.MENDOZA"."DAILYCRYPTOS"
			  WHERE Ticker IN ` + TickerString + `
			  GROUP BY CryptoDate
			  ORDER BY CryptoDate ASC
			  FETCH FIRST 1 ROWS ONLY`

	result, err := h.DB.Query(query)
	if err != nil {
		log.Fatal(err)
	}
	defer result.Close()

	// Initializing variables to store information from table row scan
	var firstDate time.Time

	// Scanning the one row that is turned by the SQL Query
	if result.Next() {
		err = result.Scan(&firstDate)
		if err != nil {
			log.Fatal(err)
		}
	} else {
		http.Error(w, "No results found", http.StatusNotFound)
		return
	}

	if firstDate.After(sell) {

		var NewTickers []string
		var placeholder string = "No data in range:X|No data in range:X"

		NewTickers = append(NewTickers, placeholder)
		NewTickers = append(NewTickers, placeholder)
		NewTickers = append(NewTickers, placeholder)

		// Setting headers
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)

		// Packing sorted response as type JSON
		jsonResponse, err := json.Marshal(NewTickers)
		if err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}
		// Write JSON response
		w.Write(jsonResponse)

	} else {

		// SQL Query that selects all tickers within the users profile and each cryptos percent difference from the start to the end date
		query := `SELECT A.Ticker, ((B.Price - A.Price) / A.Price) * 100 AS PercentDifference
			  FROM "B.MENDOZA"."DAILYCRYPTOS" A
			  JOIN "B.MENDOZA"."DAILYCRYPTOS" B ON A.Ticker = B.Ticker
			  WHERE A.CryptoDate = :startDate AND B.CryptoDate = :endDate
			  AND A.Ticker IN ` + TickerString + `
			  AND A.Price <> 0
			  ORDER BY A.Ticker ASC`

		result, err := h.DB.Query(query, sql.Named("startDate", firstDate), sql.Named("endDate", sqlSellDate))
		if err != nil {
			log.Fatal(err)
		}
		defer result.Close()

		// Initializing string slice to hold all owned ticker and amount held pairs in a string
		// Format -> BTC:120.020
		var OwnedTickers []string

		// Initialzing placeholder and index to make use of the loop
		var placeholder string

		// Looping through 5 results rows and formatting them to be correctly sent back to the front end
		for result.Next() {
			var ticker string
			var percentDifference float64

			err := result.Scan(&ticker, &percentDifference)
			if err != nil {
				log.Fatal(err)
			}

			percentDiffString := fmt.Sprintf("%f", percentDifference)
			placeholder = ticker + ":" + percentDiffString

			OwnedTickers = append(OwnedTickers, placeholder)
		}

		// SQL Query that selects crypto name and overall percent difference from the start date to the end date of the
		// cryptos with the top 5 highest % differences that are higher than any crypto within the portfolio.
		query = `SELECT A.Ticker, ((B.Price - A.Price) / A.Price) * 100 AS PercentDifference
			  FROM DAILYCRYPTOS A
			  JOIN DAILYCRYPTOS B ON A.Ticker = B.Ticker
			  WHERE A.CryptoDate = :startDate AND B.CryptoDate = :endDate
			  AND A.Ticker NOT IN ` + TickerString + `
			  AND A.Price <> 0
			  AND ((B.Price - A.Price) / A.Price) > ( SELECT MIN((B.Price - A.Price) / A.Price)
			  										  FROM DAILYCRYPTOS A
			  										  JOIN DAILYCRYPTOS B ON A.Ticker = B.Ticker
			  										  WHERE A.CryptoDate = :startDate
			  										  AND B.CryptoDate = :endDate
			  										  AND A.Ticker IN ` + TickerString + `
			  										  AND A.Price <> 0
		  										  )
			  ORDER BY PercentDifference DESC
			  FETCH FIRST 3 ROWS ONLY`

		result, err = h.DB.Query(query, sql.Named("startDate", firstDate), sql.Named("endDate", sqlSellDate))
		if err != nil {
			log.Fatal(err)
		}
		defer result.Close()

		// Initializing a string slice for all new formatted strings with data
		var NewTickers []string

		// Looping through 5 results rows and formatting them to be correctly sent back to the front end
		for result.Next() {
			var ticker string
			var percentDifference float64

			err := result.Scan(&ticker, &percentDifference)
			if err != nil {
				log.Fatal(err)
			}

			percentDiffString := fmt.Sprintf("%f", percentDifference)
			placeholder = ticker + ":" + percentDiffString

			NewTickers = append(NewTickers, placeholder)
		}

		// Initializing variables to compare the owned tickers to the tickers who's percent difference was greater than a crypto in the portfolio
		var previousTickerValue string
		var previousValue float64 = 0

		// Loop that determines which crypto had the least percent difference, therefore it was most outperformed, or it underperformed the most
		for tick := range OwnedTickers {
			tokens := strings.Split(OwnedTickers[tick], ":")
			tokensFloat, err := strconv.ParseFloat(tokens[1], 64)
			if err != nil {
				log.Fatal(err)
			}
			if previousValue == 0 || tokensFloat < previousValue {
				previousValue = tokensFloat
				previousTickerValue = OwnedTickers[tick]
			}
			if tick == len(OwnedTickers)-1 {
				for i := 0; i < len(NewTickers); i++ {
					NewTickers[i] = NewTickers[i] + "|" + previousTickerValue
				}
			}
		}

		// Setting headers
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)

		// Packing NewTickers as type JSON for response
		jsonResponse, err := json.Marshal(NewTickers)
		if err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}
		// Write JSON response
		w.Write(jsonResponse)
	}
}
