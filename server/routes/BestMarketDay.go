package routes

import (
	"database/sql"
	"encoding/json"
	"log"
	"net/http"
	"strings"
	"time"
)

func (h DBRouter) BestMarketDay(w http.ResponseWriter, r *http.Request) {

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

	var Tickers []string

	for _, tv := range TickerValues {
		parts := strings.Split(tv, "-")
		if err != nil {
			log.Fatal(err)
		}
		Tickers = append(Tickers, parts[0])
	}

	// TickerString := "('" + strings.Join(Tickers, "', '") + "')"

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

	query := `SELECT D2.CryptoDate AS DDate, (AVG(D2.Price) - AVG(D1.Price)) / AVG(D1.Price) AS TotalPriceIncrease
  			  FROM DAILYCRYPTOS D1
  			  JOIN DAILYCRYPTOS D2 ON D1.Ticker = D2.Ticker AND D2.CryptoDate = D1.CryptoDate + 1
  			  WHERE D2.CryptoDate BETWEEN :startDate AND :endDate 
  			  GROUP BY D2.CryptoDate
  			  ORDER BY TotalPriceIncrease DESC
  			  FETCH FIRST 1 ROWS ONLY`

	result, err := h.DB.Query(query, sql.Named("startDate", sqlBuyDate), sql.Named("endDate", sqlSellDate))
	if err != nil {
		log.Fatal(err)
	}
	defer result.Close()

	var date time.Time
	var percentIncrease float64

	if result.Next() {
		err = result.Scan(&date, &percentIncrease)
		if err != nil {
			log.Fatal(err)
		}
	} else {
		http.Error(w, "No results found", http.StatusNotFound)
		return
	}

	type BestMarketDayResponse struct {
		Date            string  `json: "date"`
		PercentIncrease float64 `json: "percentincrease"`
	}

	// Setting headers
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)

	// Setting response map to be the weekly value map created in the loop
	response := BestMarketDayResponse{Date: date.Format("01/02/2006"), PercentIncrease: percentIncrease}

	// Packing response as type JSON
	jsonResponse, err := json.Marshal(response)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	// Write JSON response
	w.Write(jsonResponse)

}