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

	sort.Strings(Tickers)
	TickerString := "('" + strings.Join(Tickers, "', '") + "')"

	var BuyDate string = requestBody["BuyDate"].(string)
	var SellDate string = requestBody["SellDate"].(string)

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

	var index int = 0
	var portfolioValue float64 = 0
	weeklyValue := make(map[string]float64)

	for result.Next() {
		var ticker string
		var weekStart time.Time
		var weeklyAvgValue float64

		err := result.Scan(&ticker, &weekStart, &weeklyAvgValue)
		if err != nil {
			log.Fatal(err)
		}

		portfolioValue += TickerValueMap[ticker] * weeklyAvgValue

		if ticker == Tickers[len(Tickers)-1] && index != 0 {
			weeklyValue[weekStart.Format("01-02-2006")] = portfolioValue
			portfolioValue = 0
		}

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
