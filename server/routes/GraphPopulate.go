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

// Commented, and needs work from Lines 123-136, need to loop through the resulting rows in a better way, or query
// the DB more concisely for the sum of each weekly avg with the same date

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

	sqlBuyDate := buy.Format("02-JAN-06")
	sqlSellDate := sell.Format("02-JAN-06")

	query := `SELECT Ticker, TRUNC(CryptoDate, 'IW') AS WeekStart, AVG(Price) AS WeeklyAverageValue 
				FROM DAILYCRYPTOS
		  		WHERE Ticker IN ` + TickerString + ` 
		  		AND CryptoDate BETWEEN :startDate AND :endDate 
		  		GROUP BY Ticker, TRUNC(CryptoDate, 'IW')
		  		ORDER BY TRUNC(CryptoDate, 'IW'), Ticker ASC`

	result, err := h.DB.Query(query, sql.Named("startDate", sqlBuyDate), sql.Named("endDate", sqlSellDate))
	if err != nil {
		log.Fatal(err)
	}
	defer result.Close()

	// Establishing a response template
	type GraphDataResponse struct {
		WeeklyData map[string]float64 `json: "weeklydata"`
	}

	// Initializing an index for the loop to be more easily taken advantage of
	var index int = 0

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

		// THIS LOGIC IS NOT FULLY CORRECT. NEED TO FIND A WAY SUM ALL WEEKLY AVERAGE VALUES FROM EACH DATE

		// Multiplying the average value of the ticker by the amount owned by the user to determine
		// the average worth of each crypto for the week.
		// Then adding that average worth of each crypto together to get a total average portfolio value of the week

		// THIS LOGIC IS NOT FULLY CORRECT. NEED TO FIND A WAY SUM ALL WEEKLY AVERAGE VALUES FROM EACH DATE
		portfolioValue += TickerValueMap[ticker] * weeklyAvgValue

		if ticker == Tickers[len(Tickers)-1] && index != 0 {
			weeklyValue[weekStart.Format("01-02-2006")] = portfolioValue
			portfolioValue = 0
		}
		// THIS LOGIC IS NOT FULLY CORRECT. NEED TO FIND A WAY SUM ALL WEEKLY AVERAGE VALUES FROM EACH DATE
		index++
	}

	// Setting headers
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)

	// Setting response map to be the weekly value map created in the loop
	response := GraphDataResponse{WeeklyData: weeklyValue}

	// Packing response as type JSON
	jsonResponse, err := json.Marshal(response)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	// Write JSON response
	w.Write(jsonResponse)
}
