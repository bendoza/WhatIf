package routes

import (
	"database/sql"
	"encoding/json"
	"log"
	"net/http"
	"strconv"
	"strings"
	"time"
)

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

	var TickerString string = "('" + strings.Join(Tickers, "', '") + "')"

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

	query := `SELECT Ticker, CryptoDate, Price
			  FROM DAILYCRYPTOS
	  		  WHERE Ticker IN ` + TickerString + ` 
	  		  AND CryptoDate BETWEEN :startDate AND :endDate 
	  		  GROUP BY Ticker, CryptoDate, Price
	  		  ORDER BY CryptoDate ASC`

	result, err := h.DB.Query(query, sql.Named("startDate", sqlBuyDate), sql.Named("endDate", sqlSellDate))
	if err != nil {
		log.Fatal(err)
	}
	defer result.Close()

	var index int = 0
	var first bool = true
	var dailyPortfolioValue float64 = 0
	dailyValues := make(map[string]float64)

	var initialValue float64 = 0

	for result.Next() {
		var ticker string
		var date time.Time
		var dailyValue float64

		err := result.Scan(&ticker, &date, &dailyValue)
		if err != nil {
			log.Fatal(err)
		}

		dailyPortfolioValue += TickerValueMap[ticker] * dailyValue

		if (index+1)%len(Tickers) == 0 {
			if first {
				initialValue = dailyPortfolioValue
				first = false
			}
			dailyValues[date.Format("01-02-2006")] = dailyPortfolioValue
			dailyPortfolioValue = 0
		}
		index++
	}

	var leastDate string
	var leastValue float64 = 0

	for date, value := range dailyValues {
		if leastValue == 0 || value < leastValue {
			leastDate = date
			leastValue = value
		}
	}

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
