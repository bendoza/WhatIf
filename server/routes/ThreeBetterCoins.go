package routes

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strconv"
	"strings"
	"time"
)

// Code producing correct output
// Commented, although the SQL Queries could be doing more work than what they are doing
// now. Trying to reduce Go code into more complex SQL query parameters is ideal.

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

	// SQL Query that selects the name, date, and price of all cryptos that explicitly
	// have data on the start and end date specified by the user.
	query := `SELECT Ticker, CryptoDate, Price
			  FROM DAILYCRYPTOS
			  WHERE Ticker IN (
				SELECT Ticker
				FROM DAILYCRYPTOS
				WHERE CryptoDate = :startDate
				INTERSECT
				SELECT Ticker
				FROM DAILYCRYPTOS
				WHERE CryptoDate = :endDate
			  )
			  AND CryptoDate IN (:startDate, :endDate)
			  ORDER BY Ticker, CryptoDate ASC`

	result, err := h.DB.Query(query, sql.Named("startDate", sqlBuyDate), sql.Named("endDate", sqlSellDate))
	if err != nil {
		log.Fatal(err)
	}
	defer result.Close()

	// Initializing an index and a bool for the loop to be more easily taken advantage of
	var index int = 0

	// Initializing a placeholder string for the format for future computations
	var placeholder string

	// Initializing a string slice for all new formatted strings with data
	var DateRangeTickers []string

	for result.Next() {
		var ticker string
		var date time.Time
		var price float64

		err := result.Scan(&ticker, &date, &price)
		if err != nil {
			log.Fatal(err)
		}

		// Since only taking tuples with both buy and sell date data, the length of the result will
		// be even, so we can check whether it's the buy or sell date based on whether or not the iteration
		// number modulo 2 is 0
		if index%2 == 0 {
			priceString := fmt.Sprintf("%f", price)
			placeholder = ticker + "-" + priceString
		} else {
			priceString := fmt.Sprintf("%f", price)
			placeholder += "-" + priceString
			DateRangeTickers = append(DateRangeTickers, placeholder)
		}
		index++
	}

	// Initializing new variable for formatted strings of cryptos that are selected by the user
	var OwnedTickers []string

	for i := 0; i < len(DateRangeTickers); i++ {
		tokens := strings.Split(DateRangeTickers[i], "-")
		for j := 0; j < len(Tickers); j++ {
			if tokens[0] == Tickers[j] {
				OwnedTickers = append(OwnedTickers, DateRangeTickers[i])
			}
		}
	}

	// Coding the response to be a map, where the key is the coin that is owned
	// and underperformed, and the value of that key is the coin that the user
	// did not own that outperformed the beforementioned owned coin.
	response := make(map[string]string)

	// Looping through each crypto in the list of cryptos with start and end data
	// and then consecutively looping through each crypto that is owned by the user
	// to determine if the percent increase from the buy date to the sell date of the owned coin
	// is less than that of a coin the user did not select.. therefore it was a better investment opp.
	for i := 0; i < len(DateRangeTickers); i++ {
		tokens := strings.Split(DateRangeTickers[i], "-")
		for j := 0; j < len(OwnedTickers); j++ {
			tokens2 := strings.Split(OwnedTickers[j], "-")
			if tokens[0] == tokens2[0] {

			} else {
				ownedBuyFloat, err := strconv.ParseFloat(tokens2[1], 64)
				if err != nil {
					log.Fatal(err)
				}
				ownedSellFloat, err := strconv.ParseFloat(tokens2[2], 64)
				if err != nil {
					log.Fatal(err)
				}
				newBuyFloat, err := strconv.ParseFloat(tokens[1], 64)
				if err != nil {
					log.Fatal(err)
				}
				newSellFloat, err := strconv.ParseFloat(tokens[2], 64)
				if err != nil {
					log.Fatal(err)
				}

				var ownedDiff float64 = (ownedSellFloat - ownedBuyFloat) / ownedBuyFloat
				var newDiff float64 = (newSellFloat - newBuyFloat) / newBuyFloat

				// Adding the response to the before mentioned map
				if ownedDiff < newDiff {
					response[OwnedTickers[j]] = DateRangeTickers[i]
				}
			}
		}
	}

	// Setting headers
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)

	// Packing response as type JSON
	jsonResponse, err := json.Marshal(response)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	// Write JSON response
	w.Write(jsonResponse)
}
