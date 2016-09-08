package main

import (
	"fmt"
	"time"

	"github.com/MustWin/micropay/oracles"
)

func main() {
	bw := oracles.NewBlockWatcher("http://127.0.0.1:8545", 15*time.Second)
	for id := range bw.Ch {
		fmt.Printf("new block %q\n", id)
	}
}
