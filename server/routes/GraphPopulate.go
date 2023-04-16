package routes

import (
	"database/sql"
	"encoding/json"
	"log"
	"net/http"
	"sort"
	"strconv"
	"strings"
	"time"
)

// Code produces correct output.
// Query is complex and code is clean, just could use more exclusive testing for this functions output to ensure it's 100% finished.

func (h DBRouter) GraphPopulate(w http.ResponseWriter, r *http.Request) {

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

	// SQL Query that selects weekly average prices for cryptocurrencies in users portfolio, so that we can use the amount
	// they specified they owned of each crypto to calculate total weekly average portfolio value
	query := `SELECT Ticker, TRUNC(CryptoDate, 'IW') AS WeekStart, AVG(Price) AS WeeklyAverageValue 
			  FROM DAILYCRYPTOS
			  WHERE Ticker IN ` + TickerString + ` AND CryptoDate BETWEEN :startDate AND :endDate 
		  	  GROUP BY Ticker, TRUNC(CryptoDate, 'IW')
			  ORDER BY TRUNC(CryptoDate, 'IW'), Ticker ASC`

	result, err := h.DB.Query(query, sql.Named("startDate", sqlBuyDate), sql.Named("endDate", sqlSellDate))
	if err != nil {
		log.Fatal(err)
	}
	defer result.Close()

	// Initializing an index and prev date value for the loop to be more easily taken advantage of
	var index int = 0
	var previousTupleDate time.Time

	// Initializing portfolioValue for each coins average weekly value to be added to and ultimately used
	// as the value that is inserted into the map once all coins for each week have been added
	var portfolioValue float64 = 0

	// Initializing map for date(key) and weeklyAVGPortfolioValue(value) to be returned to the front end
	// for graph population
	weeklyValue := make(map[string]float64)

	for result.Next() {
		var ticker string
		var weekStart time.Time
		var weeklyAvgValue float64

		err := result.Scan(&ticker, &weekStart, &weeklyAvgValue)
		if err != nil {
			log.Fatal(err)
		}

		// Multiplying the average value of the ticker by the amount owned by the user to determine
		// the average worth of each crypto for the week.
		// Then adding that average worth of each crypto together to get a total average portfolio value of the week

		if index == 0 {
			portfolioValue += TickerValueMap[ticker] * weeklyAvgValue
		}
		if previousTupleDate != weekStart && index != 0 {
			weeklyValue[previousTupleDate.Format("2006-01-02")] = portfolioValue
			portfolioValue = 0
			portfolioValue += TickerValueMap[ticker] * weeklyAvgValue
		} else if index != 0 {
			portfolioValue += TickerValueMap[ticker] * weeklyAvgValue
		}
		previousTupleDate = weekStart
		index++
	}

	// Initializing a new string slice to enable the key's of the map to be sorted
	allDates := make([]string, 0, len(weeklyValue))
	for v := range weeklyValue {
		allDates = append(allDates, v)
	}

	// Sort the slice of keys
	sort.Strings(allDates)

	// Create a new map with sorted keys
	sortedResponse := make(map[string]float64)
	for _, k := range allDates {
		sortedResponse[k] = weeklyValue[k]
	}

	// Setting headers
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)

	// Packing sorted response as type JSON
	jsonResponse, err := json.Marshal(sortedResponse)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	// Write JSON response
	w.Write(jsonResponse)
}
