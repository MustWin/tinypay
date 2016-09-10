package main

import (
	"fmt"
	"time"

	"oracles"
)

func main() {
	evtWatcher := oracles.NewEventWatcher("http://127.0.0.1:8545", 15*time.Second, "")
	for evt := range evtWatcher.Ch {
		fmt.Printf("new event %+v\n", evt)
	}
}
