package main

import (
	"fmt"
	"time"

	"github.com/MustWin/micropay/oracles"
)

func main() {
	bw := oracles.NewEventWatcher("http://127.0.0.1:8545", 15*time.Second)
	for log := range bw.Ch {
		fmt.Printf("new block %v\n", log)
	}
}
