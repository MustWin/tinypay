package main

import (
	"fmt"
	"time"

	"oracles"
)

func main() {
	r := &oracles.BlockRange{
		From: "0x1",
		To:   "latest",
	}
	evtWatcher := oracles.NewEventWatcher("http://127.0.0.1:8545", 15*time.Second, r, "")
	for evt := range evtWatcher.Ch {
		fmt.Printf("new event %+v\n", evt)
	}
}
