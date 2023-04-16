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

// Upon testing, output should be correct.
// Commented, and needs work with the SQL Query, I would like to unpack some of the Go code to be parts of the SQL query

func (h DBRouter) WorstSellDay(w http.ResponseWriter, r *http.Request) {

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

	// SQL Query that selects the name, date, and price of all cryptos selected by the user within the given date range.
	query := `SELECT Ticker, CryptoDate, Price
			  FROM DAILYCRYPTOS
	  		  WHERE Ticker IN ` + TickerString + ` AND CryptoDate BETWEEN :startDate AND :endDate 
	  		  GROUP BY Ticker, CryptoDate, Price
	  		  ORDER BY CryptoDate ASC`

	result, err := h.DB.Query(query, sql.Named("startDate", sqlBuyDate), sql.Named("endDate", sqlSellDate))
	if err != nil {
		log.Fatal(err)
	}
	defer result.Close()

	// Initializing an index and a bool for the loop to be more easily taken advantage of
	var index int = 0
	var first bool = true
	var previousTupleDate time.Time

	// Initializing dailyPortfolioValue and the map for the total portfolio value of each day where the day
	// is the key and the value of the portfolio on that day is the value of the key
	var dailyPortfolioValue float64 = 0
	dailyValues := make(map[string]float64)

	// Initializing an initial value which will eventually be replaced with the total portfolio value from the first day
	var initialValue float64 = 0

	// Looping through all tuples from within the date range
	for result.Next() {
		var ticker string
		var date time.Time
		var dailyValue float64

		err := result.Scan(&ticker, &date, &dailyValue)
		if err != nil {
			log.Fatal(err)
		}

		// Using the before mentioned map of the ticker and their amounts to calculate the total value of the portfolio
		// by using the price from the SQL query
		dailyPortfolioValue += TickerValueMap[ticker] * dailyValue

		// Condition that allows the loop to switch from day to day by checking if the date is not equal to the date of the previous
		// tuple and if the loop is not on the first iteration, because then the previousTupleDate is null and not equal to the non-exist
		// previous tuple's date
		if index == 0 {
			dailyPortfolioValue += TickerValueMap[ticker] * dailyValue
		}
		if previousTupleDate != date && index != 0 {
			if first {
				initialValue = dailyPortfolioValue
				first = false
			}
			dailyValues[previousTupleDate.Format("01-02-2006")] = dailyPortfolioValue
			dailyPortfolioValue = 0
			dailyPortfolioValue += TickerValueMap[ticker] * dailyValue
		} else if index != 0 {
			dailyPortfolioValue += TickerValueMap[ticker] * dailyValue
		}
		previousTupleDate = date
		index++
	}

	// Now checking for the map value that has the absolute least of all potentially daily portfolio values and storing
	// both the date and value in variables to be returned
	var leastDate string
	var leastValue float64 = 0

	for date, value := range dailyValues {
		if leastValue == 0 || value < leastValue {
			leastDate = date
			leastValue = value
		}
	}

	// Calculating the percentage difference between the portfolio value of the first day selected and the value of the day with the least portfolio value
	var percentDifference float64 = ((leastValue - initialValue) / initialValue) * 100

	// Establishing a response template
	type WorstSellResponse struct {
		Date              string  `json: "date"`
		PercentDifference float64 `json: "percentdifference"`
	}

	// Setting headers
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)

	// Setting response map to be the weekly value map created in the loop
	response := WorstSellResponse{Date: leastDate, PercentDifference: percentDifference}

	// Packing response as type JSON
	jsonResponse, err := json.Marshal(response)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	// Write JSON response
	w.Write(jsonResponse)
}
