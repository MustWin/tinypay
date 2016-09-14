package main

import (
	"fmt"
	"os"
	"time"

	"github.com/urfave/cli"

	"oracles"
)

func main() {
	app := cli.NewApp()
	app.Action = Main
	app.Run(os.Args)
}

func Main(c *cli.Context) error {
	bw := oracles.NewBlockWatcher("http://127.0.0.1:8545", 15*time.Second)
	for id := range bw.Ch {
		fmt.Printf("new block %q\n", id)
	}
	return nil
}
