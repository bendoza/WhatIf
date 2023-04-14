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

	query := ` ` + TickerString + ` `

	result, err := h.DB.Query(query, sql.Named("startDate", sqlBuyDate), sql.Named("endDate", sqlSellDate))
	if err != nil {
		log.Fatal(err)
	}
	defer result.Close()

	// Establishing a response template
	type WorstSellResponse struct {
		Date            string  `json: "date"`
		PercentIncrease float64 `json: "percentincrease"`
	}

	var ticker string
	var date time.Time
	var percentIncrease float64

	if result.Next() {
		err = result.Scan(&ticker, &date, &percentIncrease)
		if err != nil {
			log.Fatal(err)
		}
	} else {
		http.Error(w, "No results found", http.StatusNotFound)
		return
	}

	// Setting headers
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)

	// Setting response map to be the weekly value map created in the loop
	response := WorstSellResponse{Date: date.Format("01/02/2006"), PercentIncrease: percentIncrease}

	// Packing response as type JSON
	jsonResponse, err := json.Marshal(response)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	// Write JSON response
	w.Write(jsonResponse)
}
